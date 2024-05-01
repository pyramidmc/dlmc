import { sleep } from "./functions";
import { DownloadList } from "./types";

export async function fetchFile(file: DownloadList) {
    const response = await fetch(file.url);
    const buffer = await response.arrayBuffer();
    const sha1 = await crypto.subtle.digest("SHA-1", buffer);
    const hashArray = Array.from(new Uint8Array(sha1));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    if (hashHex !== file.sha1) {
      console.log(
        `Hash mismatch for ${file.url}! Expected ${file.sha1} but got ${hashHex}`
      );
    }
    return buffer;
}
  
export async function downloadWithRetry(file: any): Promise<ArrayBuffer> {
      for (let i = 0; i < 5; i++) {
          try {
              return await fetchFile(file);
          } catch (e) {
              console.log('Error downloading file, retrying in 500ms...')
              await sleep(500);
              if (i === 4) { // if this was the 5th attempt
                  throw new Error(`Failed to download file after 5 attempts: ${file.path}`);
              }
          }
      }
      throw new Error(`Failed to download file: ${file.path}`);
}