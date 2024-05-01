export function getLastUrlSegment(url: string) {
    return new URL(url).pathname.split('/').filter(Boolean).pop();
}

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
