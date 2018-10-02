
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
    //  setTimeout(()=>{
    //   this.store.data.user[0].age++
    //   this.store.push()
    //  },3000)

    
      const index = parseInt(evt.currentTarget.dataset.index)
      const item = this.store.data.user.splice(index, 1)[0]
      this.update()
      this.store.remove('user', item._id)
    }
  }
})
