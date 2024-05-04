export interface InstallerConstructorData {
    // version of the minecraft version to install
    version: string;
    // url to the minecraft json file
    url: string;
    // path to install the minecraft version
    path: string;
}

export interface InstallerInstallOpts {
    onStart(): void;
    onProgress(progress: number): void;
    onFinish(): void;
    onError(error: Error): void;
}

export interface DownloadList {
    url: string;
    sha1: string;
    size: number;
    path?: string;
    fileName?: string;
    type: 'lib' | 'assetIndex' | 'jar' | 'log' | 'asset' | 'clientJson';
}