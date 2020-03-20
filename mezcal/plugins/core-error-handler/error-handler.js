import { defineCachedProperty, importFiles } from '@mezcal/utils';

const errorHandlers = Symbol('handlers');

export const CoreErrorHandlerPlugin = {
  Use({ ErrorHandler }) {
    Object.defineProperty(ErrorHandler.prototype, 'use', {
      value(p) {
        this[errorHandlers] = this[errorHandlers] || [];
        this[errorHandlers].push(importFiles(p));
      },
    });
  },
  Handlers({ ErrorHandler }) {
    defineCachedProperty(ErrorHandler.prototype, 'handlers', function handlers() {
      return Promise.all(this[errorHandlers]).then(ps => ps.flat(Infinity).filter(it => it.isError));
    });
  },
  Error({ ErrorHandler }) {
    Object.defineProperty(ErrorHandler.prototype, 'error', {
      async value(e, ctx) {
        const allHandlers = await this.handlers;

        await Promise.all(allHandlers.filter(it => it.isError(e, ctx)).map(it => it.handler(e, ctx)));
        ctx.error(e);
      },
    });
  },
};
