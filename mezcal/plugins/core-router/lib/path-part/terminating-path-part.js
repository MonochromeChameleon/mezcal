/* eslint-disable class-methods-use-this */

import { PathPartBase } from './path-part-base';

const termination = Symbol.for('route.termination');

export class TerminatingPathPart extends PathPartBase {
  constructor() {
    super(termination);
  }

  get terminates() {
    return true;
  }
}
