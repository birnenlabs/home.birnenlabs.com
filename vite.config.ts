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
        // Add this runtime caching rule
        runtimeCaching: [
          {
            // Match any request that ends with a common image extension
            urlPattern: /\.(?:png|jpg|jpeg|svg|ico)$/i,
            // Apply a cache-first strategy
            handler: 'CacheFirst',
            options: {
              // Use a custom cache name
              cacheName: 'external-images-cache2',
              expiration: {
                // Cache up to 50 images
                maxEntries: 60,
                // Cache for 30 days
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                // A status of 0 is what the service worker sees for
                // a successful opaque response.
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
