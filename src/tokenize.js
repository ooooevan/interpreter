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
    if (currentChar === '"' || currentChar === "'" || currentChar === "`") {
      //字符串的开始，要一直取值到字符串的结束
      const token = {
        type: currentChar === '`'?Template:StringLiteral,
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
          break;
        }
      }
      continue;
    }
    // if (currentChar === '/') {
      
    // }
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
    if (/[a-zA-Z$_]/.test(currentChar)) {
      const token = {
        type: Identifier,
        value: currentChar
      }
      for (i++; i < codeStr.length; i++) {
        currentChar = codeStr.charAt(i);
        if (/[a-zA-Z0-9$_]/.test(currentChar)) {
          token.value += currentChar
        } else {
          i--;
          break;
        }
      };
      if(isKeyword(token.value)){
        token.type = Keyword
      }else if(token.value === 'false' || token.value === 'true'){
        token.type = BooleanLiteral
      }else if(token.value === 'null'){
        token.type = NullLiteral
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
    // 字符
    switch(currentChar){
      case '(':
      case '{':
      case ')':
      case '}':
      case ':':
      case '[':
      case ']':
      case ',':
      case ';':
      case '?':
      case '~':
        tokens.push({
          type: Punctuator,
          value: currentChar
        });
        break;
      case '.':
        if(codeStr.charAt(i+1) === '.' && codeStr.charAt(i+2) === '.'){
          tokens.push({
            type: Punctuator,
            value: '...'
          });
          i+=2;
        }else{
          tokens.push({
            type: Punctuator,
            value: currentChar
          });
        }
        break;
      default:
        let str = codeStr.substr(i, 4);
        if(str === '>>>='){
          tokens.push({
            type: Punctuator,
            value: str
          });
          i+=3;
          break;
        }
        str = codeStr.substr(i, 3);
        if(str === '===' || str === '!==' || str === '>>>' ||
        str === '<<=' || str === '>>=' || str === '**='){
          tokens.push({
            type: Punctuator,
            value: str
          });
          i+=2;
          break;
        }
        str = codeStr.substr(i, 2);
        if(str === '&&' || str === '||' || str === '==' || str === '!=' ||
        str === '+=' || str === '-=' || str === '*=' || str === '/=' ||
        str === '++' || str === '--' || str === '<<' || str === '>>' ||
        str === '&=' || str === '|=' || str === '^=' || str === '%=' ||
        str === '<=' || str === '>=' || str === '=>' || str === '**'){
          tokens.push({
            type: Punctuator,
            value: str
          });
          i+=1;
          break;
        }
        if('<>=!+-*%&|^'.indexOf(currentChar) > -1){
          tokens.push({
            type: Punctuator,
            value: currentChar
          });
          break;
        }
        if(currentChar === '/'){
          // 判断正则表达式或者除号
          // 目前方法：判断前一个非whitespace是否为 + - * / **等？
          if(codeStr.charAt(i+1) === '/'){
            // 忽略注释
            i++;
            continue;
          }
          let preToken = tokens[tokens.length-1]
          if(preToken.type === Whitespace){
            preToken = tokens[tokens.length-2]
          }
          if(!/[\+\-\*\/\=;]/.test(preToken.value)){
            tokens.push({
              type: Punctuator,
              value: currentChar
            });
            continue;
          }
          const token = {
            type: RegularExpression,
            value: {
              pattern: '',
              flags: ''
            }
          }
          tokens.push(token)
          const closer = currentChar; //结束字符串等于开始字符串
          let escaped = false; //表示下一个字符是不是被转义
          for (i++; i < codeStr.length; i++) {
            currentChar = codeStr.charAt(i);
            if (escaped) {
              escaped = false;
            }
            if (currentChar === '\\') { //被转义，下一个字符直接添加
              escaped = true;
            } else if (currentChar === closer) {
              break;
            }
            token.value.pattern += currentChar //这里一个一个字符判断，到最后的closer也要添加
          }
          while(codeStr.charAt(i+1) && !/[\s;]/.test(codeStr.charAt(i+1))){
            if(/[igm]/.test(codeStr.charAt(++i))){
              token.value.flags += codeStr.charAt(i)
            }else{
              throw new Error('Unexpected token '+codeStr.charAt(i))
            }
          }
          continue;
        }
      // 可扩充其他类型判断
      throw new Error('Unexpected ' + currentChar);
    }
  }
  tokens.push({
    type: EOF,
    value: undefined
  })
  return tokens;
}
function isKeyword(w){
  const len = w.length;
  switch(len){
    case 2:
      return w === 'do' || w === 'in' || w === 'if';
    case 3:
      return w === 'for' || w === 'new' || w === 'try' || w === 'var' || w === 'let';
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
// test('RegularExpression 2', t => {
//   const code = \`var a = 1;
//   /2/i;\`
//   const tokens = tokenize(code);
// })
// `))
// const code = 'var a = /[a-zA-Z]/g'
// const tokens = tokenizeCode(code);

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