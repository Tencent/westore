import diff from './diff'

let originData = null
let globalStore = null
let fnMapping = {}

export default function create(store, option) {
    if (arguments.length === 2) {
        if (option.data && Object.keys(option.data).length > 0) {
            Object.assign(store.data, option.data)
        }
        if (!originData) {
            originData = JSON.parse(JSON.stringify(store.data))
            globalStore = store
            store.instances = {}
            store.update = update
            store.push = push
            store.pull = pull
            store.add = add
            store.remove = remove
            store.originData = originData
            store.env && initCloud(store.env)
        }
        getApp().globalData && (getApp().globalData.store = store)
        option.data = store.data
        const onLoad = option.onLoad
        defineFnProp(store.data)
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
            defineFnProp(store.data || {})
            this.setData.call(this, this.store.data)
            rewriteUpdate(this)
            this.store.instances[this.page.route].push(this)
            ready && ready.call(this)
        }
        Component(store)
    }
}

function initCloud(env) {
    wx.cloud.init()
    globalStore.db = wx.cloud.database({
        env: env
    })
}

function push(patch) {
    return new Promise(function (resolve, reject) {
        _push(update(patch), resolve, reject)
    })
}

function _push(diffResult, resolve) {
    const objs = diffToPushObj(diffResult)

    Object.keys(objs).forEach((path) => {
        const arr = path.split('-')
        const id = globalStore.data[arr[0]][parseInt(arr[1])]._id
        const obj = objs[path]
        globalStore.db.collection(arr[0]).doc(id).update({
            data: obj
        }).then((res) => {
            resolve(res)
        })
    })
}

function update(patch) {
    let needDiff = false
    let diffResult = patch
    if (patch) {
        for (let key in patch) {
            updateByPath(globalStore.data, key, patch[key])
            if (typeof patch[key] === 'object') {
                needDiff = true
            }
        }
    } else {
        needDiff = true
    }
    if (needDiff) {
        diffResult = diff(globalStore.data, originData)
    } else {
        Object.keys(fnMapping).forEach(k => {
            diffResult[k] = globalStore.data[k]
        })
    }
    defineFnProp(globalStore.data)
    for (let key in globalStore.instances) {
        globalStore.instances[key].forEach(ins => {
            ins.setData.call(ins, diffResult)
        })
    }
    globalStore.onChange && globalStore.onChange(diffResult)
    for (let key in diffResult) {
        updateByPath(originData, key, typeof diffResult[key] === 'object' ? JSON.parse(JSON.stringify(diffResult[key])) : diffResult[key])
    }
    return diffResult
}

function defineFnProp(data) {
    Object.keys(data).forEach(key => {
        const fn = data[key]
        if (typeof fn == 'function') {
            fnMapping[key] = fn
            Object.defineProperty(globalStore.data, key, {
                get: () => {
                    return fnMapping[key].call(globalStore.data)
                },
                set: (value) => {
                    fnMapping[key] = value
                }
            })
        }
    })
}

function rewriteUpdate(ctx) {
    ctx.update = update
}

function updateByPath(origin, path, value) {
    const arr = path.replace(/]/g, '').replace(/\[/g, '.').split('.')
    let current = origin
    for (let i = 0, len = arr.length; i < len; i++) {
        if (i === len - 1) {
            current[arr[i]] = value
        } else {
            current = current[arr[i]]
        }
    }
}

function pull(cn, where) {
    return globalStore.db.collection(cn).where(where || {}).get()
}

function add(cn, data) {
    return globalStore.db.collection(cn).add({ data })
}

function remove(cn, id) {
    return globalStore.db.collection(cn).doc(id).remove()
}
//测试深度嵌套的字段
function diffToPushObj(diffResult) {
    const result = {}
    Object.keys(diffResult).forEach(key => {
        diffItemToObj(key, diffResult[key], result)
    })
    return result
}
//console.error(diffToPushObj({'user[2].name':{cc:1},'user[2].age':13,'user[1].a.b':{xxx:1}}))
function diffItemToObj(path, value, result) {
    const arr = path.replace(/]/g, '').replace(/\[/g, '.').split('.')
    const obj = {}
    let current = null
    const len = arr.length
    for (let i = 2; i < len; i++) {
        if (len === 3) {
            obj[arr[i]] = value
        } else {
            if (i === len - 1) {
                current[arr[i]] = value
            } else {
                const pre = current
                current = {}
                if (i === 2) {
                    obj[arr[i]] = current
                } else {
                    pre[arr[i]] = current
                }
            }
        }
    }
    const key = arr[0] + '-' + arr[1]
    result[key] = Object.assign(result[key] || {}, obj)
}

create.diffToPushObj= diffToPushObj