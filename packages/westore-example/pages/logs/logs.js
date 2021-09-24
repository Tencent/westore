// logs.js

const logStore = require('../../stores/log-store')

Page({
  data: logStore.data,
  onLoad() {
    logStore.bind('logPage', this)
    logStore.loadLogs()
  }
})
