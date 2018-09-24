
import create from '../../utils/create'

// components/hello/hello.js
create({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  ready: function () {
    setTimeout(() => {
      this.store.data.motto = 'Hello Store'
      this.update()
    }, 2000)
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
