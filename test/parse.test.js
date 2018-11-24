const { tokenize, BooleanLiteral, EOF, Identifier, Keyword, NullLiteral, NumericLiteral, Punctuator, StringLiteral, RegularExpression, Template, Whitespace } = require('../src/tokenize');
const parse = require('../src/parse')
const test = require('ava').test;

test('basic parse', t => {
    const token = tokenize('hello world');
    const ast = parse(token);
    t.deepEqual(ast, {
        type: "Program",
        body: [{
                type: 'string',
                value: 'hello'
            },
            {
                type: 'whitespace',
                value: ' '
            },
            {
                type: 'string',
                value: 'world'
            }
        ]
    })
})
