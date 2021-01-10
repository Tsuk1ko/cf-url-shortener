import { Application, Router } from '@cfworker/web';
import randkey from './utils/randkey';

// dev
// import MemKV from './mocks/kv';
// const URL_DB = new MemKV();

const router = new Router();
const tmpMap = new Map();
const urlReg = /^https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

const errMap = {
  1000: '网址呢',
  1001: '不是有效的网址',
  1002: '键已饱和，无法生成短网址',
};
const resError = (res, code) => {
  res.body = { code, msg: errMap[code] };
};

router.get('/:key', async ({ req, res }) => {
  const { key } = req.params;
  try {
    const url = await URL_DB.get(key);
    if (url) {
      res.status = 301;
      res.redirect(url);
    } else res.status = 404;
  } catch (error) {
    res.status = 503;
    res.body = error.toString();
  }
});

router.post('/shorten', async ({ req, res }) => {
  try {
    const { url: longUrl } = await req.body.json();
    if (!longUrl) {
      resError(res, 1000);
      return;
    }
    if (!urlReg.test(longUrl)) {
      resError(res, 1001);
      return;
    }
    let key;
    if (tmpMap.has(longUrl)) key = tmpMap.get(longUrl);
    else {
      let tryRemain = 101;
      do {
        key = await randkey();
      } while (--tryRemain && (await URL_DB.get(key)));
      if (!tryRemain) {
        resError(res, 1002);
        return;
      }
      await URL_DB.put(key, longUrl);
      tmpMap.set(longUrl, key);
    }
    const url = new URL(req.url.href);
    url.search = '';
    url.pathname = `/${key}`;
    res.body = { code: 0, msg: '', url: url.href };
  } catch (error) {
    res.body = { code: -1, msg: error.toString() };
  }
});

new Application().use(router.middleware).listen();
