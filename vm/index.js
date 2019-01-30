const {
  parse
} =require('babylon');
const Scope = require ('./scope');
const ScopeType = require ('./type');
const Context = require ('./context');
const evaluate = require ('./evaluate');
const Path = require ('./path');
const Stack = require ('./stack');
const Types= require ('./type');
const defaultOptions = {
  courceType: 'module',
  plugins: [
    'asyncGenerators',
    "classProperties",
    "decorators",
    "doExpressions",
    "exportExtensions",
    "flow",
    "objectRestSpread"
  ]
}

function runInContext(code, context = createContext(), preset) {
  const scope = new Scope(ScopeType.Root, null);
  scope.level = 0;
  scope.invasive = true;
  scope.const(ScopeType.THIS, undefined);
  scope.setContext(context);

  const $exports = {};
  const $module = {
    exports: $exports
  }
  scope.const(ScopeType.MODULE, $module);
  scope.const(ScopeType.EXPORTS, $exports);
  const ast = parse(code, defaultOptions);

  const path = new Path(ast, null, scope, {}, new Stack());
  path.preset = preset
  path.evaluate = evaluate
  evaluate(path);

  const moduleVar = scope.hasBinding(Types.MODULE);
  return moduleVar ? moduleVar.value.exports : undefined;
}

function createContext(sandbox = {}) {
  return new Context(sandbox)
}

module.exports = {
  runInContext,
  createContext
}
