// Path是node、ctx、stack等合并成的一个对象，没有什么特殊作用
module.exports = class Path {
  constructor(node, parent, scope, ctx, stack) {
    this.node = node;
    this.parent = parent;
    this.scope = scope;
    this.ctx = ctx;
    this.stack = stack;
  }
  createChild(node, scope, ctx) {
    const path = new Path(node,
      this,
      scope
        ? typeof scope === "number"
          ? this.scope.createChild(scope)
          : scope
        : this.scope,
      { ...this.ctx, ...ctx },
      this.stack);
    path.evaluate = this.evaluate;
    path.preset = this.preset;
    return path;
  }

  findParent(type) {
    return this.parent ? this.parent.node.type === type ? this.parent : this.parent.findParent(type) : null;
  }
}