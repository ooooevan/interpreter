const babylon = require("babylon");
const types = require("babel-types");
// BinaryExpression,
// ConditionalExpression,
// AssignmentExpression,
// ThisExpression,
// ObjectExpression,
// ArrayExpression,
// NewExpression,
// TemplateLiteral,
// TemplateElement,
// ArrowFunctionExpression,
// UnaryExpression,
// UpdateExpression,
// AssignmentPattern,
// IfStatement,
// DoWhileStatement,
// WhileStatement,
// SwitchStatement,
// ForStatement,
// ImportDeclaration,
// ImportDefaultSpecifier,
// ExportDefaultDeclaration,
const handler = {
  File(node, scope) {
    NodeIterator.traverse(node.program, scope);
  },
  Program(program, scope) {
    for (const node of program.body) {
      NodeIterator.traverse(node, scope);
    }
  },
  BlockStatement(block, scope) {
    for (const node of block.body) {
      NodeIterator.traverse(node, scope);
    }
  },
  FunctionDeclaration(node, scope) {
    const func = function () {
      NodeIterator.traverse(node.body, scope)
    }
    // const func = handler.FunctionExpression(node, scope);
    scope[node.id.name] = func;
  },
  // FunctionExpression(node, scope){
  //   const func = function(){
  //     NodeIterator.traverse(node.body, scope)
  //   }
  //   return func
  // },
  ExpressionStatement(node, scope) {
    NodeIterator.traverse(node.expression, scope);
  },
  CallExpression(node, scope) {
    const func = NodeIterator.traverse(node.callee, scope);
    const funcArguments = node.arguments.map(arg => NodeIterator.traverse(arg, scope));

    // 若是成员函数，就用对象调用成员函数
    if (types.isMemberExpression(node.callee)) {
      const object = NodeIterator.traverse(node.callee.object, scope);
      return func.apply(object, funcArguments);
    } else if (types.isIdentifier(node.callee)) {
      // 不是成员函数，直接从scope中调用，这里传入参数有问题，没地方保存（也不知道键是什么），取的时候就没有值
      return func.apply(scope, funcArguments);
    }
  },
  MemberExpression(node, scope) {
    const {
      object,
      property
    } = node;
    const propertyName = property.name; //成员函数直接获取，不需要scope传值限定
    const obj = NodeIterator.traverse(object, scope); //这步表示要在环境中有此变量
    const target = obj[propertyName];
    return target //下面是没错的，这行可能有错
    // return typeof target === 'function' ? target.bind(obj) : target
  },
  // 处理声明，这里都往scope这个全局对象存
  VariableDeclaration(node, scope) {
    const kind = node.kind
    for (const declartor of node.declarations) {
      NodeIterator.traverse(declartor, scope);
    }
  },
  // 声明的名称和值，这样存是因为VariableDeclarator对象里面是两个对象
  VariableDeclarator(node, scope) {
    scope[node.id.name] = node.init ? NodeIterator.traverse(node.init, scope) : undefined;
  },
  StringLiteral(node) {
    return node.value;
  },
  Identifier(node, scope) {
    return scope[node.name] //从scope取值，只能使用传入的全局对象
  },
  NumericLiteral(node, scope) {
    return node.value
  }
}

class NodeIterator {
  constructor(node, scope = {}) {
    this.node = node;
    this.scope = scope;
    this.handler = handler
  }
  static traverse(node, scope) {
    const _handler = handler[node.type]
    if (!_handler) {
      throw new Error(`unknow visitors of ${node.type}`)
    }
    return _handler(node, scope)
  }
}
module.exports = {
  NodeIterator
}