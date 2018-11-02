const test = require('ava').test;
const tokenizer = require('../tokenizer.js');
const parse = require('../parse.js');
const transform = require('../transform.js');
const generator = require('../generator.js');

test('basic generator', t => {
    const token = tokenizer('hello {{name}}');
    const obj = {
        name: 'evan'
    }
    const ast = parse(token);
    const transAst = transform(ast, obj);
    const resultStr = generator(transAst);
    t.is(resultStr, 'hello evan');
})
test('many transform', t => {
    const token = tokenizer('hello {{name}}, i am {{age}} years old.');
    const obj = {
        name: 'evan',
        age: 18
    }
    const ast = parse(token);
    const transAst = transform(ast, obj);
    const resultStr = generator(transAst);
    t.is(resultStr, 'hello evan, i am 18 years old.');
})
test('wrong template', t => {
    const token = tokenizer('hello {{name}');
    const obj = {
        name: 'evan'
    }
    const ast = parse(token);
    const transAst = transform(ast, obj);
    const resultStr = generator(transAst);
    t.is(resultStr, 'hello {{name}');
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
    const resultStr = generator(transAst);
    t.is(resultStr, 'hello evan');
})