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
const {
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
} = require('../src/parse')
const test = require('ava').test;

test('basic parse', t => {
  const token = tokenize('alert(3)');
  const ast = parse(token);
  t.deepEqual(ast, {
    type: 'Program',
    body: [{
      type: ExpressionStatement,
      expression: {
        type: CallExpression,
        callee: {
          type: Identifier,
          name: 'alert'
        },
        arguments: [{
          type: NumericLiteral,
          value: 3
        }]
      }
    }, ]
  })
})
test('do while', t => {
  const token = tokenize('do{alert()}while(true)');
  const ast = parse(token);
  t.deepEqual(ast, {
    type: 'Program',
    body: [{
      type: DoWhileStatement,
      body: {
        type: BlockStatement,
        body: [{
          type: ExpressionStatement,
          expression: {
            type: CallExpression,
            callee: {
              type: Identifier,
              name: 'alert'
            },
            arguments: []
          }
        }, ]
      },
      test: {
        type: BooleanLiteral,
        value: true
      }
    }, ]
  })
})
test('if', t => {
  const token = tokenize('if(true){alert()}');
  const ast = parse(token);
  t.deepEqual(ast, {
    type: 'Program',
    body: [{
      type: IfStatement,
      test: {
        type: BooleanLiteral,
        value: true
      },
      consequent: {
        type: BlockStatement,
        body: [{
          type: ExpressionStatement,
          expression: {
            type: CallExpression,
            callee: {
              type: Identifier,
              name: 'alert'
            },
            arguments: []
          }
        }]
      },
    }, ]
  })
})
test('var a=1,b=2,c', t => {
  const token = tokenize('var a=1,b=2,c');
  const ast = parse(token);
  t.deepEqual(ast, {
    type: 'Program',
    body: [{
      type: VariableDeclaration,
      declarations: [
        {
          type: VariableDeclarator,
          id: {
            type: Identifier,
            name: 'a'
          },
          init: {
            type: NumericLiteral,
            value: 1
          }
        },
        {
          type: VariableDeclarator,
          id: {
            type: Identifier,
            name: 'b'
          },
          init: {
            type: NumericLiteral,
            value: 2
          }
        },
        {
          type: VariableDeclarator,
          id: {
            type: Identifier,
            name: 'c'
          },
          init: undefined
        }
      ],
      kind: 'var'
    }, ]
  })
})
test('for(var i=0;i<10;i++){}', t => {
  const token = tokenize('for(var i=0;i<10;i++){}');
  const ast = parse(token);
  t.deepEqual(ast, {
    type: 'Program',
    body: [{
      type: ForStatement,
      init: {
        type: VariableDeclaration,
        declarations: [{
          type: VariableDeclarator,
          id: {
            type: Identifier,
            name: 'i'
          },
          init: {
            type: NumericLiteral,
            value: 0
          }
        }],
        kind: 'var'
      },
      test: {
        type: BinaryExpression,
        left: {
          type: Identifier,
          name: 'i',
        },
        operator: '<',
          right: {
            type: NumericLiteral,
            value: 10
          }
      },
      update: {
        type: UpdateExpression,
        operator: '++',
        argument: {
          type: Identifier,
          name: 'i'
        }
      },
      body: {
        type: BlockStatement,
        body: []
      }
    }, ]
  })
})
test('var a = 1+b+a()', t => {
  const token = tokenize('var a = 1+b+a()');
  const ast = parse(token);
  console.log(JSON.stringify(ast,null,2))
  t.deepEqual(ast, {
    type: 'Program',
    body: [{
      type: VariableDeclaration,
      declarations: [
        {
          type: VariableDeclarator,
          id: {
            type: Identifier,
            name: 'a'
          },
          init: {
            type: BinaryExpression,
            left: {
              type: BinaryExpression,
              left: {
                type: NumericLiteral,
                value: 1
              },
              operator: '+',
              right: {
                type: Identifier,
                name: 'b'
              }
            },
            operator: '+',
            right: {
              type: CallExpression,
              callee: {
                type: Identifier,
                name: 'a'
              },
              arguments: []
            }
          }
        },
      ],
      kind: 'var'
    }, ]
  })
})