const test = require('ava').test;
const tokenizer = require('../tokenizer.js');
const parse = require('../parse.js');

test('basic parse', t => {
    const token = tokenizer('hello world');
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

test('check template', t => {
    const token = tokenizer('hello {{name}}');
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
                type: 'expression',
                name: 'name',
                path: []
            }
        ]
    })
})

test('many words', t => {
    const token = tokenizer('hello {{name}}, i am {{age}} years old.');
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
                type: 'expression',
                name: 'name',
                path: []
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
                value: 'i'
            },
            {
                type: 'whitespace',
                value: ' '
            },
            {
                type: 'string',
                value: 'am'
            },
            {
                type: 'whitespace',
                value: ' '
            },
            {
                type: 'expression',
                name: 'age',
                path: []
            },
            {
                type: 'whitespace',
                value: ' '
            },
            {
                type: 'string',
                value: 'years'
            }, {
                type: 'whitespace',
                value: ' '
            }, {
                type: 'string',
                value: 'old'
            }, {
                type: 'symbol',
                value: '.'
            }
        ]
    })
})

test('in worong template', t => {
    const token = tokenizer('hello {{name}');
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
                value: '{{name}'
            }
        ]
    })
})
test('in wrong template', t => {
    const token = tokenizer('hello {{name}}{');
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
                type: 'expression',
                name: 'name',
                path: []
            },
            {
                type: 'paren',
                value: '{'
            }
        ]
    })
})

test('whitespaces in template', t => {
    const token = tokenizer('hello {{  name    }}');
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
                type: 'expression',
                name: 'name',
                path: []
            }
        ]
    })
})