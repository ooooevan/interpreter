/**
 * 
 * 常见类型
 * VariableDeclaration  声明
 * BinaryExpression   二元运算符表达式，有operator、left和right属性
 * ConditionalExpression  三元运算表达式，有test、consequent和alternate属性
 * ExpressionStatement  表达式语句
 * AssignmentExpression   赋值表达式，有operator、left和right属性
 * MemberExpression  成员表达式
 * ThisExpression   表示this
 * ObjectExpression  对象表达式
 * ArrayExpression   数组表达式
 * NewExpression   new表达式
 * CallExpression   函数调用表达式
 * TemplateLiteral   模板字符串表达式
 * TemplateElement   模板字符串中的值（用其中的expression分割）
 * ArrowFunctionExpression  箭头函数表达式
 * UnaryExpression   一元运算符表达式，自增自减不在此。有operator(运算符)、prefix(前缀运算符)和argument(执行的表达式)
 * UpdateExpression  update运算表达式，为自增自减
 * FunctionDeclaration   函数声明
 * BlockStatement   块语句
 * AssignmentPattern  
 * IfStatement   if语句块，其中有test、consequent和alternate属性
 * SwitchStatement   switch语句，其中有test和consequent属性
 * ForStatement  for语句，其中有init、test、update和body属性
 * ImportDeclaration   import声明
 * ImportDefaultSpecifier  import default
 * ExportDefaultDeclaration  默认导出声明
 * 
 */

