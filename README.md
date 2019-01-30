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

### src目录
编写简单js解析器代码，这里只有三个简单功能: 分词、语法分析、运行，能够跑最简单的代码如`console.log(123)`，

### vm目录
一个较完整的简单解析器，照着大佬代码学习的。[https://github.com/axetroy/vm.js](https://github.com/axetroy/vm.js)


### template目录
参考实现的简单模板引擎，暂时只支持{{info.name}}这样插值，不支持其他复杂逻辑

### jsonParser目录
实现了JSON对象，包含parse和stringify方法

### simple-calculator目录
简单计算器，支持计算如下
```js
(+1) + (10 - 4) * 3 / 2 + (-1)
0.1 + 0.2
```

### babel-transform-pre-calculate目录
一个预计算插件，学习自[babel-plugin-pre-calculate-number](https://github.com/axetroy/babel-plugin-pre-calculate-number)

### 关于Big.js
js浮点数用`Big.js`处理，也有类似的`bignumber.js`
`Big.js`支持链式调用，所以计算后得到的还是Big对象，他的`valueOf`和`toString`方法都返回计算值字符串，所以只要在前面加`+`即可得到结果数值
[https://github.com/camsong/blog/issues/9](https://github.com/camsong/blog/issues/9)
```js
0.3 === +Big('0.1').plus('0.2')  //true
```

## 笔记

这里主要学习编译原理相关知识，用js语言写的解释器能运行特定代码。
学习到了解析器中的分词，语法分析，写出了对应的`tokenize`,`parse`,能将代码转换成`ast`。这对于编译原理，还只是开始，后面还有`语义分析`,`中间代码生成`,`错误处理`等等，我本来想着慢慢实现一个完整的解析器，但在写`parser`时，发现这个很复杂且难度很大，每增加支持一种情况，就要改变现有逻辑或需要重写以支持多种不同情况。再然后，我发现自己写parser是一个费力不讨好的事情，情况太多，以目前的技术水平一个人写肯定漏洞百出，再者现有的parser也很多可以直接用，即使要做特定的`ast`也可以用现有的parser生成的`ast`进行改造。后面如何把`ast`转成代码执行起来更重要。
编译原理设计的知识点、算法非常多，如Thompson算法、子集构造法、Hopcroft最小化算法、推导归约等。这里只是实现一个最简单的解析器，没有涉及到什么算法。
几个其他的小工具`jsonParer`,`template`,`simple-calcula`等主要用分词、语法分析完成，相对较简单


参考：
[https://github.com/axetroy](https://github.com/axetroy)
[编译原理学习导论-作者四川大学唐良（转）初学者必看](https://www.cnblogs.com/teng-xia/p/5374144.html)
[对 Parser 的误解](http://www.yinwang.org/blog-cn/2015/09/19/parser)