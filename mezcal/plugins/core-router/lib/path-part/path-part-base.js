/* eslint-disable class-methods-use-this */

export class PathPartBase {
  constructor(lookup) {
    this.lookup = lookup;
  }

  isMatch() {
    return true;
  }

  get terminates() {
    return false;
  }
}
