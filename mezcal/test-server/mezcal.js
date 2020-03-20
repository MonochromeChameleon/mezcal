import { Mezcal } from '@mezcal/core';
import fs from 'fs';

import { CookiePlugin } from '@mezcal/plugin-cookie';
import { DefaultHeadersPlugin } from '@mezcal/plugin-default-headers';
import { PathParamsPlugin } from '@mezcal/plugin-path-params';
import { QueryParamsPlugin } from '@mezcal/plugin-query-params';
import { RequestBodyPlugin } from '@mezcal/plugin-request-body';
import { SecurityJwtPlugin } from '@mezcal/plugin-security-jwt';
import { SendFilePlugin } from '@mezcal/plugin-send-file';
import { SignedCookiePlugin } from '@mezcal/plugin-signed-cookie';

const mz = new Mezcal();

mz.plugin(CookiePlugin)
  .plugin(DefaultHeadersPlugin, {
    'X-DNS-Prefetch-Control': 'off',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=5184000',
    'X-Download-Options': 'noopen',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-XSS-Protection': '1; mode=block',
  })
  .plugin(PathParamsPlugin)
  .plugin(QueryParamsPlugin)
  .plugin(RequestBodyPlugin)
  .plugin(SecurityJwtPlugin, {
    get cert() {
      return fs.promises.readFile('mezcal/test-server/crypto/jwt-public-key.pub');
    },
    options: {
      algorithms: ['RS256'],
      audience: 'me',
      issuer: 'mezcal',
    },
  })
  .plugin(SendFilePlugin)
  .plugin(SignedCookiePlugin, { secret: 'oooooooh' })
  .use('mezcal/test-server/endpoints')
  .use('mezcal/test-server/error-handlers')
  .use({
    method: 'GET',
    path: '/foo',
    handler() {
      return 'foo';
    },
  })
  .use('test/fixtures/bar.js')
  .use('no-such-directory');

export { mz as Mezcal };
