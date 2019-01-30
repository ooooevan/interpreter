module.exports = class Var {
  constructor(kind, name, value, scope) {
    this.kind = kind;
    this.name = name;
    this._value = value;
    this.scope = scope;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value
  }
}