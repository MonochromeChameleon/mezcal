import { defineCachedProperty } from '@mezcal/utils';

const parseCookie = (opts, cookieString = '') => {
  const decode = opts.decode || decodeURIComponent;
  const tryDecode = string => {
    try {
      return decode(string);
    } catch {
      return string;
    }
  };

  return cookieString.split(';').reduce((sofar, kv) => {
    const [k, v] = kv.split(/(?<!=.*)=/);
    sofar[k.trim()] = tryDecode(v);
    return sofar;
  }, {});
};

export const CookiePlugin = {
  Cookie({ Context }, opts = {}) {
    defineCachedProperty(Context.prototype, 'cookie', function cookie() {
      return parseCookie(opts, this.req.headers.cookie);
    });
  },
};
