const test = require('ava').test;
const tokenizer = require('../tokenizer.js');
const parse = require('../parse.js');
const transform = require('../transform.js');

test('basic transform', t => {
    const token = tokenizer('hello {{name}}');
    const obj = {
        name: 'evan'
    }
    const ast = parse(token);
    const transAst = transform(ast, obj);
    t.deepEqual(transAst, {
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
                value: 'evan',
                path: []
            }
        ]
    })
})
test('many transform', t => {
    const token = tokenizer('hello {{name}}, i am {{age}} years old.');
    const obj = {
        name: 'evan',
        age: 18
    }
    const ast = parse(token);
    const transAst = transform(ast, obj);
    t.deepEqual(transAst, {
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
                value: 'evan',
                path: []
            },
            {
                type: 'symbol',
                value: ','
            },
            {
                type: 'whitespace',
                value: ' '
            }, {
                type: 'string',
                value: 'i'
            }, {
                type: 'whitespace',
                value: ' '
            }, {
                type: 'string',
                value: 'am'
            }, {
                type: 'whitespace',
                value: ' '
            }, {
                type: 'expression',
                name: 'age',
                value: 18,
                path: []
            }, {
                type: 'whitespace',
                value: ' '
            }, {
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

test('wrong template', t => {
    const token = tokenizer('hello {{name}');
    const obj = {
        name: 'evan'
    }
    const ast = parse(token);
    const transAst = transform(ast, obj);
    t.deepEqual(transAst, {
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

test('wrong template with whitespace', t => {
    const token = tokenizer('hello { {name}}');
    const obj = {
        name: 'evan'
    }
    const ast = parse(token);
    const transAst = transform(ast, obj);
    t.deepEqual(transAst, {
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
                type: 'paren',
                value: '{'
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
                type: 'string',
                value: 'name'
            }, {
                type: 'paren',
                value: '}'
            }, {
                type: 'paren',
                value: '}'
            },
        ]
    })
})

test('form obj.property in  transform', t => {
    const token = tokenizer('hello {{basic.name}}');
    const obj = {
        basic: {
            name: 'evan'
        }
    }
    const ast = parse(token);
    const transAst = transform(ast, obj);
    t.deepEqual(transAst, {
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
                name: 'basic',
                value: 'evan',
                path: ['name']
            }
        ]
    })
})

test('no object but has template', t => {
    const token = tokenizer('hello {{basic.name}}');
    const obj = {
        basic: {
            age: 18
        }
    }
    const ast = parse(token);
    const transAst = transform(ast, obj);
    t.deepEqual(transAst, {
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
                name: 'basic',
                value: '',
                path: ['name']
            }
        ]
    })
})