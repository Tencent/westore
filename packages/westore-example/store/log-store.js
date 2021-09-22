
const { Store, update } = require('westore')
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
    update(this.views.logPage)
  }
}


module.exports = new LogStore
