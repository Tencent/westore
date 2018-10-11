import create from '../../westore/create-plugin'
import store from '../../store'

create(store, {
  properties: {
    authKey: {
      type: String,
      value: '',
      observer(newValue, oldValue) {

      }
    }
  },
  data:{
      list: [],
      firstName: null,
      lastName: null
  },
  attached: function () {
    //获取插件上声明传递过来的属性
    console.log(this.properties.authKey)
    //监听所有变化
    this.store.onChange = (detail) => {
      this.triggerEvent('listChange', detail)
    }
    // 可以在这里发起网络请求获取插件的数据
    console.log(this.store)
    this.store.data.list = [{
      name: '电视',
      price: 1000
    }, {
      name: '电脑',
      price: 4000
    }, {
      name: '手机',
      price: 3000
    }]

    this.update()

    setTimeout(() => {
      this.store.data.list.splice(1, 1)
      this.update()
    }, 1000)


    setTimeout(() => {
      this.store.data.list[0].name = 'westore'
      this.update()
    }, 2000)

    setTimeout(() => {
      this.store.data.list.push({ name: 'dntzhang', price: 1000 })
      this.update()
    }, 3000)

    setTimeout(() => {
      //this.store.data.list[2].price = 100000
      this.update(
        { 'list[2].price': 100000 }
      )
    }, 4000)

    setTimeout(() => {
      this.update(
        {firstName: 'DNT' }
      )
      this.update()
    }, 6000)
  }
})

//组件之外使用 store.update
setTimeout(() => {
  store.update(
    { 'list[2].price': 200000 }
  )
}, 5000)