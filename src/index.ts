import pLimit from "p-limit";
import { MinecraftJSON } from "./util/mcjson";
import { platform, arch } from 'os';
import fs from 'node:fs/promises';
import crypto from 'node:crypto'
import { downloadWithRetry } from "./util/fileDl";
import { getLastUrlSegment } from "./util/functions";
import { InstallerConstructorData, InstallerInstallOpts, DownloadList } from "./util/types";

export class Installer {
    private version: string;
    private url: string;
    constructor(data: InstallerConstructorData) {
        this.version = data.version;
        this.url = data.url;
    }

    async install(installOpts: InstallerInstallOpts) {
        installOpts.onStart();
        
        // get the json file
        const response = await fetch(this.url).then(async res => await res.json() as MinecraftJSON);

        // generate download lists
        const list: DownloadList[] = []
        response.libraries.map(lib => {
            if (lib.downloads) {
                const { artifact, classifiers } = lib.downloads;
                if (artifact) {
                    list.push({
                        path: artifact.path,
                        sha1: artifact.sha1,
                        size: artifact.size,
                        url: artifact.url,
                        type: 'lib'
                    })
                }
                if (classifiers) {
                    const osVersion = platform()
                    let treatedOsVersion
                    switch (osVersion) {
                        case 'win32':
                            treatedOsVersion = 'windows'
                            break;
                        case 'darwin':
                            treatedOsVersion = 'osx'
                            break;
                        case 'linux':
                            treatedOsVersion = 'linux'
                            break;
                        default:
                            treatedOsVersion = 'unknown'
                            break;
                    }
                    if (treatedOsVersion === 'unknown')
                        throw new Error('Unsupported OS')
                    if (classifiers["natives-windows-32"] || classifiers["natives-windows-64"]) {
                        const osArch = arch() === 'x64' ? '64' : '32'
                        treatedOsVersion = `windows-${osArch}`
                    }

                    // @ts-ignore this should work
                    const classifier = classifiers[`natives-${treatedOsVersion}`]
                    if (!classifier) {
                        return console.log('No classifier found for ', lib.name)
                    }
                    list.push({
                        path: classifier.path,
                        sha1: classifier.sha1,
                        size: classifier.size,
                        url: classifier.url,
                        type: 'lib'
                    })
                }
            }
            list.push({
                url: response.assetIndex.url,
                sha1: response.assetIndex.sha1,
                size: response.assetIndex.size,
                type: 'assetIndex'
            })
            list.push({
                url: response.downloads.client.url,
                sha1: response.downloads.client.sha1,
                size: response.downloads.client.size,
                type: 'jar'
            })
            list.push({
                url: response.logging.client.file.url,
                sha1: response.logging.client.file.sha1,
                size: response.logging.client.file.size,
                fileName: response.logging.client.file.id,
                type: 'log'
            })
        });
        const assetIndexFetch = await fetch(response.assetIndex.url).then(async res => await res.json());
        for (const key in assetIndexFetch.objects) {
            const obj = assetIndexFetch.objects[key];
            list.push({
                url: `https://resources.download.minecraft.net/${obj.hash.slice(0, 2)}/${obj.hash}`,
                sha1: obj.hash,
                size: obj.size,
                path: `${obj.hash.slice(0, 2)}/${obj.hash}`,
                type: 'asset'
            })
        }
        list.push({
            url: this.url,
            // the sha1 should be calculated from the file contents themselves
            sha1: crypto.createHash('sha1').update(JSON.stringify(response)).digest('hex'),
            // placeholder until we can get the actual size
            size: response.downloads.client.size,
            type: 'clientJson'
        })
        const totalFiles = list.length;
        console.log(`Downloading ${totalFiles} files...`)
        // download the files
        let progress = 0;
        const limit = pLimit(10);
        const downloadPromises = list.map((file) => {
            return limit(async () => {
                const buffer = await downloadWithRetry(file);

                switch (file.type) {
                    case 'lib':
                        await fs.mkdir(`./.minecraft/libraries/${file.path!.split('/').slice(0, -1).join('/')}`, { recursive: true });
                        await fs.writeFile(`./.minecraft/libraries/${file.path}`, Buffer.from(buffer));
                        break;
                    case 'assetIndex':
                        await fs.mkdir(`./.minecraft/assets/indexes`, { recursive: true });
                        await fs.writeFile(`./.minecraft/assets/indexes/${getLastUrlSegment(file.url)}`, Buffer.from(buffer));
                        break;
                    case 'asset':
                        await fs.mkdir(`./.minecraft/assets/objects/${file.path!.split('/').slice(0, -1).join('/')}`, { recursive: true });
                        await fs.writeFile(`./.minecraft/assets/objects/${file.path}`, Buffer.from(buffer));
                        break;
                    case 'jar':
                        await fs.mkdir(`./.minecraft/versions/${this.version}`, { recursive: true });
                        await fs.writeFile(`./.minecraft/versions/${this.version}/${this.version}.jar`, Buffer.from(buffer));
                        break;
                    case 'log':
                        await fs.mkdir(`./.minecraft/assets/log_configs`, { recursive: true });
                        await fs.writeFile(`./.minecraft/assets/log_configs/${file.fileName}`, Buffer.from(buffer));
                        break;
                    case 'clientJson':
                        await fs.mkdir(`./.minecraft/versions/${this.version}`, { recursive: true });
                        await fs.writeFile(`./.minecraft/versions/${this.version}/${this.version}.json`, Buffer.from(buffer));
                        break;
                }

                progress++;
                installOpts.onProgress(progress / totalFiles * 100);
                // basically what isAsset means is that the file is usually a really small one and might ratelimit the requests
                return { file };
            });
        });
        await Promise.all(downloadPromises);
        installOpts.onFinish();
    }
}



