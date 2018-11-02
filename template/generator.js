
function generator(ast){
    const body = ast.body;
    const list = body.map(item => {
        return item.value
    })
    return list.join('')
}
if(typeof module !== 'undefined'){
    module.exports = generator
}