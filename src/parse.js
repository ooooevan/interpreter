/**
 * 
 * 常见类型
 * VariableDeclaration  声明
 * VariableDeclarator 声明中的赋值
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
const {
  tokenize,
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
} = require('../src/tokenize');

const VariableDeclaration = 'VariableDeclaration'
const VariableDeclarator = 'VariableDeclarator'
const BinaryExpression = 'BinaryExpression'
const ConditionalExpression = 'ConditionalExpression'
const ExpressionStatement = 'ExpressionStatement'
const AssignmentExpression = 'AssignmentExpression'
const MemberExpression = 'MemberExpression'
const ThisExpression = 'ThisExpression'
const ObjectExpression = 'ObjectExpression'
const ArrayExpression = 'ArrayExpression'
const NewExpression = 'NewExpression'
const CallExpression = 'CallExpression'
const TemplateLiteral = 'TemplateLiteral'
const TemplateElement = 'TemplateElement'
const ArrowFunctionExpression = 'ArrowFunctionExpression'
const UnaryExpression = 'UnaryExpression'
const UpdateExpression = 'UpdateExpression'
const FunctionDeclaration = 'FunctionDeclaration'
const BlockStatement = 'BlockStatement'
const AssignmentPattern = 'AssignmentPattern'
const IfStatement = 'IfStatement'
const DoWhileStatement = 'DoWhileStatement'
const WhileStatement = 'WhileStatement'
const SwitchStatement = 'SwitchStatement'
const ForStatement = 'ForStatement'
const ImportDeclaration = 'ImportDeclaration'
const ImportDefaultSpecifier = 'ImportDefaultSpecifier'
const ExportDefaultDeclaration = 'ExportDefaultDeclaration'


function parse(tokens) {
  let i = -1;
  let curToken;

  function nextStatement() {
    stash();
    nextToken();
    switch (curToken.type) {
      case Keyword:
        let val = curToken.value
        let len = val.length
        switch (len) {
          case 2:
            if (val === 'do') {
              const statement = {
                type: DoWhileStatement,
                body: nextStatement(),
                test: ''
              }
              nextToken();
              if(curToken.value !== 'while'){
                throw new Error('Expected while but got '+curToken.value);
              }
              nextToken();
              if(curToken.value !== '('){
                throw new Error('Expected ( but got '+curToken.value);
              }
              statement.test = nextExpression();
              return statement;
            }else if(val === 'in'){  // ForInStatement 2、BinaryExpression

            }else if(val === 'if'){
              const statement = {
                type: IfStatement,
                test: '',
                consequent: '',
              }
              nextToken();
              if(curToken.value !== '('){
                throw new Error('Expected ( but got '+curToken.value);
              }
              statement.test = nextExpression()
              nextToken();
              statement.consequent = nextStatement()
              return statement
            }
          case 3:  //return w === 'for' || w === 'new' || w === 'try' || w === 'var';
            if(val === 'for'){
              const statement = {
                type: ForStatement,
                init: '',
                test: '',
                update: '',
                body: '',
              }
              nextToken();
              if(curToken.value !== '('){
                throw new Error('Expected ( but got '+curToken.value);
              }
              statement.init = nextStatement();
              if(curToken.value !== ';'){
                throw new Error('Unexpected token '+curToken.value);
              }
              statement.test = nextExpression();
              nextToken()
              if(curToken.value !== ';'){
                throw new Error('Unexpected token '+curToken.value);
              }
              statement.update = nextExpression();
              nextToken()
              if(curToken.value !== ')'){
                throw new Error('Expected ) but got '+curToken.value);
              }
              statement.body = nextStatement();
              return statement
            }else if(val === 'var') {
              const statement = {
                type: VariableDeclaration,
                declarations: [],
                kind: val
              }
              nextToken();
              if(curToken.type !== Identifier){
                throw new Error('Unexpected token ' + curToken.value);
              }
              const declarator = {
                type: VariableDeclarator,
                id: {
                  type: Identifier,
                  name: curToken.value
                },
                init: undefined,
              }
              nextToken();
              if(curToken.value === '='){
                declarator.init = nextExpression();
              }
              statement.declarations.push(declarator);
              nextToken();
              while(curToken.value === ','){
                nextToken();
                if(curToken.type !== Identifier){
                  throw new Error('Unexpected token ' + curToken.value);
                }
                const declarator = {
                  type: VariableDeclarator,
                  id: {
                    type: Identifier,
                    name: curToken.value
                  },
                  init: undefined,
                }
                nextToken();
                if(curToken.value === '='){
                  declarator.init = nextExpression();
                  nextToken();
                }
                statement.declarations.push(declarator);
              }
              return statement
            }else if(val === 'let') {}
        }
      case Identifier:
        const statement = {
          type: ExpressionStatement,
          expression: {}
        }
        rewind();
        statement.expression = nextExpression();
        return statement;
      // case BooleanLiteral:
      // case NullLiteral:
      // case NumericLiteral:
      // case StringLiteral:
      // case RegularExpression:
      // case Template:
      // case Whitespace:
      // case Punctuator:
    }
    if (curToken.type === Keyword && curToken.value === 'var') {
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
    if (curToken.type === Keyword && curToken.value === 'if') {
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
    if (curToken.type === Keyword && curToken.value === 'function') {
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
    if (curToken.value === '{') {
      const statement = {
        type: 'BlockStatement',
        body: []
      }
      while (i < tokens.length) {
        stash();
        nextToken();
        if (curToken.value === '}') {
          commit(); //这里commit了外层有commit，还不确定为什么
          break;
        };
        rewind();
        statement.body.push(nextStatement())
        stash()
        nextToken();
        if (curToken.value !== ';') {
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

  function nextExpression(notRecursion) {
    stash();
    nextToken()
    let isNumericLiteral = false
    switch (curToken.type) {
      case NumericLiteral:
        isNumericLiteral = true
      case Identifier:
        let identifier
        if(isNumericLiteral){
          identifier = {
            type: NumericLiteral,
            value: Number(curToken.value)
          }
        }else{
          identifier = {
            type: Identifier,
            name: curToken.value
          }
        }
        if(notRecursion){
          nextToken()
          if(curToken.value !== '('){
            nextToken(-1)
            return identifier
          }
          nextToken(-1)
        }
        nextToken()
        if(curToken.type === Punctuator){
          let statement = identifier
          let preCurToken
          while (curToken.type === Punctuator) {
            switch(curToken.value){
              case '.':
              // case '[':
              // case ']':
                preCurToken = curToken
                // 不考虑有括号
                _statement = {
                  type: MemberExpression,
                  object: statement,
                  property: nextExpression(true)
                }
                // 如果成员是函数则类型要变，结构也变
                if(_statement.property.type === CallExpression){
                  const mem = _statement.property.callee
                  _statement =_statement.property
                  _statement.callee = {
                    type: MemberExpression,
                    object: statement,
                    property: mem
                  }
                }
                statement = _statement
                break;
              case '(':
                const expression = {
                  type: CallExpression,
                  callee: identifier,
                  arguments: []
                };
                stash();
                nextToken();
                if (curToken.value === ')') {
                  commit();
                } else {
                  // 有多个参数，如alert(1, 2)
                  rewind();
                  while (i < tokens.length) {
                    expression.arguments.push(nextExpression());
                    nextToken()
                    if (curToken.value === ')') {
                      break;
                    }
                    if (curToken.value !== ',') {
                      throw new Error('Unexpected token ' + curToken.value)
                    }
                  }
                }
                if(notRecursion){
                  return expression;
                }
                commit();
                statement = expression;
                break;
              // case ')':
                
              case '>>>=':
              case '===':
              case '!==':
              case '>>>':
              case '<<=':
              case '>>=':
              case '**=':
              case '&&':
              case '||':
              case '==':
              case '!=':
              case '+=':
              case '-=':
              case '*=':
              case '/=':
              
              case '<<':
              case '>>':
              case '&=':
              case '|=':
              case '^=':
              case '%=':
              case '<=':
              case '>=':
              case '=>':
              case '**':

              case '!':
              case '&':
              case '%':
              case '|':
              case '^':
              case '+':
              case '-':
              case '<':
              case '>':
                preCurToken = curToken
                _statement = {
                  type: BinaryExpression,
                  left: statement,
                  operator: preCurToken.value,
                  right: nextExpression(true)
                }
                statement = _statement
                // stash()
                break;
              case '*':
              case '/':
                preCurToken = curToken
                const divisor = nextExpression(true)
                const right = {
                  left: statement.right,
                  type: BinaryExpression,
                  operator: preCurToken.value,
                  right: divisor
                }
                statement.right = right
                statement = _statement
                // stash()
                break;
              case '++':
              case '--':
                _statement = {
                  type: UpdateExpression,
                  operator: curToken.value,
                  argument: {
                    type: Identifier,
                    name: statement.name
                  },
                }
                return _statement;
              default:  // ; ) ,
                nextToken(-1)
                return statement;
            }
            commit()
            nextToken()
          }
          // rewind();
          return statement;
        }
        // rewind();
        return identifier;

      case StringLiteral:
        return {
          type: StringLiteral,
          value: eval(curToken.value)
        }
      case BooleanLiteral:
        return {
          type: BooleanLiteral,
          value: Boolean(curToken.value)
        }
      case NullLiteral:
        return {
          type: NullLiteral,
        }
    }
    // if (curToken.type === NumericLiteral) {
    //   // 常量表达式
    //   let statement = {
    //     type: NumericLiteral,
    //     value: eval(curToken.value)
    //   }
    //   stash();
    //   nextToken();
    //   while (curToken.type === 'operator') {
    //     const _curToken = curToken
    //     nextToken();
    //     if (curToken.type !== 'string') {
    //       throw new Error('Unexpected ' + curToken.value)
    //     }
    //     _statement = {
    //       type: 'BinaryExpression',
    //       left: statement,
    //       operator: _curToken.value,
    //       right: {
    //         type: NumericLiteral,
    //         value: eval(curToken.value)
    //       }
    //     }
    //     statement = _statement
    //     stash()
    //     nextToken();
    //   }
    //   rewind();
    //   return statement;
    // }
  }

  const stashStack = []

  //保存当前正在解析哪一个token
  function stash(cb) {
    stashStack.push(i)
  }
  // 获取下一个token，自动跳过空白
  function nextToken(index) {
    do {
      if(index === -1){
        i--;
      }else{
        i++;
      }
      curToken = tokens[i] || {
        type: EOF
      }
    } while (curToken.type === Whitespace)
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

module.exports = {
  parse,
  VariableDeclaration,
  VariableDeclarator,
  BinaryExpression,
  ConditionalExpression,
  ExpressionStatement,
  AssignmentExpression,
  MemberExpression,
  ThisExpression,
  ObjectExpression,
  ArrayExpression,
  NewExpression,
  CallExpression,
  TemplateLiteral,
  TemplateElement,
  ArrowFunctionExpression,
  UnaryExpression,
  UpdateExpression,
  FunctionDeclaration,
  BlockStatement,
  AssignmentPattern,
  IfStatement,
  DoWhileStatement,
  WhileStatement,
  SwitchStatement,
  ForStatement,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ExportDefaultDeclaration,
}