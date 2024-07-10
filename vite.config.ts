import { fileURLToPath, URL } from 'node:url';
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import functions from 'vite-plugin-cloudflare-functions';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    {
      name: 'vite-plugin-fix-wrangler',
      configureServer: () => {
        rmSync(resolve(import.meta.dirname, 'api/node_modules'), { recursive: true });
      },
    },
    functions({
      root: './api/functions',
      dts: false,
      wrangler: {
        // log: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      types: fileURLToPath(new URL('./types', import.meta.url)),
    },
  },
});
