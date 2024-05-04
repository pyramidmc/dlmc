import { describe, it } from 'vitest'
import { Installer } from '../src'

describe('index', () => {
    it('should install 1.8.9', async () => {
        let lastProgress = 0
        const insta = new Installer({ url: 'https://piston-meta.mojang.com/v1/packages/d546f1707a3f2b7d034eece5ea2e311eda875787/1.8.9.json', version: '1.8.9', path: './.minecraft' });
        await insta.install({
            onError() {},
            onFinish() {
                console.log('done')
            },
            onProgress(prog) {
                const rounded = Math.round(prog)
                if (rounded !== lastProgress) {
                    console.log(`Progress: ${rounded}%`)
                    lastProgress = rounded
                }
            },
            onStart() {}
        })
    })
    it('should install 1.20.6', async () => {
        let lastProgress = 0
        const insta = new Installer({ url: 'https://piston-meta.mojang.com/v1/packages/376f460c35740f490082af166f4464d5a8eeaf04/1.20.6.json', version: '1.20.6', path: './.minecraft' });
        await insta.install({
            onError() {},
            onFinish() {
                console.log('done')
            },
            onProgress(prog) {
                const rounded = Math.round(prog)
                if (rounded !== lastProgress) {
                    console.log(`Progress: ${rounded}%`)
                    lastProgress = rounded
                }
            },
            onStart() {}
        })
    })
})