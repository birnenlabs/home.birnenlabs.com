/**
 * Checks if an image exists at a given URL.
 * @param src The URL of the image to check.
 * @returns A Promise that resolves with the src if the image loads, and rejects if it fails.
 */
function checkImage(src: string): Promise<string> {
  const loadImgPromise = new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });

  return Promise.race([
    loadImgPromise,
    new Promise<string>((_, fail) => setTimeout(() => fail(new Error(`Timeout: ${src}`)), 5000))
  ]);
}

function hslToRgb(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));
  return `rgb(${r}, ${g}, ${b})`;
}

export function getFallbackIconForUrl(url: URL): string {
  const letter = url.hostname.replace(/^www\./, '').charAt(0).toUpperCase();

  // --- Generate Random Contrasting Pastel Colors ---
  const hue = Math.floor(Math.random() * 360);
  const saturation = 50 + Math.random() * 10; // Saturation between 50-60%
  
  // A light pastel background color
  const backgroundColor = hslToRgb(hue, saturation, 90); // Lightness at 90%

  // A dark text color with the same hue for contrast and harmony
  const textColor = hslToRgb(hue, saturation, 30); // Lightness at 30%

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="32" font-family="sans-serif" font-weight="bold" fill="${textColor}">
        ${letter}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
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
  return checkPromises[0].catch(() => getFallbackIconForUrl(url));
}