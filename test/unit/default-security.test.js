import { Mezcal } from '../../mezcal/core/mezcal';

describe('Default security', () => {
  const mz = new Mezcal();

  mz.use({
    method: 'GET',
    path: 'foo',
    handler: () => 'foo',
    secure: true,
  });

  it('Returns 403 for secure paths', async () => {
    const assertions = [];
    const assert = assertions.push.bind(assertions);
    const req = { method: 'GET', url: '/foo' };
    const res = { writeHead: assert, write: assert, end: assert };

    await mz.handle(req, res);
    expect(assertions.length).toBe(3);
    expect(assertions[0]).toBe(403);
    expect(assertions[1]).toStrictEqual({ 'Content-Type': 'text/plain' });
    expect(assertions[2]).toBe('Forbidden');
  });
});
