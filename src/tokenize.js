/**
 * 
 * identifier 声明符
 * literal  字面量
 * Property  属性，对象中的key
 * 
 */

function tokenizeCode(codeStr) {
  const tokens = [];
  for (var i = 0; i < codeStr.length; i++) {
    var currentChar = codeStr.charAt(i);
    if (currentChar === ';') {
      tokens.push({
        type: 'sep',
        value: ';'
      });
      continue
    }
    if (currentChar === '(' || currentChar === ')') {
      tokens.push({
        type: 'parens',
        value: currentChar
      });
      continue
    }
    if (currentChar === '{' || currentChar === '}') {
      tokens.push({
        type: 'brace',
        value: currentChar
      })
      continue
    }
    if (currentChar === '>' || currentChar === '<') {
      tokens.push({
        type: 'operator',
        value: currentChar
      });
      continue
    }
    if (currentChar === '+') {
      tokens.push({
        type: 'operator',
        value: currentChar
      });
      continue
    }
    if (currentChar === '=') {
      tokens.push({
        type: 'operator',
        value: currentChar
      });
      continue
    }
    if (currentChar === '"' || currentChar === "'") {
      //字符串的开始，要一直取值到字符串的结束
      const token = {
        type: 'string',
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
        type: 'number',
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
        type: 'identifier',
        value: currentChar
      }
      tokens.push(token)
      for (i++; i < codeStr.length; i++) {
        currentChar = codeStr.charAt(i);
        if (/[a-zA-Z0-9&_]/.test(currentChar)) {
          token.value += currentChar
        } else {
          i--;
          break;
        }
      };
      continue;
    }
    if (/\s+/.test(currentChar)) { // \s可以匹配空格和换行
      const token = {
        type: 'whitespace',
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
        type: 'symbol',
        value: currentChar
      });
      continue
    }
    // 可扩充其他类型判断

    throw new Error('Unexpected ' + currentChar);
  }
  return tokens;
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

module.exports = tokenizeCode