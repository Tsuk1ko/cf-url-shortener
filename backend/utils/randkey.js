const BASE56 = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';

const randInts = (min, max, len = 1) => {
  const buffer = new Uint32Array(len);
  crypto.getRandomValues(buffer);
  return Array.from(buffer).map(num => {
    const randNum = num / (0xffffffff + 1);
    return Math.floor(randNum * (max - min + 1)) + min;
  });
};

export default async (length = 6, charset = BASE56) =>
  randInts(0, charset.length - 1, length)
    .map(num => charset.charAt(num))
    .join('');
