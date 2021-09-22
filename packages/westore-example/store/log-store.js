
const { Store } = require('westore')
const Log = require('../models/log')

class LogStore extends Store {
  constructor() {
    super()
    this.data = {
      logs: []
    }

    this.log = new Log()
  }

  loadLogs() {
    this.log.loadLogs()
    this.data.logs = this.log.logs
    this.update('logPage')
  }
}


module.exports = new LogStore
