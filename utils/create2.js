/*
    westore 2.0 
*/

import JSONProxy from './proxy'

let currentStore = null
let preKv = ''
const noop = function () { }

const handler = function (patch) {
    const mpPatch = {}
    const key = fixPath(patch.path)
    mpPatch[key] = patch.value ? patch.value : null
    //fix arr splice?
    if (preKv !== key + '-' + patch.value) {
        preKv = key + '-' + patch.value
        update(mpPatch)
    }
}

export default function create(store, option) {
    if (arguments.length === 2) {
        if (option.data && Object.keys(option.data).length > 0) {
            Object.assign(store.data, option.data)
        }
        if (!store.instances) {
            store.instances = {}
        }

        getApp().globalData.store = store
        currentStore = store
        option.data = store.data
        const jp = new JSONProxy(store.data, handler)
        const onLoad = option.onLoad
        option.onLoad = function () {
            //兼容1.0不报错
            this.update = noop
            this.store = store
            this.store.data = jp.observe(true, handler)
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

function update(kv) {
    //合并path?
    for (let key in currentStore.instances) {
        currentStore.instances[key].forEach(ins => {
            ins.setData.call(ins, kv)
        })
    }
}

function fixPath(path) {
    let mpPath = ''
    const arr = path.replace('/', '').split('/')
    arr.forEach((item, index) => {
        if (index) {
            if (isNaN(parseInt(item))) {
                mpPath += '.' + item

            } else {
                mpPath += '[' + item + ']'
            }
        } else {
            mpPath += item
        }
    })
    return mpPath
}