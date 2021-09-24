
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
      count: 18,

      left: 0,
      done: 0,
      type: 'all'
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

  toggle(id) {
    this.todo.toggle(id)
    this.computeCount()
    this.update()
  }

  computeCount() {
    this.data.left = 0
    this.data.done = 0
    for (let i = 0, len = this.data.todos.length; i < len; i++) {
      this.data.todos[i].done ? this.data.done++ : this.data.left++
    }
  }
}


module.exports = new OtherStore
