import querystring from 'querystring';
import { defineCachedProperty } from '@mezcal/utils';

export const QueryParamsPlugin = {
  QueryParams({ Context }) {
    defineCachedProperty(Context.prototype, 'queryParams', function queryParams() {
      return querystring.decode(this.url.search.replace(/^\?/, ''));
    });
  },
};
