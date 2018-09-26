/*
    westore 2.0 
*/

import JSONProxy from './proxy'

let currentStore = null
let currentData = null
let timeout = null
const noop = function () { }

let patchs = {}
const handler = function (patch) {
    clearTimeout(timeout)
    if (patch.op === 'remove') {//fix arr splice 
        const kv = getArrayPatch(patch.path)
        patchs[kv.k] = kv.v
        timeout = setTimeout(function(){
            update(patchs)
            patchs = {}
        })   
    } else {
        const key = fixPath(patch.path)
        patchs[key] = patch.value
        timeout = setTimeout(function(){
            update(patchs)
            patchs = {}
        })   
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
        currentData = store.data
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
    for (let key in currentStore.instances) {
        currentStore.instances[key].forEach(ins => {
            ins.setData.call(ins, kv)
        })
    }
}

function getArrayPatch(path) {
    const arr = path.replace('/', '').split('/')
    let current = currentData[arr[0]]
    for (let i = 1, len = arr.length; i < len - 1; i++) {
        current = current[arr[i]]
    }
    return {k:fixArrPath(path),v:current}
}

function fixArrPath(path) {
    let mpPath = ''
    const arr = path.replace('/', '').split('/')
    const len = arr.length
    arr.forEach((item, index) => {
        if (index < len - 1) {
            if (index) {
                if (isNaN(parseInt(item))) {
                    mpPath += '.' + item

                } else {
                    mpPath += '[' + item + ']'
                }
            } else {
                mpPath += item
            }
        }
    })
    return mpPath
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