
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
    a: { b: 123 }
  },

  ready: function () {
    // this.store.onChange = function(info){
    //   console.log(info)
    // }

    // setTimeout(() => {
    //   this.store.data.motto = 'Hello Store'
    //   this.store.data.a.b = 1234
    //   this.update()
    // }, 2000)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function (evt) {
     setTimeout(()=>{
      this.store.data.user.list[0].age++
      this.store.push()
     },3000)
      // const index = parseInt(evt.currentTarget.dataset.index)
      // this.store.data.user.list.splice(index, 1)
      // this.update()
    }
  }
})
