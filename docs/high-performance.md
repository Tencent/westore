# Westore 小程序高性能的秘密

最近让 Westore 小程序项目的性能大幅度飙升，已经达到可以驾驭所有规模的项目的程度，这里作下总结。讲高性能前，先回顾常见的低性能操作:

* 频繁的去 setData，或大量后台态页面进行 setData
* 每次 setData 都传递大量新数据

Westore 通过为小程序定制的[超轻量的 JSON Diff 库](https://github.com/dntzhang/westore/blob/master/packages/westore/utils/diff.js)，可以避免掉第二点(即每次 setData 都传递大量新数据)，那么第一点怎么去规避？Westore 会收集所有组件和页面对象的实例(即this),在执行 update 的时候会遍历所有实例进行 update。实现代码如下:

```js
//TODO 按需更新？待优化？
for (let key in globalStore.instances) {
    globalStore.instances[key].forEach(ins => {
        ins.setData.call(ins, diffResult)
    })
}
```

可以看到我特别标记了待优化！当小程序被做成大程序之后，比如小程序页面达到了几百个，性能问题就会暴露。那么怎么让 Westore 驾驭超大型小程序？解药:

* 纯组件
* 按需更新 

## 纯组件

先快速说下纯组件，Westore里可以使用 `create({ pure: true })` 创建纯组件（当然也可以直接使用 Component），比如 ：

```js

import create from '../../utils/create'

create({
  pure : true,
  
  properties: {
    text: {
      type: String,
      value: '',
      observer(newValue, oldValue) { }
    }
  },

  data: {
    privateData: 'privateData'
  },

  ready: function () {
    console.log(this.properties.text)
  },

  methods: {
    onTap: function(){
      this.store.data.privateData = '成功修改 privateData'
      this.update()
      this.triggerEvent('random', {rd:'成功发起单向数据流' + Math.floor( Math.random()*1000)})
    }
  }
})
```

纯组件的 data 是完全属于自己，和全局 store.data 没有任何关系，通过 props 接收外界传入参数，通过 triggerEvent 和外界通讯。

![](../asset/data-flow2.jpg)

## 按需更新

怎么做到按需更新？组件和页面声明依赖 data！比如，下面定义好了全局 store 和数据的默认值:

```js
export default {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logs: [],
    firstName: 'dnt',
    lastName: 'zhang',
    fullName:function(){
      return this.firstName + this.lastName
    }
  },
  logMotto: function () {
    console.log(this.data.motto)
  },
  //默认 false，为 true 会无脑更新所有页面和组件
  //updateAll: true
}
```

页面和组件上同样需要声明依赖的 data，这样 westore 会按需局部更新。如 Page 的 data：

```js
data: {
  motto: null,
  userInfo: null,
  hasUserInfo: null,
  canIUse: null,
  b: { arr: [ ] },
  firstName: null,
  lastName: null,
  pureProp: null
}
```

westore 内部会生成如下更新 Path:

```js
{
  "motto": true,
  "userInfo": true,
  "hasUserInfo": true,
  "canIUse": true,
  "b.arr": true,
  "firstName": true,
  "lastName": true,
  "pureProp": true
}
```

注意的是，你如果更新 b 是不是触发视图更新，必须更新 b.arr 或者 b.arr[index]

比如 log 页面的 data:

```js
create(store, {
  data: {
    logs: []
  }
})
```

页面和组件上声明的 data 只是为了计算依赖，不用赋值，页面和组件上声明的 data 的值会被 store 上的值覆盖掉。所以页面和组件默认值在 store.data 上标记，而不是在组件和页面的 data。纯组件在组件内部的 data 定义默认值。所以归纳一下：

* store.data 用来列出所有属性和默认值
* 组件和页面的 data 用来列出依赖的 store.data 的属性 (westore会记录path)，按需更新
* 如果小程序页面和组件很少，可以 updateAll 设置成 true，并且组件和页面不需要声明 data，也就不会按需更新
* 纯组件的 data 和 store.data 没有关系，所有其 data 用来列出所有属性和默认值

## 原理

### data 转 path 并存在实例上

```js
function dataToPath(data, result) {
    Object.keys(data).forEach(key => {
        result[key] = true
        const type = Object.prototype.toString.call(data[key])
        if (type === OBJECTTYPE) {
            _dataToPath(data[key], key, result)
        }
    })
}

function _dataToPath(data, path, result) {
    Object.keys(data).forEach(key => {
        result[path + '.' + key] = true
        const type = Object.prototype.toString.call(data[key])
        if (type === OBJECTTYPE) {
            _dataToPath(data[key], path + '.' + key, result)
        }
    })
}
```

即:

```js
{
  a: 1,
  b: 2,
  c: { d:[] },
  e:[]
}
```

会被转成：

```js
{
  a: true,
  b: true,
  'c.d':true,
  e: true
}
```

转换之后的值会挂载在页面或组件的实例下，用来校验需要还是不需要更新视图:

```js
for (let key in globalStore.instances) {
    globalStore.instances[key].forEach(ins => {
        if(globalStore.updateAll || ins._updatePath && needUpdate(diffResult, ins._updatePath)){
            ins.setData.call(ins, diffResult)
        }
    })
}
```

再看 needUpdate 的实现:

```js
function needUpdate(diffResult, updatePath){
    for(let keyA in diffResult){
        if(updatePath[keyA]){
            return true
        }
        for(let keyB in updatePath){
            if(includePath(keyA, keyB)){
                return true
            }
        }
    }
    return false
}

function includePath(pathA, pathB){
    if(pathA.indexOf(pathB)===0){
        const next = pathA.substr(pathB.length, 1)
        if(next === '['||next === '.'){
            return true
        }
    }
    return false
}
```

举例说明 Path 命中规则:

| diffResult | updatePath  |是否更新|
| ------ | ------  |------  |
| abc | 	abc  |	更新 |	 
| abc[1] | 	abc  |	更新 |
| abc.a| 	abc  |	更新 |
| abc| 	abc.a  |	不更新 |
| abc| 	abc[1]  |	不更新 |
| abc| 	abc[1].c  |	不更新 |
| abc.b| 	abc.b |	更新 |

以上只要命中一个条件就可以进行更新！

总结就是只要等于 updatePath 或者在 updatePath 子节点下都进行更新！

对应测试用例:

```js
test('needUpdate', () => {
  const updatePath = { 'a': true, 'b.c': true, 'd[2][1]': true }
  expect(needUpdate({ a: 1 }, updatePath)).toEqual(true)

  expect(needUpdate({ 'a[1]': 1 }, updatePath)).toEqual(true)

  expect(needUpdate({ 'b': 1 }, updatePath)).toEqual(false)

  expect(needUpdate({ 'd[2][1]': 1 }, updatePath)).toEqual(true)

  expect(needUpdate({ 'd[2][1].c': 1 }, updatePath)).toEqual(true)

  expect(needUpdate({ 'd[2]': 1 }, updatePath)).toEqual(false)

  expect(needUpdate({ 'b.c.d': 1 }, updatePath)).toEqual(true)

})
```

## License

MIT [@dntzhang](https://github.com/dntzhang)
