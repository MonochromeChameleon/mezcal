import { Mezcal } from '../../mezcal/core/mezcal';
import { DefaultHeadersPlugin } from '../../mezcal/plugins/default-headers';

describe('Default headers plugin', () => {
  const mz = new Mezcal();
  mz.plugin(DefaultHeadersPlugin);

  mz.use({
    method: 'GET',
    path: 'foo',
    handler: () => 'foo',
  });

  it('survives with no opts', async () => {
    const assertions = [];
    const assert = assertions.push.bind(assertions);
    const req = { method: 'GET', url: '/foo' };
    const res = {
      writeHead: assert,
      setHeader: () => {
        throw new Error();
      },
      write: assert,
      end: assert,
    };

    await mz.handle(req, res);

    expect(assertions.length).toBe(3);
    expect(assertions[0]).toBe(200);
    expect(assertions[1]).toStrictEqual({ 'Content-Type': 'text/plain' });
    expect(assertions[2]).toBe('foo');
  });
});
