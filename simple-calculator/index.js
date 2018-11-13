const Big = require("big.js");
/* 
 * 一个简单计算器，将中缀表达式转为后缀表达式，支持加减乘除括号，不支持复杂运算符
 * 规则：
 * 1、遇到操作数、直接输出
 * 2、遇到操作符、入栈，左括号也入栈
 * 3、遇到右括号，将栈中括号之间的弹出并输出（括号不输出）
 * 4、其他任意操作符、若要入栈的操作符没有比栈顶的操作符高，则前面的操作符出栈并输出，直到栈中操作符符合顶部操作符优先级最高
 * 上面用语：入栈的操作符没有比栈顶的操作符高，而不是入栈的操作符比栈顶的操作符低，把同级的也出栈。两种方式计算结果都正确，只是我这样是左结合，不出栈的话，计算是右结合
 * 
 * 中缀表达式：a + b * c + (d * e + f) * g
 * 对应的后缀表达式：a b c * + d e * f  + g * +
 * 
 */

//  中缀表达式转后缀表达式
//  输入为字符串，输出为后缀表达式数组
//  使用数组可以支持多位数数值和开头负值
function transformExpression(str){
  str = str.trim();
  const NumReg = /\d/;
  const OperReg = /[\+\-\*\/\(\)]/;
  const BracketsReg = /(\([+-\d]+?\))/;
  const Whitespace = /\s/;
  const operArr = [];
  const result = []
  let i = 0;
  let top;

  // 预处理，去除无用括号和加号 如 3-(+4) 转为 3 - 4
  while(str.match(BracketsReg) && str.match(BracketsReg).length){
    str = str.replace(BracketsReg, replacer)
  }
  // 如：( +4) 转换成 4
  function replacer(val){
    val = val.replace(/\(|\)/g, '').trim();
    val = val.replace(/^\+/, '').trim();
    return val;
  }


  while(i < str.length){
    let char = str[i];
    if(NumReg.test(char)){
      let temp = char;
      while(/\d|\./.test(str[i + 1])){
        temp += str[++i];
      }
      result.push(temp);
      // 如：-5 + 2 ,识别为 -5
    } else if (/\+|\-/.test(char) && i === 0) {
      let temp = char;
      while(NumReg.test(str[i + 1])){
        temp += str[++i];
      }
      if(temp === char){
        operArr.push(temp);
      }else{
        result.push(temp);
      }
    } else if (OperReg.test(char)) {
      switch(char){
        case '+':
          top = getTop(operArr);
          while(top === '*' || top === '/' || top === '-' || top === '+'){
            let ope = operArr.pop();
            result.push(ope);
            top = getTop(operArr);
          }
          operArr.push(char);
          break;
        case '-':
          top = getTop(operArr);
          while(top === '*' || top === '/' || top === '+' || top === '-'){
            let ope = operArr.pop();
            result.push(ope);
            top = getTop(operArr);
          }
          operArr.push(char);
          break;
        case '*':
          top = getTop(operArr);
          while(top === '/' || top === '*'){
            let ope = operArr.pop();
            result.push(ope);
            top = getTop(operArr);
          }
          operArr.push(char);
          break;
        case '/':
          top = getTop(operArr);
          while(top === '/' || top === '*'){
            let ope = operArr.pop();
            result.push(ope);
            top = getTop(operArr);
          }
          operArr.push(char);
          break;
        case '(':
          operArr.push(char);
          break;
        case ')':
          top = getTop(operArr);
          while(top !== '('){
            let ope = operArr.pop();
            result.push(ope);
            top = getTop(operArr);
          }
          operArr.pop();
          break;
        default:
      }
    } else if (!Whitespace.test(char)){
      throw new Error('Unexpected char ' + cahr);
    }
    i++;
  }
  while(operArr.length){
    let top = operArr.pop();
    result.push(top);
  }
  return result;
}
function getTop(arr){
  return arr[arr.length - 1];
}

// 根据后缀表达式数组计算结果
function calculate(arr){
  const NumReg = /\d/;
  let i = 0;
  const resultNum = []
  while(i < arr.length){
    let item = arr[i];
    if(!NumReg.test(item)){
      const secondNum = resultNum.pop();
      // 单符号可能firstName为空，如 arr为['4', '-'] 为 0 - 4
      const firstNum = resultNum.pop() || 0;
      switch(item){
        case '+':
          resultNum.push(+Big(firstNum).plus(secondNum))
          break;
        case '-':
          resultNum.push(+Big(firstNum).minus(secondNum))
          break;
        case '*':
          resultNum.push(+Big(firstNum).times(secondNum))
          break;
        case '/':
          resultNum.push(+Big(firstNum).div(secondNum))
          break;
        default:
      }
    }else{
      resultNum.push(+item)
    }
    i++;
  }
  return resultNum.pop()
}

const code = '0.1 + 0.2'
const right = transformExpression(code);
const result = calculate(right);
module.exports = {
  transformExpression,
  calculate
} 

