/**
 * 这是babel预计算插件
 * ast由babel转换好，只需根据他的语法写操作语法树的规则
 * https://github.com/axetroy/babel-plugin-pre-calculate-number/blob/master/index.js
 * 
 * Math.PI : ExpressionStatement-> MemberExpression [object, property]
 * Math.pow(2,3) : ExpressionStatement -> CallExpression -> [callee (MemberExpression), arguments]
 * 
 * 
 * 这个代码会经过3次BinaryExpression：
 * const day = 3600 * 1000 * 24;
 * ①：left:3600 * 1000  right:24
 * ②：left: 2600  right: 1000
 * ③：left: 3600000  right: 24
 * 有第三次是因为replace后对parentNode检测，递归检测，可能是BinaryExpression或UnaryExpression
 * 
 * 一元运算符
 * UnaryExpression [operator, argument(NumericLiteral)]
 * 
 */

const babel = require('babel-core');
const t = require('babel-types');
const Big = require("big.js");

function calcExpression(left, operator, right) {
  let result;
  switch (operator) {
    case '+':
      result = +Big(left).plus(right)
      break;
    case '-':
      result = +Big(left).minus(right)
      break;
    case '*':
      result = +Big(left).times(right)
      break;
    case '/':
      result = +Big(left).div(right)
      break;
    case '%':
      result = +Big(left).mod(right)
      break;
    case '|':
      result = left | right
      break;
    case '&':
      result = left & right
      break;
    case '^':
      result = left ^ right
      break;
    case '>>':
      result = left >> right
      break;
    case '>>>':
      result = left >>> right
      break;
    case '<<':
      result = left << right
      break;
    case '**':
      let i = right
      while (--i) {
        result = result || left;
        result = +new Big(result).times(left)
      }
      break;
    default:
  }
  return result;
}

const visitor = {
  // 二元运算表达式
  BinaryExpression(path) {
    const node = path.node;
    let result;
    // 一个成员属性和一个数字。如 Math.PI * 2
    if (t.isMemberExpression(node.left) && t.isNumericLiteral(node.right) ||
      t.isMemberExpression(node.right) && t.isNumericLiteral(node.left)
    ) {
      const member = t.isMemberExpression(node.left) ? node.left : node.right;
      const number = t.isNumericLiteral(node.left) ? node.left : node.right;
      // 只对Math对象预计算
      if (member.object && member.object.name === 'Math') {
        let method
        if (t.isIdentifier(member.property)) { //Math.PI
          method = member.property.name
        } else if (t.isStringLiteral(member.property)) { // Math['PI']
          method = member.property.value
        }
        switch (method) {
          case "E":
          case "LN2":
          case "LN10":
          case "LOG2E":
          case "LOG10E":
          case "SQRT1_2":
          case "SQRT2":
          case "PI":
            result = calcExpression(
              Math[method],
              node.operator,
              number.value,
            )
            break;
          default:
        }
      }
      // 两个数字计算。如 1 + 2
    } else if (t.isNumericLiteral(node.left) && t.isNumericLiteral(node.right)) {
      result = calcExpression(node.left.value, node.operator, node.right.value);
    }
    if (result !== undefined) {
      path.replaceWith(t.numericLiteral(result));
      let parentPath = path.parentPath
      parentPath && t.isBinaryExpression(parentPath.node) && visitor.BinaryExpression.call(this, parentPath);
      parentPath && t.isUnaryExpression(parentPath.node) && visitor.UnaryExpression.call(this, parentPath)
    }
  },
  CallExpression(path) {
    const node = path.node;
    let result;
    // 只对Math对象预计算
    if (t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.object) && node.callee.object.name === 'Math') {
      let method;
      let result;
      if (t.isIdentifier(node.callee.property)) {
        method = node.callee.property.name
      } else if (t.isStringLiteral(node.callee.property)) {
        method = node.callee.property.value
      }
      let args = node.arguments
      if (method) {
        const isAllNumber = args.every(v => t.isNumericLiteral(v));
        if (isAllNumber) {
          result = Math[method].apply(Math, args.map(v => v.value));
        }
      }
      if (result !== undefined) {
        path.replaceWith(t.numericLiteral(result));
      }
    }
  },
  UnaryExpression(path) {
    const node = path.node;
    let result;
    if(t.isUnaryExpression(node) && t.isNumericLiteral(node.argument)){
      switch(node.operator){
        case '-':
          result = -node.argument.value
          break;
        case '+':
          result = +node.argument.value
          break;
        case '~':
          result = ~node.argument.value
          break;
        default:
      }
    }
    if(result !== undefined){
      path.replaceWith(t.numericLiteral(result));
      let parentPath = path.parentPath;
      if(parentPath){
        t.isBinaryExpression(parentPath.node) && visitor.BinaryExpression.call(this, parentPath)
        t.isUnaryExpression(parentPath.node) && visitor.UnaryExpression.call(this, parentPath)
      }
    }
  }
}




function preCal(str) {
  return babel.transform(str, {
    plugins: [{
      visitor
    }]
  }).code
}

preCal('var s = 2 ** 2 ** 3;')

if (typeof module !== 'undefined') {
  module.exports = preCal
}