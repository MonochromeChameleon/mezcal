import { defineCachedProperty, importFiles } from '@mezcal/utils';
import { NotFoundError } from '@mezcal/errors';

import { Route } from './lib/route.js';
import { buildRouteTree } from './utils/build-route-tree.js';

const notFound = {
  handler() {
    throw new NotFoundError();
  },
};

const routeDefs = Symbol('routes');

export const CoreRouterPlugin = {
  Use({ Router }) {
    Object.defineProperty(Router.prototype, 'use', {
      value(p) {
        this[routeDefs] = this[routeDefs] || [];
        this[routeDefs].push(importFiles(p));
      },
    });
  },
  Routes({ Router }) {
    defineCachedProperty(Router.prototype, 'routes', function routes() {
      return Promise.all(this[routeDefs] || [])
        .then(ps =>
          ps
            .flat(Infinity)
            .filter(it => !it.isError)
            .flatMap(Route.parse)
        )
        .then(buildRouteTree);
    });
  },
  Route({ Router }) {
    Object.defineProperty(Router.prototype, 'route', {
      async value(method, url) {
        return (await this.routes).lookup(method, url) || notFound;
      },
    });
  },
};
