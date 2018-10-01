
## Westore 更新日志

### 纯组件、业务组件与单向数据流

#### 纯组件(
  
常见纯组件由很多，如 tip、alert、dialog、pager、日历等，与业务数据无直接耦合关系。
组件的显示状态由传入的 props 决定，与外界的通讯通过内部 triggerEvent 暴露的回调。
triggerEvent 的回调函数可以改变全局状态，实现单向数据流同步所有状态给其他兄弟、堂兄、姑姑等组件。

Westore里的纯组件和原生小程序一样，使用 Component 创建：

```js
//
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: '',
      observer(newValue, oldValue) {
        console.log(newValue, oldValue)
      }
    }
  },

  ready: function () {
    console.log(this.properties.text)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function(){
      const rd = Math.random()
      //从这里开始可以触发单向数据流
      this.triggerEvent('random', {rd:rd})
    }
  }
})

```



