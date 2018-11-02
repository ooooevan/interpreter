const tokenize = require('../src/tokenize');
const test = require('ava').test;

test('basic tokenize', t => {
    const code = 'var a = 1;'
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: 'identifier', value: 'var',},
        { type: 'whitespace', value: ' ' },
        { type: 'identifier', value: 'a' },
        { type: 'whitespace', value: ' ' },
        { type: 'operator', value: '=' },
        { type: 'whitespace', value: ' ' },
        { type: 'number', value: '1' },
        { type: 'sep', value: ';' },
    ])
})

test('simple binary', t => {
    const code = 'var a = 1+2+3;'
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: 'identifier', value: 'var',},
        { type: 'whitespace', value: ' ' },
        { type: 'identifier', value: 'a' },
        { type: 'whitespace', value: ' ' },
        { type: 'operator', value: '=' },
        { type: 'whitespace', value: ' ' },
        { type: 'number', value: '1' },
        { type: 'operator', value: '+' },
        { type: 'number', value: '2' },
        { type: 'operator', value: '+' },
        { type: 'number', value: '3' },
        { type: 'sep', value: ';' },
    ])
})

test('simple if statement', t => {
    const code = `
    if (1 > 0) {
        a();
    }`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: 'whitespace', value: '\n    ' },
        { type: 'identifier', value: 'if',},
        { type: 'whitespace', value: ' ' },
        { type: 'parens', value: '(' },
        { type: 'number', value: '1' },
        { type: 'whitespace', value: ' ' },
        { type: 'operator', value: '>' },
        { type: 'whitespace', value: ' ' },
        { type: 'number', value: '0' },
        { type: 'parens', value: ')' },
        { type: 'whitespace', value: ' ' },
        { type: 'brace', value: '{' },
        { type: 'whitespace', value: '\n        ' },
        { type: 'identifier', value: 'a' },
        { type: 'parens', value: '(' },
        { type: 'parens', value: ')' },
        { type: 'sep', value: ';' },
        { type: 'whitespace', value: '\n    ' },
        { type: 'brace', value: '}' },
    ])
})

test('simple string', t => {
    const code = `
    alert("function is good")`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: 'whitespace', value: '\n    ' },
        { type: 'identifier', value: 'alert',},
        { type: 'parens', value: '(' },
        { type: 'string', value: '"function is good"',},
        { type: 'parens', value: ')' },
    ])
})

test('function declaration', t => {
    const code = `
    function add1(a){
        return a+1
    }`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: 'whitespace', value: '\n    ' },
        { type: 'identifier', value: 'function'},
        { type: 'whitespace', value: ' ' },
        { type: 'identifier', value: 'add1' },
        { type: 'parens', value: '(' },
        { type: 'identifier', value: 'a' },
        { type: 'parens', value: ')' },
        { type: 'brace', value: '{' },
        { type: 'whitespace', value: '\n        ' },
        { type: 'identifier', value: 'return' },
        { type: 'whitespace', value: ' ' },
        { type: 'identifier', value: 'a' },
        { type: 'operator', value: '+' },
        { type: 'number', value: '1' },
        { type: 'whitespace', value: '\n    ' },
        { type: 'brace', value: '}' },
    ])
})

test('member function', t => {
    const code = `var a = Math.pow(2, 3)`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: 'identifier', value: 'var',},
        { type: 'whitespace', value: ' ' },
        { type: 'identifier', value: 'a',},
        { type: 'whitespace', value: ' ' },
        { type: 'operator', value: '=' },
        { type: 'whitespace', value: ' ' },
        { type: 'identifier', value: 'Math',},
        { type: 'symbol', value: '.' },
        { type: 'identifier', value: 'pow',},
        { type: 'parens', value: '(' },
        { type: 'number', value: '2' },
        { type: 'symbol', value: ',' },
        { type: 'whitespace', value: ' ' },
        { type: 'number', value: '3' },
        { type: 'parens', value: ')' },
    ])
})
