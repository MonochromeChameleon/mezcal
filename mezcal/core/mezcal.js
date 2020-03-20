import { CorePlugin } from '@mezcal/plugin-core';

export function Mezcal() {
  const Context = function Context(req, res) {
    this.req = req;
    this.res = res;
  };
  const ErrorHandler = function ErrorHandler() {};
  const Router = function Router() {};
  const Security = function Security() {};

  this.plugins = [];

  this.plugin = (plugin, opts, ...path) => {
    if (plugin instanceof Function) {
      this.plugins.push(path.join('.'));
      plugin({ Context, ErrorHandler, Router, Security }, opts, this);
    } else {
      Object.keys(plugin).forEach(k => this.plugin(plugin[k], opts, ...path, k));
    }
    return this;
  };

  this.plugin(CorePlugin);

  return this;
}
