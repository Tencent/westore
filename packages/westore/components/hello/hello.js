
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
    abc : '',
    pureProp: ''
  },

  ready: function () {
    // this.store.onChange = function(info){
    //   console.log(info)
    // }

    // setTimeout(() => {
    //   this.store.data.abc = 'efg'
    //   this.update()
    // }, 2000)
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
