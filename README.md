# interpreter
学习js解释器相关知识

主要学习资源来自：
[https://github.com/axetroy/](https://github.com/axetroy/)


```
├─babel-transform-pre-calculate    #简单预计算插件
├─template      #模板引擎
├─src           #编写解释器的源码
├─jsonParser    #一个json解析器
├─simple-calculator    #一个简单计算器
├─test          #测试源码
```

#### src目录
编写简单js解析器代码


#### template目录
参考实现的简单模板引擎，暂时只支持{{name}}这样插值，不支持其他复杂逻辑

#### jsonParser目录
自己实现了JSON对象，包括parse和stringify方法

#### simple-calculator目录
自己实现的计算器，支持计算如下
```js
(+1) + (10 - 4) * 3 / 2 + (-1)
0.1 + 0.2
```

#### babel-transform-pre-calculate目录
一个预计算插件，学习自[babel-plugin-pre-calculate-number](https://github.com/axetroy/babel-plugin-pre-calculate-number)

#### 关于Big.js
js浮点数用`Big.js`处理，也有类似的`bignumber.js`
`Big.js`支持链式调用，所以计算后得到的还是Big对象，他的`valueOf`和`toString`方法都返回计算值字符串，所以只要在前面加`+`即可得到结果数值
```js
0.3 === +Big('0.1').plus('0.2')  //true
```