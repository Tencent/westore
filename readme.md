# Westore - WeChat applet solution

> [1KB javascript](https://github.com/dntzhang/westore/blob/master/packages/westore/utils/create.js) Overrides state management, cross-page communication, plugin development, and cloud database development
---

- [Omi 4.0![](https://raw.githubusercontent.com/dntzhang/cax/master/asset/hot.png)](https://github.com/Tencent/omi) - Same as Web Components, The same is Path Updating
- [Introduction to Packages] (#packages-introduction)
- [Preface] (#Foreword)
- [Cloud Development![](https://raw.githubusercontent.com/dntzhang/cax/master/asset/hot.png)](./westore-cloud.md)
- [plugin development] (./westore-plugin.md)
- [Ordinary development] (#general development)
- [Define global store] (#define global-store)
  - [Create Page] (#Create Page)
  - [Bind Data] (#Binding Data)
  - [Update Page] (#Update Page)
  - [Create component] (#Create component)
  - [Update Component] (#Update Component)
  - [setData and update comparison] (#setdata- and -update-comparison)
  - [Cross-page sync data] (#cross-page sync data)
  - [Pure component] (#pure component)
  - [Debug] (#Debug)
  - [Ultra Large Program Best Practices] (#Super Large Program Best Practices)
- [API](#api)
- [Precautions] (#Notes)
- [Principle] (#principle)
  - [JSON Diff](#json-diff)
  - [Update](#update)
  - [Function Attributes] (#Function Attributes)
- [License](#license)


## Packages Introduction

| Package | Introduction |
| ------ | ------ |
| westore | Applet Demo Project |
| westore-cloud | Applet + Tencent Cloud Demo Project (Stealth Cloud) |
| westore-plugin | Applet Plugin Development Demo Project |
| westore-proxy | The bottom of the applet uses the Proxy demo project |
| westore-test | Test the weaver API applet |
| westore-web | Apple Development Web Project (Planning: only submitted WXML compiler)) |

Later consider compiling the applet directly into the [omi](https://github.com/Tencent/omi) project via westore-web compilation.

## Foreword

As we all know, the small program through the page or component's respective setData plus the communication between the various father and son, grandparents, siblings, aunts and cousins ​​and other components will make the program a mess, if you add cross-page Communication between components can make the program very difficult to maintain and debug. Although there are many techniques for compiling and transferring small programs on the market, I feel that there is no pain point in punctuating small programs. Small programs are perfect for componentization, development, debugging, publishing, grayscale, rollback, reporting, statistics, monitoring, and recent cloud capabilities. The engineering of small programs is a model for the front end. The developer tools are also constantly updated, imaginable future, component layout does not necessarily need to write code. Moreover, according to statistics, the most used technology stack for developing small programs is the development tools and syntax of the applet itself, so the biggest pain point is only state management and cross-page communication. Westore's plan:

![data-flow](./asset/data-flow2.jpg)

For non-pure components, you can directly eliminate the triggerEvent process, directly modify store.data and update to form a reduced version of the unidirectional data stream.

[JSON Diff Library] inspired by [Omi Framework] (https://github.com/Tencent/omi) and developed specifically for applets (https://github.com/dntzhang/westore/blob/master/ Packages/westore/utils/diff.js), so with the westore global state management and cross-page communication framework to keep everything under control, and the high-performance JSON Diff library is good, long list scrolling display becomes easy to control . Summarized the following features and advantages:

* The same simple Store API as Omi
* Ultra-small code size (including json diff more than 100 lines)
* Respect and obey the design of small programs (other translation libraries are equivalent to the opposite)
* Enhanced data data binding, function properties can be directly bound to WXML
* this.update is compatible with setData with the same syntax
* this.update is better and more intelligent than native setData
* Westore developed [applied template] for applet plugins (https://github.com/dntzhang/westore/tree/master/packages/westore-plugin)
* Westore integrates Tencent cloud development

Summarize the pain points of the small program:

* Use this.data to get internal data and property values, but don't modify them directly, you should use setData to modify
* setData programming experience is not good, many scenes directly assigned value is more intuitive and convenient
* setData kaka is slow and slow, JsCore and Webview data objects are passed back and forth to waste computing resources and memory resources
* Inter-component communication or cross-page communication can make the program messy and become extremely difficult to maintain and expand.

So you can often see such code when you don't use westore:

![not-westore](./asset/not-westore.png)

After using westore:

![westore](./asset/westore2.png)

The above two methods can also be mixed.

As you can see, westore not only supports direct assignment, but this.update is compatible with the syntax of this.setData , but the performance is much better than this.setData, another example:

``` js
This.store.data.motto = 'Hello Westore'
This.store.data.b.arr.push({ name: 'ccc' })
This.update()
```

Equivalent to

``` js
This.update({
  Motto: 'Hello Westore',
  [`b.arr[${this.store.data.b.arr.length}]`]:{name:'ccc'}
})
```

It is important to emphasize here that although this.update is compatible with the applet's this.setData method, it is more intelligent, this.update will first Diff and then setData. principle:

![](./asset/update2.jpg)

## API

There are only four Westore APIs, Avenue to Jane:

* create(store, option) create page
* create(option) create component
* this.update([data]) updates the page or component, where data is optional and the format of data is the same as setData
* store.update([data]) updates the page or component, used in non-page non-component js files
* store.method(path, fn) Update or extend the function properties. Note that you cannot modify the function properties directly by assigning them. You need to use store.method.
* store.onChange = fn listens for store data change callbacks, which can be used to write some other common logic for reporting or monitoring data changes.

The pure component uses the Component that comes with the applet, or uses `create({ pure: true })`. The create method can use the update method, the Component method does not work.

## 普通开发

### Define global store

```js
Export default {
  Data: {
    Motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    Logs: [],
    b: {
      Arr: [{ name: 'value item 1' }] ,
      //Deep nodes also support function properties
      fnTest:function(){
        Return this.motto.split('').reverse().join('')
      }
    },
    firstName: 'dnt',
    lastName: 'zhang',
    fullName: function () {
      Return this.firstName + this.lastName
    },
    pureProp: 'pureProp',
    globalPropTest: 'abc', //Change I will refresh all pages, no need to declare data dependencies on components and pages
    Ccc: { ddd: 1 } //Change I will refresh all pages, no need to declare components and page depend on data dependencies
  },
  globalData: ['globalPropTest', 'ccc.ddd'],
  logMotto: function () {
    Console.log(this.data.motto)
  },
  //default false, true will not update all instances without brain
  //updateAll: true
}
```

The pages and components also need to declare the dependent data so that westore will be partially updated as needed. Such as Page data:

```js
Data: {
  Motto: null,
  userInfo: null,
  hasUserInfo: null,
  canIUse: null,
  b: { arr: [ ] },
  firstName: null,
  lastName: null,
  pureProp: null,
  //privateProp You can also define properties that are not available in store.data. Changes to this property can only be updated via this.setData .
  privateProp: 'private data',
  Xxxx: 'Private Data 2'
}
```

The value of data declared on the page and component is overwritten by the value on the store. So page and component defaults are marked on store.data instead of data on components and pages. The pure component defines the default value for the data inside the component. So sum up:

* store.data is used to list all properties and defaults
* The component's private data can also be placed on its own data, not on store.data, but not through this.update, only through setData
* The data of the component and page is used to list the properties of the dependent store.data (westore will record the path), updated as needed
* If the applet page and components are few, updateAll can be set to true, and components and pages do not need to declare data, so they will not be updated as needed.
* pure component data and store.data no
