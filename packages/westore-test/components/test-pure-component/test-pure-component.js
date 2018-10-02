
//纯组件直接使用 Component
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

  /**
   * 组件的初始数据
   */
  // data: {
  //   text: { b: 123 }
  // },

  ready: function () {
    console.log(this.properties.text)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function(){
      
      const rd = Math.random()
      // this.setData({
      //   text : rd
      // })
      //从这里开始绘制一张单向数据流的图
      this.triggerEvent('random', {rd:rd})
    }
  }
})
