/// <reference types="@cloudflare/workers-types" />

import 'vite-plugin-cloudflare-functions/worker';

declare module 'vite-plugin-cloudflare-functions/worker' {
  interface PagesFunctionEnv {
    CF_URL_SHORTENER_DB: D1Database;
  }
}
