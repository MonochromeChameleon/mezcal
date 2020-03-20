import { RouteTree } from '../lib/route-tree';

const catchall = Symbol.for('route.catchall');
const param = Symbol.for('route.param');
const regex = Symbol.for('route.regex');
const termination = Symbol.for('route.termination');

const metaKeysFor = (obj, includeTermination = false) =>
  [param, regex, catchall, termination].filter(k => includeTermination || k !== termination).filter(k => obj[k]);
const allKeysFor = (obj, includeTermination = false) => [...Object.keys(obj), ...metaKeysFor(obj, includeTermination)];

const addToMap = (map, route) => {
  route.matchers.reduce((sofar, match) => {
    if (match.terminates) {
      if (sofar[match.lookup]) throw new Error('Duplicated Route mapping');
      sofar[match.lookup] = route;
    } else {
      sofar[match.lookup] = sofar[match.lookup] || {};
    }

    return sofar[match.lookup];
  }, map);

  return map;
};

const ensureKey = (tgt, k, value) => {
  tgt[k] = tgt[k] || value;
};

const ensureKeys = (tgt, fill = tgt) => {
  allKeysFor(fill).forEach(fk => {
    ensureKey(tgt, fk, fill[fk]);
  });

  allKeysFor(tgt).forEach(k => {
    metaKeysFor(fill).forEach(fk => {
      ensureKeys(tgt[k], fill[fk]);
    });
  });

  allKeysFor(fill).forEach(fk => {
    ensureKeys(tgt[fk], fill[fk]);
  });

  return tgt;
};

const treeShortener = {
  shortenBranch(branch, depth) {
    const children = allKeysFor(branch, true);

    if (children.length === 1) {
      const [key] = children;
      if (key === termination) return branch[key];
      return this.shortenBranch(branch[key], depth + 1);
    }

    const subTree = this.shortenBranches(branch, depth + 1);
    return new RouteTree(subTree, depth + 1);
  },
  shortenBranches(tree, depth = 0) {
    return allKeysFor(tree, true).reduce((sofar, k) => {
      if (k === termination) {
        sofar[k] = tree[k];
      } else {
        sofar[k] = this.shortenBranch(tree[k], depth);
      }
      return sofar;
    }, {});
  },
};

export const buildRouteTree = routes => {
  const treeStump = routes.reduce((sofar, r) => addToMap(sofar, r), {});
  const treeWithLeaves = ensureKeys(treeStump);
  const minimalTree = treeShortener.shortenBranches(treeWithLeaves);
  return new RouteTree(minimalTree);
};