function parse(tokens) {
  let i = -1;
  let curToken;

  function nextStatement() {
    stash();
    nextToken();
    if (curToken.type === 'identifier' && curToken.value === 'var') {
      const statement = {
        type: 'VariableDeclaration',
        kind: curToken.value,
        declarations: []
      }
      nextToken();
      let declaration = {
        type: 'VariableDeclarator',
        id: {
          type: 'identifier',
          name: curToken.value
        },
        init: undefined
      }
      nextToken();
      if (curToken.type !== 'operator' || curToken.value !== '=') {
        throw new Error('Unexpected token ' + curToken.value);
      }
      declaration.init = nextExpression();
      statement.declarations.push(declaration);
      return statement
    }
    if (curToken.type === 'identifier' && curToken.value === 'if') {
      const statement = {
        type: 'IfStatement',
      }
      nextToken();
      if (curToken.type !== 'parens' || curToken.value !== '(') {
        throw new Error('Expected ( after if')
      }
      // if中的判断是一个表达式
      statement.test = nextExpression();

      nextToken();
      if (curToken.type !== 'parens' || curToken.value !== ')') {
        throw new Error('Expected ) after if test expression')
      }
      // if成立时执行的语句
      statement.consequent = nextStatement()
      // 有else的语句，暂不考虑else if
      if (curToken.type === '' && curToken.value === 'else') {
        statement.alternative = nextStatement();
      } else {
        statement.alternative = null;
      }
      commit();
      return statement;
    }
    if (curToken.type === 'identifier' && curToken.value === 'function') {
      const statement = {
        type: 'FunctionDeclaration',
        id: {
          type: 'Identifier',
          name: curToken.value
        },
        body: '',
      }
      nextToken();
      if (curToken.type !== 'identifier') {
        throw new Error('Expected identifier after function declaration')
      }
      statement.id = curToken.value
      nextToken();
      if (curToken.type !== 'parens' || curToken.value !== '(') {
        throw new Error('Expected ( after function identifier')
      }
      nextToken();
      if (curToken.type !== 'parens' && curToken.value !== ')') {
        statement.params = statement.params || []
        statement.params.push({
          name: curToken.value,
          type: curToken.type
        });
        nextToken();
        while (curToken.type === 'comma' && curToken.value === ',') {
          statement.params.push({
            name: curToken.value,
            type: curToken.type
          });
          nextToken();
        }
      }
      if (curToken.type !== 'parens' || curToken.value !== ')') {
        throw new Error('Expected ) after function params')
      }
      statement.body = nextStatement();
      commit();
      return statement;
    }
    if (curToken.type === 'brace' && curToken.value === '{') {
      const statement = {
        type: 'BlockStatement',
        body: []
      }
      while (i < tokens.length) {
        stash();
        nextToken();
        if (curToken.type === 'brace' && curToken.value === '}') {
          commit(); //这里commit了外层有commit，还不确定为什么
          break;
        };
        rewind();
        statement.body.push(nextStatement())
        stash()
        nextToken();
        if (curToken.type !== 'sep' || curToken.value !== ';') {
          rewind();
        }
      }
      commit();
      return statement;
    }

    if (curToken.type === 'sep' && curToken.value === ';') {
      return {
        type: 'EmptyStatement'
      }
    }
    // 没有找到特别的语句标志，回到语句开头
    rewind();
    // 尝试解析表达式语句
    const statement = {
      type: 'ExpressionStatement',
      expression: nextExpression()
    }
    if (statement.expression) {
      // stash()
      // nextToken()
      // if(curToken.type === 'sep' && curToken.value === ';'){
      //   nextToken();
      // }
      // rewind();
      // if (curToken.type !== 'EOF' && curToken.type !== 'sep') {
      //   throw new Error('Missing ; at the ending of expression');
      // }
      return statement;
    }
  }

  function nextExpression() {
    nextToken()
    if (curToken.type === 'identifier') {
      const identifier = {
        type: 'Identifier',
        name: curToken.value
      }
      stash();
      nextToken();
      if (curToken.type === 'parens' && curToken.value === '(') {
        // 标识符后面跟着'('，这是函数调用
        const expr = {
          type: 'CallExpression',
          callee: identifier,
          arguments: []
        };
        stash();
        nextToken();
        if (curToken.type === 'parens' && curToken.value === ')') {
          // '('后面跟着')'，说明没有参数
          commit();
        } else {
          rewind();
          while (i < tokens.length) {
            expr.arguments.push(nextExpression());
            nextToken()
            if (curToken.type === 'parens' && curToken.value === ')') {
              break;
            }
            if (curToken.type !== 'comma' && curToken.value !== ',') {
              // 参数没到')'，那就是逗号，否则报错
              throw new Error('Expected , between arguments')
            }
          }
        }
        commit();
        return expr;
      }
      rewind();
      return identifier;
    }
    if (curToken.type === 'number') {
      // 常量表达式
      let statement = {
        type: 'Literal',
        value: eval(curToken.value)
      }
      stash();
      nextToken();
      while(curToken.type === 'operator'){
        const _curToken = curToken
        nextToken();
        if(curToken.type !== 'number' && curToken.type !== 'string') {
          throw new Error('Unexpected '+curToken.value)
        }
        _statement = {
          type: 'BinaryExpression',
          left: statement,
          operator: _curToken.value,
          right: {
            type: 'Literal',
            value: eval(curToken.value)
          }
        }
        statement = _statement
        stash()
        nextToken();
      }
      rewind();
      return statement;
    }
    if (curToken.type === 'string') {
      return literal = {
        type: 'Literal',
        value: eval(curToken.value)
      }
    }
    // if(curToken.type === 'sep'){
    //   return {
    //     type: 'BlockStatement'
    //   }
    // }
    // if (curToken.type !== 'EOF') {
    //   throw new Error('Unexpected token ' + curToken.value)
    // }
  }

  const stashStack = []

  //保存当前正在解析哪一个token
  function stash(cb) {
    stashStack.push(i)
  }
  // 获取下一个token，自动跳过空白
  function nextToken() {
    do {
      i++;
      curToken = tokens[i] || {
        type: 'EOF'
      }
    } while (curToken.type === 'whitespace')
  }

  function commit() {
    stashStack.pop();
  }

  function rewind() {
    i = stashStack.pop();
    curToken = tokens[i]
  }


  const ast = {
    type: 'Program',
    body: [],
  };
  while (i < tokens.length) {
    const statement = nextStatement();
    if (!statement) {
      break;
    }
    ast.body.push(statement);
  }
  return ast;
}
// const tokens = [ { type: 'whitespace', value: '\n  ' },
// { type: 'identifier', value: 'function' },
// { type: 'whitespace', value: ' ' },
// { type: 'identifier', value: 'a' },
// { type: 'parens', value: '(' },
// { type: 'parens', value: ')' },
// { type: 'brace', value: '{' },
// { type: 'whitespace', value: '\n    ' },
// { type: 'identifier', value: 'var' },
// { type: 'whitespace', value: ' ' },
// { type: 'identifier', value: 'abc' },
// { type: 'whitespace', value: ' ' },
// { type: 'operator', value: '=' },
// { type: 'whitespace', value: ' ' },
// { type: 'string', value: '\'abc\'' },
// { type: 'whitespace', value: '\n    ' },
// { type: 'identifier', value: 'alert' },
// { type: 'parens', value: '(' },
// { type: 'string', value: '"1"' },
// { type: 'parens', value: ')' },
// { type: 'sep', value: ';' },
// { type: 'whitespace', value: '\n  ' },
// { type: 'brace', value: '}' },
// { type: 'sep', value: ';' },
// { type: 'whitespace', value: '\n  ' },
// { type: 'identifier', value: 'if' },
// { type: 'whitespace', value: ' ' },
// { type: 'parens', value: '(' },
// { type: 'number', value: '1' },
// { type: 'whitespace', value: ' ' },
// { type: 'operator', value: '>' },
// { type: 'whitespace', value: ' ' },
// { type: 'number', value: '0' },
// { type: 'parens', value: ')' },
// { type: 'whitespace', value: ' ' },
// { type: 'brace', value: '{' },
// { type: 'whitespace', value: '\n    ' },
// { type: 'identifier', value: 'a' },
// { type: 'parens', value: '(' },
// { type: 'parens', value: ')' },
// { type: 'sep', value: ';' },
// { type: 'whitespace', value: '\n  ' },
// { type: 'brace', value: '}' },
// { type: 'whitespace', value: '\n' } ]
// const ast = parse(tokens)
// console.log(JSON.stringify(ast, null, 2))

module.exports = parse