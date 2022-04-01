import { PathPartBase } from './path-part-base.js';

const catchall = Symbol.for('route.catchall');

export class CatchAllPathPart extends PathPartBase {
  constructor() {
    super(catchall);
  }
}
