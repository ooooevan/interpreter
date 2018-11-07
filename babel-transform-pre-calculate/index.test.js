const test = require('ava').test;
const preCal = require('./index.js');

/**
 * babel会添加结尾分号，去掉无用括号等
 */


test('basic binaryExpression with two isNumericLiteral', t => {
    const str = 'var a = 1 + 2;';
    const resultStr = preCal(str);
    t.is(resultStr, 'var a = 3;')
})

test("basic binaryExpression with three isNumericLiteral", t => {
    const str = 'const day = 3600 * 1000 * 24;';
    const resultStr = preCal(str);
    t.is(resultStr, 'const day = 86400000;')
});
test("MemberExpression: Math.PI * 2 and Math['PI'] * 2", t => {
    const str1 = 'var s = Math.PI * 2;';
    const str2 = 'var s = Math["PI"] * 2;';
    const str3 = 'var s = Math.E * 2;';
    const resultStr1 = preCal(str1);
    const resultStr2 = preCal(str2);
    const resultStr3 = preCal(str3);
    t.is(resultStr1, 'var s = 6.283185307179586;')
    t.is(resultStr2, 'var s = 6.283185307179586;')
    t.is(resultStr3, 'var s = 5.43656365691809;')
});

test("callExpression: Math.pow(2 * 2) and Math['pow'](2 * 2) and Math.min()", t => {
    const str1 = 'var s = Math.pow(2 , 2);';
    const str2 = 'var s = Math["pow"](2, 2);';
    const str3 = 'var s = Math.min(4, 5, 11, 22);';
    const resultStr1 = preCal(str1);
    const resultStr2 = preCal(str2);
    const resultStr3 = preCal(str3);
    t.is(resultStr1, 'var s = 4;')
    t.is(resultStr2, 'var s = 4;')
    t.is(resultStr3, 'var s = 4;')
});
test("UnaryExpression: ~ -", t => {
    const str1 = 'var s = ~5;';
    const str2 = 'var s = 3 + (-5);';
    const resultStr1 = preCal(str1);
    const resultStr2 = preCal(str2);
    t.is(resultStr1, 'var s = -6;')
    t.is(resultStr2, 'var s = -2;')
});

test("test: >> >>> << & ^  ...", t => {
    const str1 = 'var s = 1 >> 1;';
    const str2 = 'var s = 4 >>> 2;';
    const str3 = 'var s = 2 << 3;';
    const str4 = 'var s = 2 & 4;';
    const str5 = 'var s = 1 ^ 3;';
    const str6 = 'var s = 3|5;';
    const resultStr1 = preCal(str1);
    const resultStr2 = preCal(str2);
    const resultStr3 = preCal(str3);
    const resultStr4 = preCal(str4);
    const resultStr5 = preCal(str5);
    const resultStr6 = preCal(str6);
    t.is(resultStr1, 'var s = 0;')
    t.is(resultStr2, 'var s = 1;')
    t.is(resultStr3, 'var s = 16;')
    t.is(resultStr4, 'var s = 0;')
    t.is(resultStr6, 'var s = 7;')
});

test("test: * / % ** ", t => {
    const str1 = 'var s = 2 * 3 * 4;';
    const str2 = 'var s = 8 / 4 / 2;';
    const str3 = 'var s = 8 % 3;';
    const str4 = 'var s = 10 % 3 % 2;';
    const str5 = 'var s = 2 ** 2 ** 3;';
    const resultStr1 = preCal(str1);
    const resultStr2 = preCal(str2);
    const resultStr3 = preCal(str3);
    const resultStr4 = preCal(str4);
    const resultStr5 = preCal(str5);
    t.is(resultStr1, 'var s = 24;')
    t.is(resultStr2, 'var s = 1;')
    t.is(resultStr3, 'var s = 2;')
    t.is(resultStr4, 'var s = 1;')
    t.is(resultStr5, 'var s = 256;')
});

test("test: 0.1 + 0.2 ", t => {
    const str1 = 'var s = 1 + 2;';
    const str2 = 'var s = 0.1 + 0.2;';
    const resultStr1 = preCal(str1);
    const resultStr2 = preCal(str2);
    t.is(resultStr1, 'var s = 3;')
    t.is(resultStr2, 'var s = 0.3;')
});

test('test: complex', t => {
    const str1 = 'var s = 1 + 2 - 3;';
    const str2 = 'var s = (100 / 2) + 50;';
    const str3 = 'var s = (((100 / 2) + 50 * 2) / 50) ** 2;';
    const str4 = 'var s = (((100 / 2) + 50 * 2) / 50) ** 2 * Math.PI;';
    const str5 = 'var s = +5 + ~(-3);';
    const str6 = 'var s = ~(5 ^ 3) * 6;';

    const resultStr1 = preCal(str1);
    const resultStr2 = preCal(str2);
    const resultStr3 = preCal(str3);
    const resultStr4 = preCal(str4);
    const resultStr5 = preCal(str5);
    const resultStr6 = preCal(str6);

    t.is(resultStr1, 'var s = 0;')
    t.is(resultStr2, 'var s = 100;')
    t.is(resultStr3, 'var s = 9;')
    t.is(resultStr4, 'var s = 28.274333882308138;')
    t.is(resultStr5, 'var s = 7;')
    t.is(resultStr6, 'var s = -42;')
})