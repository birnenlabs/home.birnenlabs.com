import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Home Page',
        short_name: 'Home Page',
        description: 'A clean and fast personal start page for your browser.',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#007bff',
        // An array of icons for different resolutions
        icons: [
          {
            src: '/main.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // This is the updated, more robust urlPattern
            urlPattern: ({ request, url }) => {
              // Rule only applies to cross-origin requests
              if (url.origin === self.location.origin) {
                return false;
              }
              // Cache if it's an image request OR the URL ends with an image extension
              return request.destination === 'image' || 
                     /\.(?:png|jpg|jpeg|svg|ico)$/i.test(url.pathname);
            },
              
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-images-cache-3',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
