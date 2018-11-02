const tokenizer = require('./tokenizer.js');
const parse = require('./parse.js');
const transform = require('./transform.js');
const generator = require('./generator.js');

/**
 * 模板引擎，仅支持{{name}}、{{address.city}}模板，不支持代码等其他形式
 * 学习自：https://github.com/axetroy/pag
 */
const str = `我是{{name.a}}, who are you?`
const tokens = tokenizer(str)
const item = {
    name: {
        a: 'evan'
    }
}
let ast = parse(tokens)
ast = transform(ast,item)
const resultStr = generator(ast);
console.log(resultStr)