// const recast = require("recast");
const MyInter = require('./src/index');

const code = `
  function square(a) {
    console.log(a);
  }
  square()
  `

const tokens = MyInter.tokenize(code);
const ast = MyInter.parse(tokens);
const run = MyInter.run(ast, {console});

// const ast = recast.parse(code);
// console.log(JSON.stringify(ast.program.body, undefined, 2))
// console.log( recast.prettyPrint(ast, { tabWidth: 2 }).code)