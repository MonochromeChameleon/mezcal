export function defineCachedProperty(tgt, name, cb, ...args) {
  const sym = Symbol(name);
  Object.defineProperty(tgt, name, {
    get() {
      this[sym] = this[sym] || cb.call(this, ...args);
      return this[sym];
    },
  });
}
