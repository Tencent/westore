import create from '../../westore/create-plugin'

create({
  data: { list: [] },
  attached: function () {
    //监听所有变化
    this.store.onChange = function (info) {
      console.log(info)
    }
    // 可以在这里发起网络请求获取插件的数据
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
      this.store.data.list[2].price = 100000
      this.update()
    }, 4000)
  }
})