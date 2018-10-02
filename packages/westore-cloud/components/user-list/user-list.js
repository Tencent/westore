
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
      const id = evt.currentTarget.dataset.id
      const list = this.store.data.user.list
      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i]._id === id) {
          list[i].age++
          break
        }
      }

      this.update()
    }
  }
})
