const test = require('ava').test;
const tokenizer = require('../tokenizer.js');

test('basic tokenizer', t => {
    const tokens = tokenizer("hello world");
    t.deepEqual(tokens, [{
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
    ])
})

test('check template', t => {
    const token = tokenizer("name is {{name}}");
    t.deepEqual(token, [{
            type: 'string',
            value: 'name'
        },
        {
            type: 'whitespace',
            value: ' '
        },
        {
            type: 'string',
            value: 'is'
        },
        {
            type: 'whitespace',
            value: ' '
        },
        {
            type: 'paren',
            value: '{'
        },
        {
            type: 'paren',
            value: '{'
        },
        {
            type: 'string',
            value: 'name'
        },
        {
            type: 'paren',
            value: '}'
        },
        {
            type: 'paren',
            value: '}'
        },
    ])
})

test('many words', t => {
    const token = tokenizer("my name is {{name}}, how are you?");
    t.deepEqual(token, [{
            type: 'string',
            value: 'my'
        },
        {
            type: 'whitespace',
            value: ' '
        },
        {
            type: 'string',
            value: 'name'
        },
        {
            type: 'whitespace',
            value: ' '
        },
        {
            type: 'string',
            value: 'is'
        },
        {
            type: 'whitespace',
            value: ' '
        },
        {
            type: 'paren',
            value: '{'
        },
        {
            type: 'paren',
            value: '{'
        },
        {
            type: 'string',
            value: 'name'
        },
        {
            type: 'paren',
            value: '}'
        },
        {
            type: 'paren',
            value: '}'
        },
        {
            type: 'symbol',
            value: ','
        },
        {
            type: 'whitespace',
            value: ' '
        },
        {
            type: 'string',
            value: 'how'
        },
        {
            type: 'whitespace',
            value: ' '
        },
        {
            type: 'string',
            value: 'are'
        },
        {
            type: 'whitespace',
            value: ' '
        },
        {
            type: 'string',
            value: 'you'
        },
        {
            type: 'symbol',
            value: '?'
        }
    ])
})