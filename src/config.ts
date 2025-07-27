import { deflate, inflate } from 'fflate';
import { toBase64URL, fromBase64URL } from './base64';

// The TextEncoder and TextDecoder are built-in browser APIs
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Asynchronously compresses a JavaScript object into a Base64URL string.
 * @param obj The JavaScript object to compress.
 * @returns A Promise that resolves with the compressed, URL-safe string.
 */
export function objectToCompressedString(obj: object): Promise<string> {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(obj);
    const uint8Array = textEncoder.encode(jsonString);

    deflate(uint8Array, (err, compressedData) => {
      if (err) {
        return reject(err);
      }
      resolve(toBase64URL(compressedData));
    });
  });
}

/**
 * Asynchronously decompresses a Base64URL string back into a JavaScript object.
 * @param str The compressed Base64URL string.
 * @returns A Promise that resolves with the reconstituted object.
 */
export function compressedStringToObject(str: string): Promise<object> {
  return new Promise((resolve, reject) => {
    try {
      const uint8Array = fromBase64URL(str);
      inflate(uint8Array, (err, decompressedData) => {
        if (err) {
          return reject(err);
        }
        const jsonString = textDecoder.decode(decompressedData);
        resolve(JSON.parse(jsonString));
      });
    } catch (error) {
      reject(error);
    }
  });
}
