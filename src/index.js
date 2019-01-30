const {
    tokenize
} = require('./tokenize');
const {
    parse
} = require('./parse');
const {
    NodeIterator
} = require('./run');

module.exports = {
    tokenize,
    parse,
    run: NodeIterator
}