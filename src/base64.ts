/**
 * Converts a Uint8Array to a URL-safe Base64 string.
 * @param data The binary data to encode.
 * @returns A URL-safe Base64 string.
 */
export function toBase64URL(data: Uint8Array): string {
  // btoa is a built-in browser function to create a Base64 string
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(data)));
  // Make the Base64 string URL-safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Converts a URL-safe Base64 string back to a Uint8Array.
 * @param base64URL The URL-safe Base64 string.
 * @returns The decoded binary data as a Uint8Array.
 */
export function fromBase64URL(base64URL: string): Uint8Array {
  // Add padding back and convert to standard Base64
  const padding = '='.repeat((4 - (base64URL.length % 4)) % 4);
  const base64 = (base64URL + padding).replace(/-/g, '+').replace(/_/g, '/');

  // atob is a built-in browser function to decode a Base64 string
  const binaryStr = atob(base64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}
