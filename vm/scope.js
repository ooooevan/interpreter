const Var = require('./var');
const ScopeType = require('./type');
const Context = require('./context');
const Types = require('./type')
const isolatedScopedMap = {
  Function: true,
  Constructor: true,
  Method: true,
  Object: true
}

module.exports = class Scope {
  constructor(type, parent) {
    this.context = new Context();
    this.type = type;
    this.parent = parent;
    this.content = {};
    this.level = 0;
    this.invasive = false; //入侵的
    this.isolated = true; //隔离的
    this.origin = null; //来源，fork时有用
  }

  get length() {
    return Object.keys(this.content).length
  }
  get raw() {
    const raw = {}
    for (const attr in this.content) {
      if (this.content.hasOwnProperty(attr)) {
        raw[attr] = this.content[attr].value
      }
    }
    return raw;
  }

  setContext(context) {
    this.context = context;
    for (const name in context) {
      if (context.hasOwnProperty(name)) {
        this.var(name, context[name]);
      }
    }
  }
  // 获取属性，会递归向上获取
  hasBinding(varName) {
    if (this.content.hasOwnProperty(varName)) {
      return this.content[varName]
    } else if (this.parent) {
      return this.parent.hasBinding(varName)
    } else {
      return undefined;
    }
  }
  // 只获取自身属性
  hasOwnBinding(varName) {
    if (this.content.hasOwnProperty(varName)) {
      return this.content[varName]
    } else {
      return undefined;
    }
  }

  // 获取最外层scope
  get global() {
    if (this.parent) {
      return this.parent.global
    } else {
      return this;
    }
  }

  let (varName) {
    if (!this.content.hasOwnProperty(varName, value)) {
      this.content[varName] = new Var(ScopeType.Let, varName, value, this);
      return true;
    } else {
      throw ErrDuplicateDeclard(varName);
    }
  }

  const (varName, value) {
    if (!this.content.hasOwnProperty(varName)) {
      this.content[varName] = new Var(ScopeType.Const, varName, value, this);
      return true;
    } else {
      throw ErrDuplicateDeclard(varName)
    }
  }

  var (varName, value) {
    // 此处不能生存一个作用域，变量赋值给父级
    // 那上面let和const为什么不用这样？
    let targetScope = this
    while (targetScope.parent && !isolatedScopedMap[targetScope.type]) {
      targetScope = targetScope.parent
    }
    if (targetScope.content.hasOwnProperty(varName)) {
      const $var = targetScope.content[varName];
      if ($var.kind !== ScopeType.Var) {
        // 已经有此变量且不为var，不能再次声明
        throw ErrDuplicateDeclard(varName)
      } else {
        if (targetScope.level === 0 && targetScope.context[varName]) {
          // context是全局预设对象不可覆盖？
        } else {
          targetScope.content[varName] = new Var(
            Types.Var,
            varName,
            value,
            targetScope
          )
        }
      }
    } else {
      targetScope.content[varName] = new Var(
        Types.Var,
        varName,
        value,
        targetScope
      )
    }
    return true
  }
  // 快捷声明变量
  declare(kind, rawName, value) {
    return {
      [ScopeType.Const]: () => this.const(rawName, value),
      [ScopeType.Let]: () => this.let(rawName, value),
      [ScopeType.Var]: () => this.var(rawName, value),
    }[kind]()
  }

  del(varName) {
    delete this.content[varName]
  }
  // 创建子作用域
  createChild(type) {
    const childScope = new Scope(type, this);
    childScope.level = this.level + 1;
    return childScope
  }
  fork(type) {
    const siblingScope = new Scope(type || this.type, null);
    siblingScope.invasive = this.invasive;
    siblingScope.level = this.level;
    siblingScope.context = this.context; //共用的初始化上下文，不包含自定义的属性
    siblingScope.parent = this.parent;
    siblingScope.origin = this;

    for (const varName in this.content) {
      if (this.content.hasOwnProperty(varName)) {
        const $var = this.content[varName]; //$var是一个Var实例，包含name和value
        siblingScope.declare($var.kind, $var.name, $var, value)
      }
    }
    return siblingScope;
  }
  // 返回属性所在的上下文
  locate(varName) {
    if (this.hasOwnBinding(varName)) {
      return this;
    } else {
      if (this.parent) {
        return this.parent.locate.call(this.parent, varName)
      } else {
        return undefined;
      }
    }
  }
}
exports.isolatedScopedMap = isolatedScopedMap