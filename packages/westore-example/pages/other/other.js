
const otherStore = require('../../stores/other-store')

Page({
  data: otherStore.data,

  onLoad() {
    otherStore.bind('otherPage', this)
    otherStore.init()
  },

  onCountChanged(evt) {
    otherStore.data.count = evt.detail
  },

  addTodo() {
    otherStore.addTodo()
  },

  destroy(evt) {
    otherStore.destroy(evt.currentTarget.dataset.id)
  },

  toggle(evt) {
    otherStore.toggle(evt.currentTarget.dataset.id)
  },

  filter(evt) {
    otherStore.filter(evt.detail)
  },

  clearDone() {
    wx.showModal({
      title: '提示',
      content: '确定清空已完成任务？',
      success: (res) => {
        if (res.confirm) {
          otherStore.clearDone()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})
