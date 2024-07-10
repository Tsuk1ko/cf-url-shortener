import arrayBufferToHex from 'array-buffer-to-hex';
import { ID_LEN } from './const';

const BASE = 56n;
const BASE56 = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';

const hexToB56 = (hex: string) => {
  let dec = BigInt(`0x${hex}`);
  const result = [];
  while (dec > 0) {
    result.unshift(BASE56[Number(dec % BASE)]);
    dec /= BASE;
  }

  return result.slice(-ID_LEN).join('').padStart(ID_LEN, BASE56[0]);
};

const getB56s = (hex: string) => {
  const GROUP_NUM = 4;
  const groups = new Array(GROUP_NUM).fill(null).map(() => [] as string[]);
  for (let i = 0; i < hex.length; i++) {
    groups[i % GROUP_NUM].push(hex.charAt(i));
  }
  return groups.map(group => hexToB56(group.join('')));
};

export const getSha1Ids = async (url: string) => {
  const textBuffer = new TextEncoder().encode(url);
  const digest = await crypto.subtle.digest({ name: 'SHA-1' }, textBuffer);
  const hex = arrayBufferToHex(digest);
  return getB56s(hex);
};

const randInts = (min: number, max: number, len = 1) => {
  const buffer = new Uint32Array(len);
  crypto.getRandomValues(buffer);
  return Array.from(buffer).map(num => {
    const randNum = num / (0xffffffff + 1);
    return Math.floor(randNum * (max - min + 1)) + min;
  });
};

export const getRandId = () =>
  randInts(0, BASE56.length - 1, ID_LEN)
    .map(num => BASE56.charAt(num))
    .join('');
