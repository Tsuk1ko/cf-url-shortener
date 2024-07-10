import { makeRawPagesFunction, makeRawResponse, PagesFunctionEnv } from 'vite-plugin-cloudflare-functions/worker';
import { ShortenDB } from '../utils/db';
import { ID_LEN } from '../utils/const';

const res404 = () => makeRawResponse(null, { status: 404 });

export const onRequestGet = makeRawPagesFunction<any, PagesFunctionEnv, 'id'>(async ({ params: { id }, env }) => {
  if (typeof id !== 'string' || id.length !== ID_LEN) return res404();
  const db = new ShortenDB(env.CF_URL_SHORTENER_DB);
  const url = await db.getUrlById(id);
  if (!url) return res404();
  return Response.redirect(url, 301);
});
