const { tokenize, BooleanLiteral, EOF, Identifier, Keyword, NullLiteral, NumericLiteral, Punctuator, StringLiteral, RegularExpression, Template, Whitespace } = require('../src/tokenize');
const test = require('ava').test;

test('basic tokenize', t => {
    const code = 'var a = 1;'
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a' },
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '1' },
        { type: Punctuator, value: ';' },
    ])
})

test('simple binary', t => {
    const code = 'var a = 1+2+3;'
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a' },
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '1' },
        { type: Punctuator, value: '+' },
        { type: NumericLiteral, value: '2' },
        { type: Punctuator, value: '+' },
        { type: NumericLiteral, value: '3' },
        { type: Punctuator, value: ';' },
    ])
})

test('simple if statement', t => {
    const code = `
    if (1 > 0) {
        a();
    }`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Whitespace, value: '\n    ' },
        { type: Keyword, value: 'if',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '(' },
        { type: NumericLiteral, value: '1' },
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '>' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '0' },
        { type: Punctuator, value: ')' },
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '{' },
        { type: Whitespace, value: '\n        ' },
        { type: Identifier, value: 'a' },
        { type: Punctuator, value: '(' },
        { type: Punctuator, value: ')' },
        { type: Punctuator, value: ';' },
        { type: Whitespace, value: '\n    ' },
        { type: Punctuator, value: '}' },
    ])
})

test('simple string', t => {
    const code = `
    alert("function is good")`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Whitespace, value: '\n    ' },
        { type: Identifier, value: 'alert',},
        { type: Punctuator, value: '(' },
        { type: StringLiteral, value: '"function is good"',},
        { type: Punctuator, value: ')' },
    ])
})

test('function declaration', t => {
    const code = `
    function add1(a){
        return a+1
    }`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Whitespace, value: '\n    ' },
        { type: Keyword, value: 'function'},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'add1' },
        { type: Punctuator, value: '(' },
        { type: Identifier, value: 'a' },
        { type: Punctuator, value: ')' },
        { type: Punctuator, value: '{' },
        { type: Whitespace, value: '\n        ' },
        { type: Keyword, value: 'return' },
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a' },
        { type: Punctuator, value: '+' },
        { type: NumericLiteral, value: '1' },
        { type: Whitespace, value: '\n    ' },
        { type: Punctuator, value: '}' },
    ])
})

test('member function', t => {
    const code = `var a = Math.pow(2, 3)`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'Math',},
        { type: Punctuator, value: '.' },
        { type: Identifier, value: 'pow',},
        { type: Punctuator, value: '(' },
        { type: NumericLiteral, value: '2' },
        { type: Punctuator, value: ',' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '3' },
        { type: Punctuator, value: ')' },
    ])
})
test('calculate Punctuator', t => {
    const code = `var a = i++`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'i',},
        { type: Punctuator, value: '++' },
    ])
})
