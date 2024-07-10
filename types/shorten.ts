export interface ShortenReq {
  url: string;
}

export enum ShortenCode {
  INTERNAL_ERROR = -1,
  OK = 0,
  NO_URL = 1000,
  INVALID_URL = 1001,
  EXCEEDED_MAX_LENGTH = 1002,
  KEY_FULL = 1003,
}

export interface ShortenRes {
  code: ShortenCode;
  msg: string;
  url?: string;
}
