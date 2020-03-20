import jsonwebtoken from 'jsonwebtoken';
import { ForbiddenError } from '@mezcal/errors';

const extractRawJwt = ctx => (ctx.req.headers.authorization || '').replace(/^bearer\s+/i, '');

const extractJwt = async (ctx, opts) => {
  const rawJwt = extractRawJwt(ctx);
  const cert = await opts.cert;

  return jsonwebtoken.verify(rawJwt, cert, opts.options);
};

export const SecurityJwtPlugin = {
  Jwt({ Security }, opts) {
    Object.defineProperty(Security.prototype, 'authenticate', {
      async value(ctx) {
        try {
          ctx.security = ctx.security || {};
          ctx.security.jwt = await extractJwt(ctx, opts);
          return true;
        } catch (e) {
          throw new ForbiddenError();
        }
      },
    });
  },
};
