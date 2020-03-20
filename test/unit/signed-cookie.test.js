import { SignedCookiePlugin } from '../../mezcal/plugins/signed-cookie/signed-cookie';

describe('Signed cookie', () => {
  it("doesn't fail on no config", async () => {
    const Context = function Context() {};
    SignedCookiePlugin.SignedCookie({ Context });
    const ctx = new Context();

    expect(ctx.signedCookie).toStrictEqual({});
  });
});
