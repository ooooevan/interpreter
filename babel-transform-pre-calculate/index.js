/**
 * 这是babel预计算插件
 * ast由babel转换好，只需根据他的语法写操作语法树的规则
 * https://github.com/axetroy/babel-plugin-pre-calculate-number/blob/master/index.js
 */

var babel = require('babel-core');
var t = require('babel-types');
const visitor = {
  // 二元运算表达式
  BinaryExpression(path) {
    const node = path.node;
    let result;
    if (t.isNumericLiteral(node.left) && t.isNumericLiteral(node.right)) {
      switch (node.operator) {
        case '+':
          result = node.left.value + node.right.value
          break;
        case '-':
          result = node.left.value - node.right.value
          break;
        case '*':
          result = node.left.value * node.right.value
          break;
        case '/':
          result = node.left.value / node.right.value
          break;
        case '**':
          let i = node.left.value
          while(--i){
            reslt = result || node.left.value
            result = result * node.left.value
          }
          break;
      }
      if(result){
        path.replaceWith(t.numericLiteral(result));
        let parentNode = path.parentPath
        parentNode && visitor.BinaryExpression(parentNode)
      }
    }
  }
}




function preCal(str){
  return babel.transform(str,{
    plugins: [
      {visitor}
    ]
  }).code
}

if(typeof module !== 'undefined'){
  module.exports = preCal
}
