import create from '../../utils/create'
import store from '../../store'

var plugin = requirePlugin("myPlugin")

create(store, {
  onLoad: function() {
    plugin.getData()
  }
})