import { ForbiddenError } from '@mezcal/errors';

export const CoreSecurityPlugin = {
  Authenticate({ Security }) {
    Object.defineProperty(Security.prototype, 'authenticate', {
      async value() {
        throw new ForbiddenError();
      },
      configurable: true,
    });
  },
  SecurityPlugin({ Security }) {
    Object.defineProperty(Security.prototype, 'secured', {
      value(route, ctx) {
        return route.secure ? this.authenticate(ctx).then(() => route) : route;
      },
    });
  },
};
