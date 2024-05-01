import { describe, it } from 'vitest'
import { Installer } from '../src'

describe('index', () => {
    it('should return a download list', async () => {
        //const insta = new Installer({ url: 'https://piston-meta.mojang.com/v1/packages/376f460c35740f490082af166f4464d5a8eeaf04/1.20.6.json', version: '1.20.6' });
        const insta = new Installer({ url: 'https://piston-meta.mojang.com/v1/packages/d546f1707a3f2b7d034eece5ea2e311eda875787/1.8.9.json', version: '1.8.9' });
            await insta.install({
                onError() {},
                onFinish() {
                    console.log('done')
                },
                onProgress(prog) {
                    console.log(`Progress: ${prog}%`)
                },
                onStart() {}
            })
    })
})