import { Mezcal } from '../../mezcal/core/mezcal';
import { NotFoundError } from '../../mezcal/errors';

describe('Router plugin', () => {
  it('throws on duplicated routes', async () => {
    const mz = new Mezcal();
    mz.use({
      method: 'GET',
      path: '/foo',
      handler() {
        return 'foo';
      },
    }).use({
      method: 'GET',
      path: '/foo',
      handler() {
        return 'foo';
      },
    });
    expect(() => mz.router.route('GET', 'foo')).rejects.toThrow('Duplicated Route mapping');
  });

  it('returns a 404 when no routes are set up at all', async () => {
    const mz = new Mezcal();
    expect(() => mz.router.route('GET', 'foo').then(r => r.handler())).rejects.toThrow(NotFoundError);
  });

  it('returns a 404 when no route info is passed', async () => {
    const mz = new Mezcal();
    mz.use({
      method: 'GET',
      path: '/foo',
      handler() {
        return 'foo';
      },
    });

    expect(() => mz.router.route().then(r => r.handler())).rejects.toThrow(NotFoundError);
  });
});
