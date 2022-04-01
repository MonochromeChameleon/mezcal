const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'false'];

export const CoreLogPlugin = {
  Log({ Context }, opts = { level: process.env.LOG_LEVEL || 'info' }) {
    const { level } = opts;

    const levelOrDefault = [level, 'info'].find(l => LEVELS.includes(l));
    const suppressed = LEVELS.slice(0, LEVELS.indexOf(levelOrDefault)).filter(it => it !== 'false');
    const active = LEVELS.slice(LEVELS.indexOf(levelOrDefault)).filter(it => it !== 'false');

    // eslint-disable-next-line no-console
    const log = (...args) => console.log(...args);

    suppressed.forEach(l =>
      Object.defineProperty(log, l, {
        value() {
          /* no op */
        },
      })
    );

    active.forEach(l =>
      Object.defineProperty(log, l, {
        value(...args) {
          log(`[${l.toUpperCase()}]`, ...args);
        },
      })
    );

    Object.defineProperty(Context.prototype, 'log', {
      value: log,
    });
  },
};
