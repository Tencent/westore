const { update } = require('westore')

Component({
  properties: {
    count: {
      type: Number,
      value: 1
    }
  },
  methods: {
    add() {
      this.data.count++
      update(this)
      this.triggerEvent('countchanged', this.data.count)
    }
  }
})