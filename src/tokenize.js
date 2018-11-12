/**
 * https://tc39.github.io/ecma262/
 * 保留词包含: 关键字、未来保留字、Nullliteral、Booleanliteral
 * 关键字: await break case catch class const continue debugge rdefault delete do else export extends finally for function if import in instanceof new return super switch this throw try typeof var void while with yield
 * 未来保留字: implements	package	protected	interface	private	public
 * Nullliteral: null
 * Booleanliteral: true false
 *  
 * Punctuator: { ( ) [ ] . ... ; , < > <= >= == != === !== + - * % ** ++ -- << >> >>> & | ^ ! ~ && || ? : = += -= *= %= **= <<= >>= >>>= &= |= ^= => / /= }
 */
  // token类型参考esprima.js
 	// "use strict";
	// Object.defineProperty(exports, "__esModule", { value: true });
	// exports.TokenName = {};
	// exports.TokenName[1 /* BooleanLiteral */] = 'Boolean';
	// exports.TokenName[2 /* EOF */] = '<end>';
	// exports.TokenName[3 /* Identifier */] = 'Identifier';
	// exports.TokenName[4 /* Keyword */] = 'Keyword';
	// exports.TokenName[5 /* NullLiteral */] = 'Null';
	// exports.TokenName[6 /* NumericLiteral */] = 'Numeric';
	// exports.TokenName[7 /* Punctuator */] = 'Punctuator';
	// exports.TokenName[8 /* StringLiteral */] = 'String';
	// exports.TokenName[9 /* RegularExpression */] = 'RegularExpression';
	// exports.TokenName[10 /* Template */] = 'Template';

const BooleanLiteral = 'BooleanLiteral'
const EOF = 'EOF'
const Identifier = 'Identifier'
const Keyword = 'Keyword'
const NullLiteral = 'NullLiteral'
const NumericLiteral = 'NumericLiteral'
const Punctuator = 'Punctuator'
const StringLiteral = 'StringLiteral'
const RegularExpression = 'RegularExpression'
const Template = 'Template'
const Whitespace = 'Whitespace'

// const Keywords = ['await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield']
// const FutureReservedWord = ['implements', 'package', 'protected', 'interface', 'private', 'public']
// const NullLiteral = ['null']
// const BooleanLiteral = ['true', 'false']



function tokenizeCode(codeStr) {
  const tokens = [];
  for (var i = 0; i < codeStr.length; i++) {
    var currentChar = codeStr.charAt(i);
    if (currentChar === ';') {
      tokens.push({
        type: Punctuator,
        value: ';'
      });
      continue
    }
    if (currentChar === '(' || currentChar === ')') {
      tokens.push({
        type: Punctuator,
        value: currentChar
      });
      continue
    }
    if (currentChar === '{' || currentChar === '}') {
      tokens.push({
        type: Punctuator,
        value: currentChar
      })
      continue
    }
    if (currentChar === '>' || currentChar === '<') {
      tokens.push({
        type: Punctuator,
        value: currentChar
      });
      continue
    }
    if (currentChar === '+') {
      tokens.push({
        type: Punctuator,
        value: currentChar
      });
      continue
    }
    if (currentChar === '=') {
      tokens.push({
        type: Punctuator,
        value: currentChar
      });
      continue
    }
    if (currentChar === '"' || currentChar === "'") {
      //字符串的开始，要一直取值到字符串的结束
      const token = {
        type: StringLiteral,
        value: currentChar
      }
      tokens.push(token)
      const closer = currentChar; //结束字符串等于开始字符串
      let escaped = false; //表示下一个字符是不是被转义

      for (i++; i < codeStr.length; i++) {
        currentChar = codeStr.charAt(i);
        token.value += currentChar //这里一个一个字符判断，到最后的closer也要添加
        if (escaped) {
          escaped = false;
        }
        if (currentChar === '\\') { //被转义，下一个字符直接添加
          escaped = true;
        } else if (currentChar === closer) {
          break; //内层不符合就要跳出本层循环
        }
      }
      continue;
    }
    if (/[0-9]/.test(currentChar)) {
      const token = {
        type: NumericLiteral,
        value: currentChar
      }
      tokens.push(token)
      for (i++; i < codeStr.length; i++) {
        currentChar = codeStr.charAt(i);
        if (/[0-9.]/.test(currentChar)) {
          token.value += currentChar;
        } else {
          i--; //不符合，要把i回退
          break; //内层不符合就要跳出本层循环
        }
      }
      continue;
    }
    if (/[a-zA-Z&_]/.test(currentChar)) {
      const token = {
        type: Identifier,
        value: currentChar
      }
      for (i++; i < codeStr.length; i++) {
        currentChar = codeStr.charAt(i);
        if (/[a-zA-Z0-9&_]/.test(currentChar)) {
          token.value += currentChar
        } else {
          i--;
          break;
        }
      };
      if(isKeyword(token.value)){
        token.type = Keyword
      }
      tokens.push(token)
      continue;
    }
    if (/\s+/.test(currentChar)) { // \s可以匹配空格和换行
      const token = {
        type: Whitespace,
        value: currentChar
      }
      tokens.push(token);
      for (i++; i < codeStr.length; i++) {
        currentChar = codeStr.charAt(i);
        if (/\s+/.test(currentChar)) {
          token.value += currentChar
        } else {
          i--;
          break;
        }
      }
      continue;
    }
    if(/[.,]/.test(currentChar)){
      tokens.push({
        type: Punctuator,
        value: currentChar
      });
      continue
    }
    // 可扩充其他类型判断
    throw new Error('Unexpected ' + currentChar);
  }
  return tokens;
}
function isKeyword(w){
  const len = w.length;
  switch(len){
    case 2:
      return w === 'do' || w === 'in' || w === 'if';
    case 3:
      return w === 'for' || w === 'new' || w === 'try' || w === 'var';
    case 4:
      return w === 'case' || w === 'else' || w === 'this' || w === 'void' || w === 'with';
    case 5:
      return w === 'await' || w === 'break' || w === 'catch' || w === 'class' || w === 'const' || w === 'super' || w === 'throw' || w === 'while' || w === 'yield';
    case 6:
      return w === 'delete' || w === 'export' || w === 'import' || w === 'return' || w === 'switch' || w === 'typeof';
    case 7:
      return w === 'default' || w === 'extends' || w === 'finally';
    case 8:
      return w === 'continue' || w === 'debugger' || w === 'function';
    case 10:
      return w === 'instanceof';
    default:
      return false;
  }

}
// console.log(tokenizeCode(`
// if (1 > 0) {
//   alert("if 1 > 0");
// }
// `))
// console.log(tokenizeCode(`
//   function a(){
//     var abc = 'abc'
//     alert("1");
//   };
//   if (1 > 0) {
//     a();
//   }
// `))
// console.log(tokenizeCode(`
// var a = 1+2+3;
// alert(1);
// `))
// console.log(tokenizeCode(`
// var a = Math.pow(2, 3)
// `))

module.exports = {
  tokenize: tokenizeCode,
  BooleanLiteral,
  EOF,
  Identifier,
  Keyword,
  NullLiteral,
  NumericLiteral,
  Punctuator,
  StringLiteral,
  RegularExpression,
  Template,
  Whitespace
}