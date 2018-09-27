import create from '../../utils/create'
import store from '../../store'

create(store, {
  onLoad: function () {

  },
  onListChange: function (evt) {
    console.log(evt.detail)
  }
})