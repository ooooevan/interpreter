exports.ErrNotDefined = function (varName) {
  return new ReferenceError(`${varName} is not defined`);
}

exports.ErrImplement = function (varName) {
  return new SyntaxError(`Not implement for '${varName}' syntax`);
}

exports.ErrDuplicateDeclard = function (varName) {
  return new SyntaxError(`Identifier '${varName}' has already been declared`);
}

exports.ErrIsNot = function (name, type) {
  return new TypeError(`${name} is not ${type}`);
}

exports.ErrInvalidIterable = function (name) {
  return ErrIsNot(name, "iterable");
}

exports.ErrNoSuper = function () {
  return new ReferenceError(
    `Must call super constructor in derived class before accessing 'this' or returning from derived constructor`
  );
}

exports.ErrIsNotFunction = function (name) {
  return new TypeError(`${name} is not a function`);
}

exports.ErrCanNotReadProperty = function (
  property,
  target
) {
  return new TypeError(`Cannot read property '${property}' of ${target}`);
}


// 
function is(node, type) {
  return node.type === type;
}
exports.isFunction = function (fn) {
  return toString.call(fn) === '[object Function]';
}
exports.isStringLiteral = function isStringLiteral(node) {
  return is(node, "StringLiteral");
}

exports.isArrayExpression = function isArrayExpression(node) {
  return is(node, "ArrayExpression");
}

exports.isObjectExpression = function isObjectExpression(node) {
  return is(node, "ObjectExpression");
}

exports.isFunctionDeclaration = function isFunctionDeclaration(node) {
  return is(node, "FunctionDeclaration");
}

exports.isVariableDeclaration = function isVariableDeclaration(node) {
  return is(node, "VariableDeclaration");
}

exports.isIdentifier = function isIdentifier(node) {
  return is(node, "Identifier");
}

exports.isObjectPattern = function isObjectPattern(node) {
  return is(node, "ObjectPattern");
}

exports.isObjectProperty = function isObjectProperty(node) {
  return is(node, "ObjectProperty");
}

exports.isArrayPattern = function isArrayPattern(node) {
  return is(node, "ArrayPattern");
}

exports.isMemberExpression = function isMemberExpression(node) {
  return is(node, "MemberExpression");
}

exports.isSpreadElement = function isSpreadElement(node) {
  return is(node, "SpreadElement");
}

exports.isAssignmentPattern = function isAssignmentPattern(node) {
  return is(node, "AssignmentPattern");
}

exports.isRestElement = function isRestElement(node) {
  return is(node, "RestElement");
}

exports.isClassMethod = function isClassMethod(node) {
  return is(node, "ClassMethod");
}

exports.isClassProperty = function isClassProperty(node) {
  return is(node, "ClassProperty");
}

exports.isCallExpression = function isCallExpression(node) {
  return is(node, "CallExpression");
}

exports.isImportDefaultSpecifier = function isImportDefaultSpecifier(
  node
) {
  return is(node, "ImportDefaultSpecifier");
}

exports.isImportSpecifier = function isImportSpecifier(node) {
  return is(node, "ImportSpecifier");
}