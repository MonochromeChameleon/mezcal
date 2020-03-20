import { PathPartBase } from './path-part-base';

const catchall = Symbol.for('route.catchall');

export class CatchAllPathPart extends PathPartBase {
  constructor() {
    super(catchall);
  }
}
