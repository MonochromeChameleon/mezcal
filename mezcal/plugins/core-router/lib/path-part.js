import { CatchAllPathPart } from './path-part/catchall-path-part.js';
import { HardcodedPathPart } from './path-part/hardcoded-path-part.js';
import { ParameterPathPart } from './path-part/parameter-path-part.js';
import { RegexPathPart } from './path-part/regex-path-part.js';
import { TerminatingPathPart } from './path-part/terminating-path-part.js';

export const method = meth => (meth === 'ALL' ? new CatchAllPathPart() : new HardcodedPathPart(meth));

export const pathPart = part => {
  if (part === '*') return new CatchAllPathPart();
  const isParam = part.startsWith(':');
  if (!isParam) return new HardcodedPathPart(part);
  const [param, pattern] = part.slice(1).split(/(?<!\(.*)\(/);
  if (!pattern) return new ParameterPathPart(param);
  return new RegexPathPart(param, pattern);
};

export const terminate = () => new TerminatingPathPart();
