import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        devOptions: {
          enabled: false,
        },
        manifest: {
          id: '/',
          name: 'Vermisstensuche & Einsatzleitung',
          short_name: 'Rescuetrack',
          description: 'Taktisches Einsatzleitsystem für Rettungshunde & Einsatzkräfte - Spürhunde-Salzlandkreis e.V.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#0F172A',
          theme_color: '#0F172A',
          orientation: 'portrait-primary',
          icons: [
            {
              src: '/assets/icon-192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/assets/icon-512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
          // Ensure background sync and navigation preload are enabled for better offline behavior
          navigationPreload: true,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: false,
      watch: null,
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
