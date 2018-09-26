/*
westore 2.0 待完善优化
*/

const handler = {
    get: function (target, key, receiver) {
        try {
            if (typeof target[key] === 'function') return Reflect.get(target, key, receiver)
            return new Proxy(target[key], handler)
        } catch (err) {
            return Reflect.get(target, key, receiver)
        }
    },
    set: function (target, key, value, receiver) {
        Reflect.set(target, key, value, receiver)
        update(key, value)
        return true
    },
    deleteProperty: function () {

    }
}

let currentStore = null
let currentData = null

const noop = function(){ }

export default function create(store, option) {
    if (arguments.length === 2) {
        if (option.data && Object.keys(option.data).length > 0) {
            Object.assign(store.data, option.data)
        }
        if (!store.instances) {
            store.instances = {}
        }

        getApp().globalData.store = store
        currentData = store.data
        currentStore = store
        const p = new Proxy(store.data, handler)

        option.data = store.data

        const onLoad = option.onLoad
        option.onLoad = function () {
            //兼容1.0不报错
            this.update = noop
            this.store = store
            this.store.data = p
            store.instances[this.route] = []
            store.instances[this.route].push(this)
            onLoad && onLoad.call(this)
        }
        Page(option)
    } else {
        const ready = store.ready
        store.ready = function () {
            //兼容1.0不报错
            this.update = noop
            this.page = getCurrentPages()[getCurrentPages().length - 1]
            this.store = this.page.store
            Object.assign(this.store.data, store.data)
            this.setData.call(this, this.store.data)

            this.store.instances[this.page.route].push(this)
            ready && ready.call(this)
        }
        Component(store)
    }
}


function update() {
    //diff 吗？
    for (let key in currentStore.instances) {
        currentStore.instances[key].forEach(ins => {
            ins.setData.call(ins, currentData)
        })
    }
}
