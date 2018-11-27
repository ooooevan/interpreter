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
        { type: EOF, value: undefined },
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
        { type: EOF, value: undefined },
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
        { type: EOF, value: undefined },
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
        { type: EOF, value: undefined },
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
        { type: EOF, value: undefined },
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
        { type: EOF, value: undefined },
    ])
})
test('boolean null', t => {
    const code = `var a = null;b = true;`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: NullLiteral, value: 'null',},
        { type: Punctuator, value: ';' },
        { type: Identifier, value: 'b',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: BooleanLiteral, value: 'true' },
        { type: Punctuator, value: ';' },
        { type: EOF, value: undefined },
    ])
})
test('calculate Punctuator 1', t => {
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
        { type: EOF, value: undefined },
    ])
})

test('Punctuator 2', t => {
    const code = `var a += 1`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '+=' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '1',},
        { type: EOF, value: undefined },
    ])
})
test('Punctuator 3', t => {
    const code = `console.log(2 ** 3 + 1 / 3)`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Identifier, value: 'console',},
        { type: Punctuator, value: '.' },
        { type: Identifier, value: 'log',},
        { type: Punctuator, value: '(' },
        { type: NumericLiteral, value: '2' },
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '**' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '3',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '+' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '1',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '/' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '3'},
        { type: Punctuator, value: ')' },
        { type: EOF, value: undefined },
    ])
})
test('Punctuator 4', t => {
    const code = `var a = true?1:2`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: BooleanLiteral, value: 'true' },
        { type: Punctuator, value: '?' },
        { type: NumericLiteral, value: '1' },
        { type: Punctuator, value: ':' },
        { type: NumericLiteral, value: '2',},
        { type: EOF, value: undefined },
    ])
})
test('Punctuator 5', t => {
    const code = `var a = (1>0)?1:2`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '(' },
        { type: NumericLiteral, value: '1' },
        { type: Punctuator, value: '>' },
        { type: NumericLiteral, value: '0' },
        { type: Punctuator, value: ')' },
        { type: Punctuator, value: '?' },
        { type: NumericLiteral, value: '1' },
        { type: Punctuator, value: ':' },
        { type: NumericLiteral, value: '2',},
        { type: EOF, value: undefined },
    ])
})
test('Template', t => {
    const code = 'var a = `${b}a`'
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: Template, value: '`${b}a`' },
        { type: EOF, value: undefined },
    ])
})
test('RegularExpression 1', t => {
    const code = 'var a = /[a-zA-Z\+]/g;'
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: RegularExpression, value: {
            pattern: '[a-zA-Z\+]',
            flags: 'g'
        }},
        { type: Punctuator, value: ';' },
        { type: EOF, value: undefined },
    ])
})
test('RegularExpression 2', t => {
    const code = `var a = 1;
    /2/i`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '1',},
        { type: Punctuator, value: ';' },
        { type: Whitespace, value: '\n    ' },
        { type: RegularExpression, value: {
            pattern: '2',
            flags: 'i'
        }},
        { type: EOF, value: undefined },
    ])
})
test('RegularExpression 2', t => {
    const code = `
    test('RegularExpression 2', t => {
        const code = \`var a = 1;
        /2/i;\`
        const tokens = tokenize(code);
    })`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Whitespace, value: '\n    ' },
        { type: Identifier, value: 'test',},
        { type: Punctuator, value: '(' },
        { type: StringLiteral, value: '\'RegularExpression 2\'' },
        { type: Punctuator, value: ',' },
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 't',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=>' },
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '{' },
        { type: Whitespace, value: '\n        ' },
        { type: Keyword, value: 'const' },
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'code' },
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: Template, value: '`var a = 1;\n        /2/i;`' },
        { type: Whitespace, value: '\n        ' },
        { type: Keyword, value: 'const' },
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'tokens' },
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'tokenize' },
        { type: Punctuator, value: '(' },
        { type: Identifier, value: 'code' },
        { type: Punctuator, value: ')' },
        { type: Punctuator, value: ';' },
        { type: Whitespace, value: '\n    ' },
        { type: Punctuator, value: '}' },
        { type: Punctuator, value: ')' },
        { type: EOF, value: undefined },
    ])
})

test('calculate not RegularExpression', t => {
    const code = `var a = 1
    /2/i;a /= 1`
    const tokens = tokenize(code);
    t.deepEqual(tokens, [
        { type: Keyword, value: 'var',},
        { type: Whitespace, value: ' ' },
        { type: Identifier, value: 'a',},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '=' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '1',},
        { type: Whitespace, value: '\n    ' },
        { type: Punctuator, value: '/' },
        { type: NumericLiteral, value: '2',},
        { type: Punctuator, value: '/' },
        { type: Identifier, value: 'i'},
        { type: Punctuator, value: ';' },
        { type: Identifier, value: 'a'},
        { type: Whitespace, value: ' ' },
        { type: Punctuator, value: '/=' },
        { type: Whitespace, value: ' ' },
        { type: NumericLiteral, value: '1',},
        { type: EOF, value: undefined },
    ])
})