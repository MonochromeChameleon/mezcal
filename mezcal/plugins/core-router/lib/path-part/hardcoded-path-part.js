import { PathPartBase } from './path-part-base';

export class HardcodedPathPart extends PathPartBase {
  constructor(part) {
    super(part);
    this.part = part;
  }

  isMatch(test) {
    return this.part === test;
  }
}
