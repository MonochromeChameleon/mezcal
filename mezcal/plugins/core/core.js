import http from 'http';

import { CoreContextPlugin } from '@mezcal/plugin-core-context';
import { CoreErrorHandlerPlugin } from '@mezcal/plugin-core-error-handler';
import { CoreRouterPlugin } from '@mezcal/plugin-core-router';
import { CoreSecurityPlugin } from '@mezcal/plugin-core-security';
import { defineCachedProperty } from '@mezcal/utils';

import { greenBottle } from './lib/bottle';

async function handle(req, res) {
  const [route, ctx] = await Promise.all([this.router.route(req.method, req.url), this.createContext(req, res)]);
  try {
    ctx.route = await this.security.secured(route, ctx);
    ctx.result = await ctx.route.handler(ctx, this);
  } catch (e) {
    await this.errorHandler.error(e, ctx).catch(ctx.error);
  }
}

export const CorePlugin = {
  CoreContextPlugin,
  CoreErrorHandlerPlugin,
  CoreRouterPlugin,
  CoreSecurityPlugin,
  DefineInstanceProperties({ ErrorHandler, Router, Security }, opts, mz) {
    defineCachedProperty(mz, 'errorHandler', () => new ErrorHandler());
    defineCachedProperty(mz, 'router', () => new Router());
    defineCachedProperty(mz, 'security', () => new Security());
    defineCachedProperty(mz, 'server', http.createServer, (req, res) => mz.handle(req, res));
  },
  CreateContext({ Context }, opts, mz) {
    Object.defineProperty(mz, 'createContext', { value: Context.create });
  },
  Handle(_, opts, mz) {
    Object.defineProperty(mz, 'handle', { value: handle });
  },
  Listen(_, opts, mz) {
    Object.defineProperty(mz, 'listen', {
      value(port = 8080) {
        return new Promise(resolve => this.server.listen(port, resolve))
          .then(() => console.log(greenBottle)) // eslint-disable-line no-console
          .then(() => this);
      },
    });
  },
  Close(_, opts, mz) {
    Object.defineProperty(mz, 'close', {
      value() {
        return new Promise(resolve => this.server.close(resolve))
          .then(() => console.log('\u001b[34mgoodbye\u001b[39m')) // eslint-disable-line no-console
          .then(() => this);
      },
    });
  },
  Use(_, opts, mz) {
    Object.defineProperty(mz, 'use', {
      value(p) {
        this.router.use(p);
        this.errorHandler.use(p);
        return this;
      },
    });
  },
};
