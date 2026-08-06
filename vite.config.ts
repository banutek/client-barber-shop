import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: {
        background_color: '#ffffff',
        description: 'Barber Shop Client',
        display: 'standalone',
        icons: [
          {
            purpose: 'any maskable',
            sizes: '192x192',
            src: 'pwa-192x192.png',
            type: 'image/png',
          },
          {
            purpose: 'any maskable',
            sizes: '512x512',
            src: 'pwa-512x512.png',
            type: 'image/png',
          },
        ],
        name: 'client-barber',
        scope: '/',
        short_name: 'client-barber',
        start_url: '/',
        theme_color: '#ffffff',
      },
      registerType: 'autoUpdate',
      srcDir: 'src',
      strategies: 'injectManifest',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
