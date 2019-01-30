const {
  tokenize,
  parse,
  run
} = require('./src/index');
const {
  runInContext,
  createContext
} = require('./vm/index');
const code = `
  console.log(123);
  `
const token = tokenize(code);
const ast = parse(token);
run.traverse(ast, {
  console
})

runInContext(code, createContext({}))