const catchall = Symbol.for('route.catchall');
const param = Symbol.for('route.param');
const regex = Symbol.for('route.regex');
const termination = Symbol.for('route.termination');

export class RouteTree {
  constructor(tree, depth = 0) {
    this.tree = tree;
    this.depth = depth;
  }

  getRoute(key) {
    return this.tree[key] || this.tree[param] || this.tree[regex] || this.tree[catchall];
  }

  get(parts) {
    const key = parts[this.depth];
    if (!key) return undefined;

    const result = this.getRoute(key);
    if (!result) return undefined;

    if (result instanceof RouteTree) {
      return result.get(parts);
    }

    if (result.test(parts)) return result;
    return undefined;
  }

  lookup(method, url = '') {
    return this.get([method, ...url.split('/').filter(it => it), termination]);
  }
}
