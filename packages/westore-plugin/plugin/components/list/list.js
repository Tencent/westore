import create from '../../westore/create-plugin'

create({
  data:{list:[]},
  attached: function () {
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
  }
})