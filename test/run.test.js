const test = require('ava').test;
const {
  tokenize
} = require('../src/tokenize');
const {
  parse
} = require('../src/parse');
const {
  NodeIterator
} = require('../src/run');


test('console.log()', t => {
  const token = tokenize('console.log(123)');
  const ast = parse(token);
  NodeIterator.traverse(ast, {
    console
  })

})