var fs = require("fs"),
    assert = require("assert"),
    parser = require("./jsonlint").parser;

// exports["object"] = function () {
    var json = '{"foo": "bar"}';
    assert.deepEqual(parser.parse(json), {"foo": "bar"});
// };

// exports["escaped backslash"] = function () {
    var json = '{"foo": "\\\\"}';
    assert.deepEqual(parser.parse(json), {"foo": "\\"});
// };

// exports["escaped chars"] = function () {
    var json = '{"foo": "\\\\\\\""}';
    assert.deepEqual(parser.parse(json), {"foo": '\\\"'});
// };

// exports["escaped \\n"] = function () {
    var json = '{"foo": "\\\\\\n"}';
    assert.deepEqual(parser.parse(json), {"foo": '\\\n'});
// };

// exports["string with escaped line break"] = function () {
    var json = '{"foo": "bar\\nbar"}';
    assert.deepEqual(parser.parse(json), {"foo": "bar\nbar"});
    assert.equal(JSON.stringify(parser.parse(json)).length, 18);
// };

// exports["string with line break"] = function () {
    var json = '{"foo": "bar\nbar"}';
    assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["string literal"] = function () {
    var json = '"foo"';
    assert.equal(parser.parse(json), "foo");
// };

// exports["number literal"] = function () {
    var json = '1234';
    assert.equal(parser.parse(json), 1234);
// };

// exports["null literal"] = function () {
    var json = '1234';
    assert.equal(parser.parse(json), 1234);
// };

// exports["boolean literal"] = function () {
    var json = 'true';
    assert.equal(parser.parse(json), true);
// };

// exports["unclosed array"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/2.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["unquotedkey keys must be quoted"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/3.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["extra comma"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/4.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["double extra comma"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/5.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["missing value"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/6.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["comma after the close"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/7.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["extra close"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/8.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["extra comma after value"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/9.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["extra value after close with misplaced quotes"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/10.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["illegal expression addition"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/11.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["illegal invocation of alert"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/12.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["numbers cannot have leading zeroes"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/13.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["numbers cannot be hex"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/14.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["illegal backslash escape \\0"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/15.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["unquoted text"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/16.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["illegal backslash escape \\x"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/17.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["missing colon"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/19.json")
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["double colon"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/20.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["comma instead of colon"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/21.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["colon instead of comma"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/22.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["bad raw value"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/23.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["single quotes"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/24.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["tab character in string"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/25.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["tab character in string 2"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/26.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["line break in string"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/27.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["line break in string in array"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/28.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["0e"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/29.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["0e+"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/30.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["0e+ 1"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/31.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["comma instead of closing brace"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/32.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// };

// exports["bracket mismatch"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/33.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// }

// exports["extra brace"] = function () {
//   var json = fs.readFileSync(__dirname + "/fails/34.json").toString();
//   assert["throws"](function () {parser.parse(json)}, "should throw error");
// }

// exports["pass-1"] = function () {
//   var json = fs.readFileSync(__dirname + "/passes/1.json").toString();
//   assert.doesNotThrow(function () {parser.parse(json)}, "should pass");
// }

// exports["pass-2"] = function () {
//   var json = fs.readFileSync(__dirname + "/passes/2.json").toString();
//   assert.doesNotThrow(function () {parser.parse(json)}, "should pass");
// }

// exports["pass-3"] = function () {
//   var json = fs.readFileSync(__dirname + "/passes/3.json").toString();
//   assert.doesNotThrow(function () {parser.parse(json)}, "should pass");
// }

// if (require.main === module)
//     require("test").run(exports);

var json = '{"foo": "bar"}';
parser.parse(json)