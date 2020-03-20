import { zip } from '@mezcal/utils';
import { method, pathPart, terminate } from './path-part';

export class Route {
  constructor(routeDef, ...matchers) {
    Object.assign(this, routeDef);
    this.matchers = matchers;
  }

  test(parts) {
    return zip(this.matchers, parts).every(({ first, second }) => first.isMatch(second));
  }
}

Route.parse = routeDef => {
  const methods = [routeDef.method]
    .flat(Infinity)
    .filter(it => it)
    .map(it => it.toUpperCase())
    .map(method);

  const paths = [routeDef.path]
    .flat(Infinity)
    .filter(it => it)
    .map(it =>
      it
        .split('/')
        .filter(iit => iit)
        .map(pathPart)
    );

  return methods.flatMap(m => paths.map(p => new Route(routeDef, m, ...p, terminate())));
};
