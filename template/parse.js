function parser(tokens) {
  const ast = {
    type: "Program",
    body: []
  };
  let current = 0;
  while (current < tokens.length) {
    let token = tokens[current];
    if (token.type === 'paren' && token.value === '{') {
      // 暂存是一个{{name}}的插槽
      const temp = {
        type: 'expression',
        name: undefined,
        path: []
      }
      // 暂存不是插槽的字符串
      let tempStr = ''
      let nextToken = tokens[current + 1];
      if (!nextToken) {
        ast.body.push(token);
        current++;
        continue;
      }
      if (nextToken.type !== 'paren' || nextToken.value !== '{') {
        ast.body.push(token);
        current++;
        continue;
      }
      tempStr += '{{'
      // 确定是 {{
      current++;
      current++;
      if (!tokens[current]) {
        ast.body.push({
          type: 'string',
          value: tempStr
        });
        continue
      }
      // 情况：{{  a}}，支持前面有空格
      if (tokens[current].type === 'whitespace') {
        tempStr += tokens[current].value;
        current++;
      }
      // 情况：以{{a\s 结尾
      if (!tokens[current]) {
        ast.body.push({
          type: 'string',
          value: tempStr
        });
        continue;
      }
      if (tokens[current].value !== '}') {
        temp.name = tokens[current].value
        tempStr += tokens[current].value
        current++;
      }
      // 情况：以{{a结尾
      if (!tokens[current]) {
        ast.body.push({
          type: 'string',
          value: tempStr
        });
        continue;
      }
      // 情况：以{{a}结尾
      if (tokens[current].value === '}' && !tokens[current + 1]) {
        tempStr += '}'
        ast.body.push({
          type: 'string',
          value: tempStr
        });
        current++;
        continue;
      }
      // 情况：支持对象取值如 obj.name.aaa
      while(tokens[current].value === '.'){
        tempStr += '.'
        current++;
        if (tokens[current].type !== 'string'){
          throw new Error('unexpected token ' + tokens[current].value)
        }
        temp.path.push(tokens[current].value);
        tempStr += tokens[current].value;
        current++;
      }
      // 情况：支持{{a  后面空格
      if (tokens[current].type === 'whitespace') {
        tempStr += tokens[current].value;
        current++;
      }
      if (!tokens[current]) {
        ast.body.push({
          type: 'string',
          value: tempStr
        })
        continue;
      }
      if (!tokens[current + 1]) {
        ast.body.push({
          type: 'string',
          value: tempStr + tokens[current].value
        })
        current++;
        continue;
      }
      // 情况： {{a}} 符合插槽情况
      if (tokens[current].value === '}' && tokens[current + 1].value === '}') {
        ast.body.push(temp);
        current++;
        current++;
        continue;
      }
      // 情况：{{a} 不是结尾，后面接非}
      ast.body.push({
        type: 'string',
        value: tempStr + tokens[current].value
      })
      current++;
      continue;
    }

    if (token.type === 'symbol' || token.type === 'whitespace' || token.type === 'number' || token.type === 'string') {
      ast.body.push(token);
      current++;
      continue;
    }
    if (token.type === 'paren' && token.value === '}') {
      ast.body.push(token);
      current++;
      continue;
    }
  }
  return ast
}

if(typeof module !== 'undefined'){
  module.exports = parser
}