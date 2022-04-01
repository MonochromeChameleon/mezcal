import { CookiePlugin } from '../../mezcal/plugins/cookie/cookie.js';

class Context {
  constructor(cookie) {
    this.req = { headers: { cookie } };
  }
}

describe('Cookie plugin', () => {
  let decode;
  CookiePlugin.Cookie({ Context }, { decode: () => decode() });

  it('Uses custom decode function when provided', () => {
    decode = () => 'hi there';
    const ctx = new Context('value=ignored');
    expect(ctx.cookie.value).toBe('hi there');
  });

  it('Swallows decode errors', () => {
    decode = () => {
      throw new Error('Oh no!');
    };
    const ctx = new Context('value=hi there');
    expect(ctx.cookie.value).toBe('hi there');
  });
});
