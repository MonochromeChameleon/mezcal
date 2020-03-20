import { PathPartBase } from './path-part-base';

const param = Symbol.for('route.param');

export class ParameterPathPart extends PathPartBase {
  constructor(parameter, lookup = param) {
    super(lookup);
    this.param = parameter;
  }
}
