import diff from './diff'

let originData = null

export default function create(store, option) {
    if (arguments.length === 2) {
        if (option.data && Object.keys(option.data).length > 0) {
            Object.assign(store.data, option.data)
        }
        if (!originData) {
            originData = JSON.parse(JSON.stringify(store.data))
            store.instances = {}
        }
        getApp().globalData.store = store
        option.data = store.data
        const onLoad = option.onLoad
        option.onLoad = function (e) {
            this.store = store
            rewriteUpdate(this)
            store.instances[this.route] = []
            store.instances[this.route].push(this)
            onLoad && onLoad.call(this, e)
        }
        Page(option)
    } else {
        const ready = store.ready
        store.ready = function () {
            this.page = getCurrentPages()[getCurrentPages().length - 1]
            this.store = this.page.store
            Object.assign(this.store.data, store.data)
            this.setData.call(this, this.store.data)
            rewriteUpdate(this)
            this.store.instances[this.page.route].push(this)
            ready && ready.call(this)
        }
        Component(store)
    }
}

function rewriteUpdate(ctx) {
    ctx.update = (patch) => {
        if (patch) {
            for (let key in patch) {
                updateByPath(ctx.store.data, key, patch[key])
            }
        }
        const diffResult = diff(ctx.store.data, originData)
        //优化数据和组件关联定向更新
        for (let key in ctx.store.instances) {
            ctx.store.instances[key].forEach(ins => {
                ins.setData.call(ins, diffResult)
            })
        }
        ctx.store.onChange && ctx.store.onChange(diffResult)
        for (let key in diffResult) {
            updateByPath(originData, key, diffResult[key])
        }
    }
}

function updateByPath(origin, path, value) {
    const arr = path.replace(/\[|(].)|\]/g, '.').split('.')
    if (arr[arr.length - 1] == '') arr.pop()
    let current = origin
    for (let i = 0, len = arr.length; i < len; i++) {
        if (i === len - 1) {
            current[arr[i]] = value
        } else {
            current = current[arr[i]]
        }
    }
}
