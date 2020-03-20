import crypto from 'crypto';

import { defineCachedProperty } from '@mezcal/utils';

const sign = (str, secret) => {
  const sig = crypto.createHmac('sha256', secret).update(str).digest('base64').replace(/=+$/, '');
  return `${str}.${sig}`;
};

const parseSignedCookie = (cookie = {}, opts) => {
  if (!opts.secret) return cookie;

  return Object.keys(cookie)
    .filter(k => cookie[k].startsWith('s:'))
    .reduce((sofar, k) => {
      const val = cookie[k].substr(2);
      const [content] = val.split(/\.(?!.*\.)/);
      const newSigned = sign(content, opts.secret);

      const signedBuffer = Buffer.from(newSigned);
      const originalBuffer = Buffer.alloc(newSigned.length);
      originalBuffer.write(val);

      if (crypto.timingSafeEqual(signedBuffer, originalBuffer)) {
        sofar[k] = content;
      }
      return sofar;
    }, {});
};

export const SignedCookiePlugin = {
  SignedCookie({ Context }, opts = {}) {
    defineCachedProperty(Context.prototype, 'signedCookie', function signedCookie() {
      return parseSignedCookie(this.cookie, opts);
    });
  },
};
