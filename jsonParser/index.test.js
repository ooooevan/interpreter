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
    const tokens = json._tokenizie(str)
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
    const tokens = json._tokenizie(str)
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
    const tokens = json._tokenizie(str)
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
    const tokens = json._tokenizie(str)
    t.deepEqual(tokens, [
        {
            type: STRING,
            value: 'foo'
        }
    ])
})
test('tokenizie object with unexpected number(this is wrong parse)', t => {
    const str = '{0:1}'
    const tokens = json._tokenizie(str)
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
    const tokens = json._tokenizie(str)
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
    const obj = json.parse(str);
    t.deepEqual(obj, {name:'evan'})
})
test('parse basic array', t => {
    const str = '[1,2,"a"]'
    const obj = json.parse(str);
    t.deepEqual(obj, [1,2,'a'])
})

test('parse object array', t => {
    const str = '[1,2,{"name":"evan"}]'
    const obj = json.parse(str);
    t.deepEqual(obj, [1,2,{name:'evan'}])
})

test('parse different basic type value', t => {
    const str = '[1, 5, "false", false, {}, [], null]'
    const obj = json.parse(str);
    t.deepEqual(obj, [1,5,"false",false,{},[],null])
})
test('parse different basic iteral value', t => {
    const str1 = '{}'
    const str2 = 'true'
    const str3 = '"foo"'
    const str4 = '[1, 5, "false"]'
    const str5 = 'null'
    const obj1 = json.parse(str1);
    const obj2 = json.parse(str2);
    const obj3 = json.parse(str3);
    const obj4 = json.parse(str4);
    const obj5 = json.parse(str5);
    t.deepEqual(obj1, {})
    t.deepEqual(obj2, true)
    t.deepEqual(obj3, 'foo')
    t.deepEqual(obj4, [1,5,'false'])
    t.deepEqual(obj5, )
})
test('parse different number value', t => {
    const str = '[1, 0, 0.1, 0.90]'
    const obj = json.parse(str);
    t.deepEqual(obj, [1,0,0.1,0.90])
})

test('stringify basic object', t=>{
    const obj = {name:'evan'};
    const str = json.stringify(obj);
    t.is(str, '{"name":"evan"}')
})
test('stringify basic array', t=>{
    const obj = [1,2,'3'];
    const str = json.stringify(obj);
    t.is(str, '[1,2,"3"]')
})
test('stringify different type', t=>{
    const obj = [1,'2', null, undefined, /a/,{name:'evan',age:18},{foo:function(){}},function(){}];
    const str = json.stringify(obj);
    t.is(str, '[1,"2",null,null,{},{"name":"evan","age":18},{},null]')
})
test('stringify filter array', t=>{
    const obj = {name:'evan',age:'18',like:'ba',nolike:'ab',0:0};
    const str = json.stringify(obj,['name','age','0']);
    t.is(str, '{"0":0,"name":"evan","age":"18"}')
})
test('stringify filter Function 1', t=>{
    const obj = [3,6,{age:18}];
    function f(key, value){
        if(typeof value === 'number'){
            return value * 2
        }
        return value
    }
    const str = json.stringify(obj,f);
    t.is(str, '[6,12,{"age":36}]')
})
test('stringify filter Function 2', t=>{
    const o = {a: 1};
    function f(key, value) {
    if (typeof value === 'object') {
        return {b: 2};
    }
    return value * 2;
    }
    const str = json.stringify(o, f)
    t.is(str, '{"b":4}')
})
test('stringify filter Function 3', t=>{
    let obj = { a: "abc", b: 123 }
    function f(key, value) {
    if (typeof(value) === "string") {
        return undefined;
    }
    return value;
    }
    const str = json.stringify(obj, f)
    t.is(str, '{"b":123}')
})
test('stringify basic object format number', t=>{
    let obj = { name: 'evan' }
    const str = json.stringify(obj, undefined, 2)
    t.is(str, '{\n  "name":"evan"\n}')
})
test('stringify basic array format number', t=>{
    let obj = [1,2,3]
    const str = json.stringify(obj, undefined, 2)
    t.is(str, '[\n  1,\n  2,\n  3\n]')
})
test('stringify object array format number', t=>{
    let obj = [1,{name:'evan'}]
    const str = json.stringify(obj, undefined, 2)
    t.is(str, '[\n  1,\n  {\n    "name":"evan"\n  }\n]')
})
test('stringify basic object format string', t=>{
    let obj = { name: 'evan' }
    const str = json.stringify(obj, undefined, '|-')
    t.is(str, '{\n|-"name":"evan"\n}')
})
test('stringify object object format string', t=>{
    let obj = {name:'evan',address:{city:'sz',country:'china'}}
    const str = json.stringify(obj, undefined, '|-')
    t.is(str, '{\n|-"name":"evan",\n|-"address":{\n|-|-"city":"sz",\n|-|-"country":"china"\n|-}\n}')
})
test('stringify object object object format', t=>{
    let obj = {address:{country:{a:{b:'c'}}}}
    const str = json.stringify(obj, undefined, '|-')
    t.is(str, '{\n|-"address":{\n|-|-"country":{\n|-|-|-"a":{\n|-|-|-|-"b":"c"\n|-|-|-}\n|-|-}\n|-}\n}')
})
test('stringify basic object with toJSON return literal', t=>{
    let obj = { name: 'evan' ,toJSON: function(){return 'haha'}}
    const str = json.stringify(obj)
    t.is(str, '"haha"')
})
test('stringify basic object with toJSON return object', t=>{
    let obj = { name: 'evan' ,toJSON: function(){return {say:'haha'}}}
    const str = json.stringify(obj)
    t.is(str, '{"say":"haha"}')
})
