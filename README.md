# westore - 小程序 setData 解决方案

> 为简化和提速 setData 而设计

##  背景

### setData

setData 是小程序开发中使用最频繁的接口，也是最容易引发性能问题的接口。在介绍常见的错误用法前，先简单介绍一下 setData 背后的工作原理。setData 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 this.data 的值（同步）。

```js
this.setData({
  'array[0].text':'changed data'
})
```

### 工作原理

小程序的视图层目前使用 WebView 作为渲染载体，而逻辑层是由独立的 JavascriptCore 作为运行环境。在架构上，WebView 和 JavascriptCore 都是独立的模块，并不具备数据直接共享的通道。当前，视图层和逻辑层的数据传输，实际上通过两边提供的 evaluateJavascript 所实现。即用户传输的数据，需要将其转换为字符串形式传递，同时把转换后的数据内容拼接成一份 JS 脚本，再通过执行 JS 脚本的形式传递到两边独立环境。

而 evaluateJavascript 的执行会受很多方面的影响，数据到达视图层并不是实时的。

### 常见的 setData 操作错误

* 频繁的去 setData
* 每次 setData 都传递大量新数据
* 后台态页面进行 setData


### 总结下小程序的痛点

* 使用 this.data 可以获取内部数据和属性值，但不要直接修改它们，应使用 setData 修改
* setData 编程体验不好，很多场景直接赋值更加直观方便
* setData 卡卡卡慢慢慢，JsCore 和 Webview 数据对象来回传浪费计算资源和内存资源
* 组件间通讯或跨页通讯会把程序搞得乱七八糟，变得极难维护和扩展



## 特性

* 超小的代码尺寸(包括 json diff 共100多行)
* 提升 setData 编程体验，赋值 > diff > setData 的编程体验更好




所以没使用 westore 的时候经常可以看到这样的代码:

![not-westore](./asset/not-westore.png)

使用完 westore 之后:

![westore](./asset/westore2.png)

上面两种方式也可以混合使用。

可以看到，westore 不仅支持直接赋值，而且 this.update 兼容了 this.setData 的语法，但性能大大优于 this.setData，再举个例子：

``` js
this.store.data.motto = 'Hello Westore'
this.store.data.b.arr.push({ name: 'ccc' })
this.update()
```

等同于

``` js
this.update({
  motto:'Hello Westore',
  [`b.arr[${this.store.data.b.arr.length}]`]:{name:'ccc'}
})
```

和小程序的setData不同的是回调的方式，小程序的回调为setData的第二个入参，但是update则直接返回一个Promise，并且返回的数据内有更新的数据内容。例如：

``` js
this.setData({
  motto: 'Hello Westore'
}, () => {
  console.log('the motto has been set')
})
```

被改进为

``` js
this.store.data.mottto = 'Hello Westore'
this.update().then(diff => {
  console.log('the motto has been set', diff)
})
```

这里需要特别强调，虽然 this.update 可以兼容小程序的 this.setData 的方式传参，但是更加智能，this.update 会先 Diff 然后 setData。原理:

![](./asset/update2.jpg)

### setData 和 update 对比

拿官方模板示例的 log 页面作为例子:

```js
this.setData({
  logs: (wx.getStorageSync('logs') || []).map(log => {
    return util.formatTime(new Date(log))
  })
}, () => {
  console.log('setData完成了')
})
```

使用 westore 后:

``` js
this.store.data.logs = (wx.getStorageSync('logs') || []).map(log => {
  return util.formatTime(new Date(log))
})
this.update().then(diff => {
  console.log('setData完成了')
  console.log('更新内容为', diff)
})
```

看似一条语句变成了两条语句，但是 this.update 调用的 setData 是 diff 后的，所以传递的数据更少。


### JSON Diff

先看一下我为 westore 专门定制开发的 [JSON Diff 库](https://github.com/dntzhang/westore/blob/master/packages/westore/utils/diff.js) 的能力:

``` js
diff({
    a: 1, b: 2, c: "str", d: { e: [2, { a: 4 }, 5] }, f: true, h: [1], g: { a: [1, 2], j: 111 }
}, {
    a: [], b: "aa", c: 3, d: { e: [3, { a: 3 }] }, f: false, h: [1, 2], g: { a: [1, 1, 1], i: "delete" }, k: 'del'
})
```

Diff 的结果是:

``` js
{ "a": 1, "b": 2, "c": "str", "d.e[0]": 2, "d.e[1].a": 4, "d.e[2]": 5, "f": true, "h": [1], "g.a": [1, 2], "g.j": 111, "g.i": null, "k": null }
```

![diff](./asset/diff.jpg)

Diff 原理:

* 同步所有 key 到当前 store.data
* 携带 path 和 result 递归遍历对比所有 key value

``` js
export default function diff(current, pre) {
    const result = {}
    syncKeys(current, pre)
    _diff(current, pre, '', result)
    return result
}
```

同步上一轮 state.data 的 key 主要是为了检测 array 中删除的元素或者 obj 中删除的 key。



## License

MIT [@dntzhang](https://github.com/dntzhang)
