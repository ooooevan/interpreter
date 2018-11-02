
function tokenizer(codeStr) {
  var current = 0;
  const tokens = [];
  while(current < codeStr.length){
    let char = codeStr[current];
    if(char === '{'){
      tokens.push({
        type: 'paren',
        value: char,
      });
      current++;
      continue;
    }
    if(char === '}'){
      tokens.push({
        type: 'paren',
        value: char,
      });
      current++
      continue;
    }
    //空白字符
    const SPACEREG = /\s/;
    if(SPACEREG.test(char)){
      let token = {
        type: 'whitespace',
        value: char,
      }
      current++;
      while(SPACEREG.test(codeStr[current])){
        token.value+=codeStr[current];
        current++
      }
      tokens.push(token)
      continue;
    }
    //数字字符
    const NUMBERREG = /[0-9]/
    if(NUMBERREG.test(char)){
      let token = {
        type: 'number',
        value: char + '',
      }
      current++;
      while(NUMBERREG.test(codeStr[current])){
        token.value+=codeStr[current];
        current++
      }
      tokens.push(token)
      continue;
    }
    // 字母字符
    const WORDREG = /[\w]/i;
    if(WORDREG.test(char)){
      let token = {
        type: 'string',
        value: char + '',
      }
      current++;
      // 这里不判断是否有值会死循环，因为WORDREG.test(undefined)为true
      while(codeStr[current] && WORDREG.test(codeStr[current])){
        token.value+=codeStr[current];
        current++
      }
      tokens.push(token)
      continue;
    }
    // 其他字符，如逗号、问号
    tokens.push({
      type: 'symbol',
        value: char,
    })
    current++;
  }
  return tokens
}

if(typeof module !== 'undefined'){
  module.exports = tokenizer
}