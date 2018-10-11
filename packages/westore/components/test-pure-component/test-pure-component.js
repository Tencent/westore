
import create from '../../utils/create'

//纯组件直接使用 Component 或者 加上 pure : true
create({
  pure : true,
  /**
   * 组件的属性列表
   */
  properties: {
    pureProp: {
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
  data: {
    privateData: 'privateData'
  },

  ready: function () {
    //console.log(this.properties.pureProp)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function(){
      
      this.store.data.privateData = '成功修改 privateData'
      this.update()
      //从这里开始绘制一张单向数据流的图
      this.triggerEvent('random', {rd:'成功发起单向数据流'+Math.floor( Math.random()*1000)})
    }
  }
})
