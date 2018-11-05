
/**
 * 
 * JSON:
  复合类型的值只能是数组或对象，不能是函数、正则表达式对象、日期对象。
  原始类型的值只有四种：字符串、数值（必须以十进制表示）、布尔值和null（不能使用NaN, Infinity, -Infinity和undefined）。
  字符串必须使用双引号表示，不能使用单引号。
  对象的键名必须放在双引号里面。
  数组或对象最后一个成员的后面，不能加逗号。

  JSON.parse:
  JSON.parse('{}') // {}
  JSON.parse('true') // true
  JSON.parse('"foo"') // "foo"
  JSON.parse('[1, 5, "false"]') // [1, 5, "false"]
  JSON.parse('null') // null


 */

const BEGIN_OBJECT = 'BEGIN_OBJECT'
const END_OBJECT = 'END_OBJECT'
const BEGIN_ARRAY = 'BEGIN_ARRAY'
const END_ARRAY = 'END_ARRAY'
const NULL = 'NULL'
const NUMBER = 'NUMBER'  //必须是十进制
const STRING = 'STRING'
const BOOLEAN = 'BOOLEAN'
const SEP_COLON = 'SEP_COLON' // 冒号
const SEP_COMMA = 'SEP_COMMA' // 逗号
const END_DOCUMENT = 'END_DOCUMENT'


function tokenCreator(type, value, start, end) {
  return {
    type,
    value,
    // start,
    // end
  }
}

function tokenizie(str) {
  const tokens = [];
  for (let i = 0; i < str.length; i++) {
    let currentChar = str[i];
    let tempStr;
    let index;
    switch (currentChar) {
      case '{':
        tokens.push(tokenCreator(BEGIN_OBJECT, currentChar));
        continue;
      case '}':
        tokens.push(tokenCreator(END_OBJECT, currentChar));
        continue;
      case '[':
        tokens.push(tokenCreator(BEGIN_ARRAY, currentChar));
        continue;
      case ']':
        tokens.push(tokenCreator(END_ARRAY, currentChar));
        continue;
      case '"':
        tempStr = ''
        i++;
        while (str[i] !== '"') {
          currentChar = str[i];
          if (!currentChar) {
            throw new Error('Unexpected end of JSON input');
          }
          tempStr += currentChar;
          i++
        }
        tokens.push(tokenCreator(STRING, tempStr));
        continue;
      case 'n':
        tempStr = currentChar
        i++;
        index = 1;
        const _NULL = 'null';
        while (str[i] && _NULL[index] && str[i] === _NULL[index]) {
          tempStr += str[i]
          index++;
          i++;
        }
        i--;
        tokens.push(tokenCreator(NULL, tempStr));
        continue;
      case 'f':
        tempStr = currentChar
        i++;
        index = 1;
        const _FALSE = 'false';
        while (str[i] && _FALSE[index] && str[i] === _FALSE[index]) {
          tempStr += str[i]
          index++;
          i++;
        }
        i--;
        tokens.push(tokenCreator(BOOLEAN, tempStr));
        continue;
      case 't':
        tempStr = currentChar
        i++;
        index = 1;
        const _TRUE = 'true';
        while (str[i] && _TRUE[index] && str[i] === _TRUE[index]) {
          tempStr += str[i]
          index++;
          i++;
        }
        i--;
        tokens.push(tokenCreator(BOOLEAN, tempStr));
        continue;
      case ',':
        tokens.push(tokenCreator(SEP_COMMA, currentChar));
        continue;
      case ':':
        tokens.push(tokenCreator(SEP_COLON, currentChar));
        continue;
      default:
        if (/\s/.test(currentChar)) {
          continue;
        }
        if (/[0-9-.]/.test(currentChar)) {
          tempStr = currentChar
          i++;
          while (/[0-9.]/.test(str[i])) {
            // 不能使用零开头的数字
            if(tempStr === '0' && (str[i] !== '.')){
              throw new Error('Unexpected token ' + currentChar + ' in JSON at position ' + i)
            }
            tempStr += str[i];
            i++;
          }
          i--;
          tokens.push(tokenCreator(NUMBER, tempStr));
          continue;
        }
        throw new Error('Unexpected token ' + currentChar + ' in JSON at position ' + i)
    }
  }
  return tokens;
}

