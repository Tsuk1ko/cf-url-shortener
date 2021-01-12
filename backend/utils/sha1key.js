const arrayBufferToHex = require('array-buffer-to-hex');

const hexToB56 = (hex, maxLen = 6) => {
  const DIGITS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  const BASE = BigInt(DIGITS.length);

  let dec = BigInt(`0x${hex}`);
  const result = [];
  while (dec > 0) {
    result.unshift(DIGITS[dec % BASE]);
    dec /= BASE;
  }

  return result
    .slice(0 - maxLen)
    .join('')
    .padStart(maxLen, DIGITS[0]);
};

const getB56s = (hex, groupNum = 4) => {
  const groups = new Array(groupNum).fill().map(() => []);
  for (let i = 0; i < hex.length; i++) {
    groups[i % groupNum].push(hex.charAt(i));
  }
  return groups.map(group => hexToB56(group.join('')));
};

module.exports = async url => {
  const textBuffer = new TextEncoder().encode(url);
  const digest = await crypto.subtle.digest({ name: 'SHA-1' }, textBuffer);
  const hex = arrayBufferToHex(digest);
  return getB56s(hex);
};
