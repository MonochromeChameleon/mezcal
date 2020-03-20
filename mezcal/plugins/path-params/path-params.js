import { defineCachedProperty, zip } from '@mezcal/utils';

function parseParams(url, route) {
  const parts = `IGNORE/${url}`.split('/').filter(it => it);

  return zip(parts, route.matchers)
    .filter(({ second }) => second.param)
    .reduce((out, pair) => ({ ...out, [pair.second.param]: pair.first }), {});
}

export const PathParamsPlugin = {
  PathParams({ Context }) {
    defineCachedProperty(Context.prototype, 'pathParams', function pathParams() {
      return parseParams(this.url.pathname, this.route);
    });
  },
};
