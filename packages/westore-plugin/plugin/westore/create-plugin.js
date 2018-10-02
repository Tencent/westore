import diff from './diff'

let originData = null
let globalStore = null
let fnMapping = {}

export default function create(store, option) {
    let opt = store
    if (option) {
        opt = option
        originData = JSON.parse(JSON.stringify(store.data))
        globalStore = store
        globalStore.instances = []
        create.store = globalStore
        store.update = update
    }

    const attached = opt.attached
    opt.attached = function () {
        this.store = globalStore
        this.store.data = Object.assign(globalStore.data, opt.data)
        defineFnProp(option?store.data:(opt.data||{}))
        this.setData.call(this, this.store.data)
        globalStore.instances.push(this)
        rewriteUpdate(this)
        attached && attached.call(this)
    }
    Component(opt)
}

function update(patch){
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
        }else{
            Object.keys(fnMapping).forEach(k =>{
                diffResult[k] = globalStore.data[k]
            })
        }
        defineFnProp(globalStore.data)
        globalStore.instances.forEach(ins => {
            ins.setData.call(ins, diffResult)
        })
        globalStore.onChange && globalStore.onChange(diffResult)
        for (let key in diffResult) {
            updateByPath(originData, key, typeof diffResult[key] === 'object' ? JSON.parse(JSON.stringify(diffResult[key])) : diffResult[key])
        }
    
}

function rewriteUpdate(ctx) {
    ctx.update = update
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