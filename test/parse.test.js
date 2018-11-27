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
        body: [
          {
            type: ExpressionStatement,
            expression: {
              type: CallExpression,
              callee: {
                type: Identifier,
                name: 'alert'
              },
              arguments: []
            }
          }
        ]
      },
    }, ]
  })
})