import { ParameterPathPart } from './parameter-path-part.js';

const regex = Symbol.for('route.regex');

export class RegexPathPart extends ParameterPathPart {
  constructor(parameter, pattern) {
    super(parameter, regex);
    this.rx = new RegExp(pattern.slice(0, -1));
  }

  isMatch(test) {
    return this.rx.test(test);
  }
}
