
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
  }
})
