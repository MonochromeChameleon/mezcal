import { Mezcal } from '../../mezcal/core/mezcal';
import { NotFoundError } from '../../mezcal/errors';

describe('Multiple instances', () => {
  const mz1 = new Mezcal();
  const mz2 = new Mezcal();

  mz1.use({
    method: 'GET',
    path: 'foo',
    handler: () => 'foo',
  });

  mz2.use({
    method: 'GET',
    path: 'bar',
    handler: () => 'bar',
  });

  it('Allows multiple separate instances', async () => {
    const r1 = await mz1.router.route('GET', '/foo').then(it => it.handler({}));
    expect(r1).toBe('foo');

    const e1 = await mz1.router
      .route('GET', '/bar')
      .then(it => it.handler({}))
      .catch(e => e);
    expect(e1).toBeInstanceOf(NotFoundError);

    const e2 = await mz2.router
      .route('GET', '/foo')
      .then(it => it.handler({}))
      .catch(e => e);
    expect(e2).toBeInstanceOf(NotFoundError);

    const r4 = await mz2.router.route('GET', '/bar').then(it => it.handler({}));
    expect(r4).toBe('bar');
  });
});
