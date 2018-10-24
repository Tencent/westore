export default {
  data: {
    //user 对应 db 的 collectionName
    'user': [],
    //其他 collection 可以继续添加
    'product': []
  },
  methods: {
    //这里可以扩展 collection 每项的方法
    'product': {
      'agentString': function () {
        return this.agent.join('-')
      }
    }
  },
  env: 'test-06eb2e',
  updateAll: true

}

