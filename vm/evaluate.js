const es5 =require('./es5');

const visitors = {
  ...es5
}


module.exports= function evaluate(path){
  path.evaluate = evaluate;
  const _eval = visitors[path.node.type]
  return _eval(path);
}