/**
 * Checks if an image exists at a given URL.
 * @param src The URL of the image to check.
 * @returns A Promise that resolves with the src if the image loads, and rejects if it fails.
 */
function checkImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Returns a URL for Google's favicon service.
 * @param url The website URL.
 * @returns The URL to the Google favicon service.
 */
function getGoogleFavicon(url: string): string {
  const domain = new URL(url).hostname;
  return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
}

/**
 * Attempts to find an icon for a given website URL by checking common paths in parallel.
 * @param url The full URL of the website (e.g., "https://www.github.com").
 * @returns A Promise that resolves with the URL of the first found icon, or a fallback.
 */
export function getIconForUrl(url: URL): Promise<string> {
  let siteOrigin: string;
  try {
    siteOrigin = url.origin;
  } catch (error) {
    return Promise.reject(new Error('Invalid URL provided.'));
  }

  const potentialIconPaths = [
    '/apple-touch-icon.png',
    '/icon-512x512.png',
    '/icon-192x192.png',
    '/icon-128x128.png',
    '/android-chrome-192x192.png',
    '/favicon-32x32.png',
    '/favicon.ico',
  ];

  // Create an array of promises, one for each potential icon path
  const checkPromises = potentialIconPaths.map(path => checkImage(`${siteOrigin}${path}`));

  // Create a fallback chain so the failing nth promise will fallback to nth + 1.
  for (let i = checkPromises.length - 2; i >= 0; i--) {
    checkPromises[i] = checkPromises[i].catch(() => checkPromises[i + 1]);
  }
  return checkPromises[0].catch(() => getGoogleFavicon(url.toString()));
}