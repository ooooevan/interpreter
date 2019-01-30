module.exports = class Signal {
  static is(v, type) {
    return v instanceof Signal && v.kind === type;
  }
  static isContinue(v) {
    return Signal.is(v, "continue");
  }
  static isBreak(v) {
    return Signal.is(v, "break");
  }
  static isReturn(v) {
    return Signal.is(v, "return");
  }
  constructor(kind, value) {
    this.kind = kind;
    this.value = value;
  }
}