function parse(tokens) {
  let token;
  let i = 0;
  for (; i < tokens.length; i++) {
    token = tokens[i];
    switch(token.type){
      case BEGIN_OBJECT:
        return parseObject()
      case BEGIN_ARRAY:
        return parseArray()
      case NUMBER:
        return +tokens.value
      case NULL:
        return;
      case STRING:
        return token.value
      case BOOLEAN:
        return token.value === 'false' ? false : true;
      default:
        throw new Error('Unexpected token ' + token.value + ' in JSON at position ' + i);
    }
  }

  function parseObject() {
    let object = {}
    let key;
    do {
      token = tokens[++i];
      if(token.type === END_OBJECT){
        return object;
      }
      // key必须是string
      if (token.type !== STRING) {
        throw new Error('Unexpected token ' + token.value + ' in JSON at position ' + i);
      }
      key = token.value
      token = tokens[++i];
      // key后面是冒号
      if (token.type !== SEP_COLON) {
        throw new Error('Unexpected token ' + token.value + ' in JSON at position ' + i);
      }
      token = tokens[++i];
      // 嵌套对象
      if (token.type === BEGIN_OBJECT) {
        object[key] = parseObject();
        // 嵌套数组
      } else if (token.type === BEGIN_ARRAY) {
        object[key] = parseArray();
      } else {
        // 其他值类型范围
        if (token.type !== NULL && token.type !== NUMBER && token.type !== STRING && token.type !== BOOLEAN) {
          throw new Error('Unexpected token ' + token.value + ' in JSON at position ' + i);
        }
        object[key] = token.value
      }
    } while (tokens[i + 1] && tokens[++i].type === SEP_COMMA)
    token = tokens[i];
    if (token.type !== END_OBJECT) {
      throw new Error('Unexpected token ' + token.value + ' in JSON at position ' + i);
    }
    return object;
  }

  function parseArray() {
    let array = [];
    do{
      token = tokens[++i];
      switch(token.type){
        case END_ARRAY:
          return array;
        case BEGIN_OBJECT:
          array.push(parseObject())
          continue;
        case BEGIN_ARRAY:
          array.push(parseArray())
          continue;
        case NUMBER:
          array.push(+token.value);
          continue
        case NULL:
          array.push(null);
          continue;
        case BOOLEAN:
          array.push(token.value === 'false' ? false:true);
          continue;
        case STRING:
          array.push(token.value);
          continue
        default:
          throw new Error('Unexpected token ' + token.value + ' in JSON at position ' + i);
      }
    }while(tokens[i+1] && tokens[++i].type === SEP_COMMA)
    token = tokens[i];
    if (token.type !== END_ARRAY) {
      throw new Error('Unexpected token ' + token.value + ' in JSON at position ' + i);
    }
    return array;
  }
}

function stringify(obj){
  if(/Undefined|Function/.test(toString.call())){
    // 无返回
    return;
  }
  const type = toString.call(obj);
  if(/Boolean|Null/.test(type)){
    return obj + '';
  }
  if(/Number/.test(type)){
    // 注意NaN
    if(obj !== obj) return 'null';
    return obj + '';
  }
  if(/String/.test(type)){
    // 字符串加上双引号
    return '\"' + obj + '\"';
  }
  if(/Object|Array/.test(type)){
    if(/Object/.test(type)){
      // 是一个对象

    }else{
      // 是一个数组
      
    }
  }else{
    // 其他类型都返回空对象字符串，如RegExp、ArrayBuffer等
    return '{}';
  }
}

const json = {
  tokenizie: function (str) {
    return tokenizie(str)
  },
  parse: function (tokens) {
    return parse(tokens)
  },
  stringify: function (obj) {
    return stringify(obj)
  }
}

if (module) {
  module.exports = json
}