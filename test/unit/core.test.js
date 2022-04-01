import { Mezcal } from '../../mezcal/core/mezcal.js';

describe('Core library', () => {
  const mz = new Mezcal();

  afterEach(async () => {
    await mz.close();
  });

  it('starts the server', async () => {
    await mz.listen(0);
    expect(mz.server.listening).toBe(true);
  });

  it('stops the server', async () => {
    await mz.listen(0);
    await mz.close();
    expect(mz.server.listening).toBe(false);
  });

  it('returns itself', async () => {
    const mm = await mz.listen();
    expect(mm.server.listening).toBe(true);
    await mm.close();
    expect(mm.server.listening).toBe(false);
  });
});
