function transform(ast, obj = {}) {
    let body = ast.body;
    ast.body = body.map(token => {
        if (token.type === 'expression') {
            const originValue = obj[token.name] || '';
            const path = token.path
            if (path && path.length>0) {
                let result = originValue;
                for (var i = 0; i < path.length; i++) {
                    result = result[path[i]] || '';
                }
                token.value = result
            } else {
                token.value = originValue || ''
            }
        }
        return token
    })
    return ast
}

if(typeof module !== 'undefined'){
    module.exports = transform
}