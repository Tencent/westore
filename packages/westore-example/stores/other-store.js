
const { Store, update } = require('westore')
const Log = require('../models/log')
const Todo = require('../models/todo')

class OtherStore extends Store {
  constructor() {
    super()
    this.data = {
      logsSize: [],
      todoTitle: '',
      todos: [],
      count: 18
    }

    this.log = new Log()
    this.todo = new Todo()

    this.todo.subscribe(() => {
      this.data.todos = this.todo.todos
      this.update()
    })


  }

  init() {
    this.data.todos = this.todo.todos
    this.log.loadLogs()
    this.data.logsSize = this.log.logs.length
    this.update()
  }

  addTodo() {

    this.todo.addTodo(this.data.todoTitle)

    this.data.todoTitle = ''
    this.update()
  }

}


module.exports = new OtherStore
