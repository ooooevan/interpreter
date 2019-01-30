const Types = require('./type')


const DEFAULT_CONTEXT = {
  Function,
  Array,
  Boolean,
  clearInterval,
  clearTimeout,
  console,
  Date,
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
  Error,
  escape,
  eval,
  EvalError,
  Infinity,
  isFinite,
  isNaN,
  JSON,
  Math,
  NaN,
  Number,
  ["null"]: null,
  [Types.UNDEFINED]: void 0,
  Object,
  parseFloat,
  parseInt,
  RangeError,
  ReferenceError,
  RegExp,
  setInterval,
  setTimeout,
  String,
  SyntaxError,
  TypeError,
  unescape,
  URIError,
}
if (typeof Promise !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Promise = Promise;
}
if (typeof Proxy !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Proxy = Proxy;
}
if (typeof Reflect !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Reflect = Reflect;
}
if (typeof Symbol !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Symbol = Symbol;
}
if (typeof Set !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Set = Set;
}
if (typeof WeakSet !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.WeakSet = WeakSet;
}
if (typeof Map !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Map = Map;
}
if (typeof WeakMap !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.WeakMap = WeakMap;
}
if (typeof ArrayBuffer !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.ArrayBuffer = ArrayBuffer;
}
if (typeof SharedArrayBuffer !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.ArrayBuffer = SharedArrayBuffer;
}
if (typeof DataView !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.ArrayBuffer = DataView;
}
if (typeof Atomics !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Atomics = Atomics;
}
if (typeof Float32Array !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Float32Array = Float32Array;
}
if (typeof Float64Array !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Float64Array = Float64Array;
}
if (typeof Int16Array !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Int16Array = Int16Array;
}
if (typeof Int32Array !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Int32Array = Int32Array;
}
if (typeof Int8Array !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Int32Array = Int8Array;
}
if (typeof Intl !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Intl = Intl;
}
if (typeof Uint16Array !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Uint16Array = Uint16Array;
}
if (typeof Uint32Array !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Uint32Array = Uint32Array;
}
if (typeof Uint8Array !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Uint8Array = Uint8Array;
}
if (typeof Uint8ClampedArray !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.Uint8ClampedArray = Uint8ClampedArray;
}
if (typeof WebAssembly !== Types.UNDEFINED) {
  DEFAULT_CONTEXT.WebAssembly = WebAssembly;
}

module.exports = class Context {
  constructor(exteralContext = {}) {
    const ctx = { ...DEFAULT_CONTEXT,
      ...exteralContext
    };
    for (let attr in ctx) {
      if (ctx.hasOwnProperty(attr)) {
        this[attr] = ctx[attr]; //自身且可迭代属性
      }
    }
  }
}