const test = require('ava').test;
const preCal = require('./index.js');

/**
 * babel会添加结尾分号，去掉无用括号等
 */


test('basic calculate', t => {
    const str = 'var a = 1 + 2;';
    const resultStr = preCal(str);
    t.is(resultStr, 'var a = 3;')
})

test('memberexpression calculate', t => {
    const str = 'var a = Math.PI * (2*2);';
    const resultStr = preCal(str);
    t.is(resultStr, 'var a = Math.PI * 4;')
})