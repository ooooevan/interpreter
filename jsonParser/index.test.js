const test = require('ava').test;
const json = require('./index');

const BEGIN_OBJECT = 'BEGIN_OBJECT'
const END_OBJECT = 'END_OBJECT'
const BEGIN_ARRAY = 'BEGIN_ARRAY'
const END_ARRAY = 'END_ARRAY'
const NULL = 'NULL'
const NUMBER = 'NUMBER'  //必须是十进制
const STRING = 'STRING'
const BOOLEAN = 'BOOLEAN'
const SEP_COLON = 'SEP_COLON'    // 冒号
const SEP_COMMA = 'SEP_COMMA'    // 逗号
const END_DOCUMENT = 'END_DOCUMENT'

test('tokenizie basic object', t => {
    const str = '{"name":"evan"}'
    const tokens = json.tokenizie(str)
    t.deepEqual(tokens, [
        {
            type: BEGIN_OBJECT,
            value: '{'
        },{
            type: STRING,
            value: 'name'
        },{
            type: SEP_COLON,
            value: ':'
        },{
            type: STRING,
            value: 'evan'
        },{
            type: END_OBJECT,
            value: '}'
        }
    ])
})
test('tokenizie basic array', t => {
    const str = '[1,2]'
    const tokens = json.tokenizie(str)
    t.deepEqual(tokens, [
        {
            type: BEGIN_ARRAY,
            value: '['
        },{
            type: NUMBER,
            value: '1'
        },{
            type: SEP_COMMA,
            value: ','
        },{
            type: NUMBER,
            value: '2'
        },{
            type: END_ARRAY,
            value: ']'
        }
    ])
})

test('tokenizie object array', t => {
    const str = '[{"name": "evan"}]'
    const tokens = json.tokenizie(str)
    t.deepEqual(tokens, [
        {
            type: BEGIN_ARRAY,
            value: '['
        },{
            type: BEGIN_OBJECT,
            value: '{'
        },{
            type: STRING,
            value: 'name'
        },{
            type: SEP_COLON,
            value: ':'
        },{
            type: STRING,
            value: 'evan'
        },{
            type: END_OBJECT,
            value: '}'
        },{
            type: END_ARRAY,
            value: ']'
        }
    ])
})

test('tokenizie string', t => {
    const str = '"foo"'
    const tokens = json.tokenizie(str)
    t.deepEqual(tokens, [
        {
            type: STRING,
            value: 'foo'
        }
    ])
})
test('tokenizie object with unexpected number(this is wrong parse)', t => {
    const str = '{0:1}'
    const tokens = json.tokenizie(str)
    t.deepEqual(tokens, [
        {
            type: BEGIN_OBJECT,
            value: '{'
        },{
            type: NUMBER,
            value: '0'
        },{
            type: SEP_COLON,
            value: ':'
        },{
            type: NUMBER,
            value: '1'
        },{
            type: END_OBJECT,
            value: '}'
        }
    ])
})
test('tokenizie object in object', t => {
    const str = '{"a":{"a":1}}'
    const tokens = json.tokenizie(str)
    t.deepEqual(tokens, [
        {
            type: BEGIN_OBJECT,
            value: '{'
        },{
            type: STRING,
            value: 'a'
        },{
            type: SEP_COLON,
            value: ':'
        },{
            type: BEGIN_OBJECT,
            value: '{'
        },{
            type: STRING,
            value: 'a'
        },{
            type: SEP_COLON,
            value: ':'
        },{
            type: NUMBER,
            value: '1'
        },{
            type: END_OBJECT,
            value: '}'
        },{
            type: END_OBJECT,
            value: '}'
        }
    ])
})
test('parse basic object', t => {
    const str = '{"name":"evan"}'
    const tokens = json.tokenizie(str)
    const obj = json.parse(tokens);
    t.deepEqual(obj, {name:'evan'})
})
test('parse basic array', t => {
    const str = '[1,2,"a"]'
    const tokens = json.tokenizie(str)
    const obj = json.parse(tokens);
    t.deepEqual(obj, [1,2,'a'])
})

test('parse object array', t => {
    const str = '[1,2,{"name":"evan"}]'
    const tokens = json.tokenizie(str)
    const obj = json.parse(tokens);
    t.deepEqual(obj, [1,2,{name:'evan'}])
})

test('parse different basic type value', t => {
    const str = '[1, 5, "false", false, {}, [], null]'
    const tokens = json.tokenizie(str)
    const obj = json.parse(tokens);
    t.deepEqual(obj, [1,5,"false",false,{},[],null])
})
test('parse different basic iteral value', t => {
    const str1 = '{}'
    const str2 = 'true'
    const str3 = '"foo"'
    const str4 = '[1, 5, "false"]'
    const str5 = 'null'
    const tokens1 = json.tokenizie(str1)
    const tokens2 = json.tokenizie(str2)
    const tokens3 = json.tokenizie(str3)
    const tokens4 = json.tokenizie(str4)
    const tokens5 = json.tokenizie(str5)
    const obj1 = json.parse(tokens1);
    const obj2 = json.parse(tokens2);
    const obj3 = json.parse(tokens3);
    const obj4 = json.parse(tokens4);
    const obj5 = json.parse(tokens5);
    t.deepEqual(obj1, {})
    t.deepEqual(obj2, true)
    t.deepEqual(obj3, 'foo')
    t.deepEqual(obj4, [1,5,'false'])
    t.deepEqual(obj5, )
})
test('parse different number value', t => {
    const str = '[1, 0, 0.1, 0.90]'
    const tokens = json.tokenizie(str)
    const obj = json.parse(tokens);
    t.deepEqual(obj, [1,0,0.1,0.90])
})
