import { makePagesFunction } from 'vite-plugin-cloudflare-functions/worker';
import { ShortenReq, ShortenRes, ShortenCode } from '../../types/shorten';
import { ShortenDB } from '../utils/db';
import * as lib from '../utils/sha1Id';

const URL_MAX_LEN = 1024;

const urlReg = /^https?:\/\/[\w_-]+(\.[\w_-]+)*[!-~]*$/;

const errMap: Record<ShortenCode, string> = {
  [ShortenCode.INTERNAL_ERROR]: 'Internal error',
  [ShortenCode.OK]: '',
  [ShortenCode.NO_URL]: 'No URL',
  [ShortenCode.INVALID_URL]: 'Not a valid URL',
  [ShortenCode.EXCEEDED_MAX_LENGTH]: `URL length cannot be greater than ${URL_MAX_LEN}`,
  [ShortenCode.KEY_FULL]: 'No available ID',
};

const makeRes = (code: ShortenCode, url?: string): ShortenRes => ({
  code,
  msg: errMap[code],
  url,
});

export const onRequestPost = makePagesFunction<ShortenRes>(async ({ request, env }) => {
  try {
    const req = request as Request;
    const { url } = await req.json<ShortenReq>().catch<Partial<ShortenReq>>(() => ({}));

    if (!url) return makeRes(ShortenCode.NO_URL);
    if (!urlReg.test(url)) return makeRes(ShortenCode.INVALID_URL);
    if (url.length > URL_MAX_LEN) return makeRes(ShortenCode.EXCEEDED_MAX_LENGTH);

    const db = new ShortenDB(env.CF_URL_SHORTENER_DB, lib);
    const id = await db.addUrl(url);

    if (!id) return makeRes(ShortenCode.KEY_FULL);

    const shortenUrl = new URL(req.url);
    shortenUrl.pathname = `/${id}`;
    shortenUrl.search = '';

    return makeRes(ShortenCode.OK, shortenUrl.href);
  } catch (error) {
    console.error('[INTERNAL_ERROR]', error);
    return makeRes(ShortenCode.INTERNAL_ERROR);
  }
});
