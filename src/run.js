const babylon = require("babylon");
const types = require("babel-types");

const Visitor = {
  File(node, scope){
    evaluate(node.program, scope);
  },
  Program(program, scope){
    for(const node of program.body){
      evaluate(node, scope);
    }
  },
  BlockStatement(block, scope){
    for (const node of block.body){
      evaluate(node, scope);
    }
  },
  FunctionDeclaration(node, scope){
    const func = function(){
      evaluate(node.body, scope)
    }
    // const func = Visitor.FunctionExpression(node, scope);
    scope[node.id.name] = func;
  },
  // FunctionExpression(node, scope){
  //   const func = function(){
  //     evaluate(node.body, scope)
  //   }
  //   return func
  // },
  ExpressionStatement(node, scope){
    evaluate(node.expression, scope);
  },
  CallExpression(node, scope){
    const func = evaluate(node.callee, scope);
    const funcArguments = node.arguments.map(arg => evaluate(arg, scope));

    // 若是成员函数，就用对象调用成员函数
    if(types.isMemberExpression(node.callee)){
      const object = evaluate(node.callee.object, scope);
      return func.apply(object, funcArguments);
    }else if (types.isIdentifier(node.callee)) {
      // 不是成员函数，直接从scope中调用
      func.apply(scope, funcArguments);
    }
  },
  MemberExpression(node, scope){
    const {object, property} = node;
    const propertyName = property.name;  //成员函数直接获取，不需要scope传值限定
    const obj = evaluate(object, scope); //这步表示要在环境中有此变量
    const target = obj[propertyName];
    return target   //下面是没错的，这行可能有错
    // return typeof target === 'function' ? target.bind(obj) : target
  },
  // 处理声明，这里都往scope这个全局对象存
  VariableDeclaration(node, scope){
    const kind = node.kind
    for(const declartor of node.declarations) {
      evaluate(declartor, scope);
    }
  },
  // 声明的名称和值，这样存是因为VariableDeclarator对象里面是两个对象
  VariableDeclarator(node, scope){
    scope[node.id.name] = node.init ? evaluate(node.init, scope) : undefined;
  },
  StringLiteral(node) {
    return node.value;
  },
  Identifier(node, scope){
    return scope[node.name]    //从scope取值，只能使用传入的全局对象
  },
  NumericLiteral(node, scope){
    return node.value
  }
}

function evaluate(node, parent){
  const _evaluate = Visitor[node.type]
  if(!_evaluate) {
    throw new Error(`unknow visitors of ${node.type}`)
  }
  return _evaluate(node, parent)
}

// const code = `
//  function a(){
//    var name = 'hello world'
//   console.log(name)
//  }
//  a()
// `;

// 暂时不支持传值调用
// const code = `
//   function square(a) {
//     console.log(a);
//   }
//   square(1)
//   `

// 生成AST树
// const ast = babylon.parse(code);
// evaluate(ast, {console});

module.exports = evaluate