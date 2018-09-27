import diff from './diff'

let originData = null
let globalStore = null

export default function create(store, option) {
    let opt = store
    if (option) {
        opt = option
        originData = JSON.parse(JSON.stringify(store.data))
        globalStore = store
        globalStore.instances = []
    }

    const attached = opt.attached
    opt.attached = function () {
        this.store = globalStore
        this.store.data = Object.assign(globalStore.data, opt.data)
        this.setData.call(this, this.store.data)
        globalStore.instances.push(this)
        rewriteUpdate(this)
        attached && attached.call(this)
    }
    Component(opt)
}

function rewriteUpdate(ctx) {
    ctx.update = () => {
        const diffResult = diff(ctx.store.data, originData)
        globalStore.instances.forEach(ins => {
            ins.setData.call(ins, diffResult)
        })
        ctx.store.onChange && ctx.store.onChange(diffResult)
        for (let key in diffResult) {
            updateOriginData(originData, key, diffResult[key])
        }
    }
}

function updateOriginData(origin, path, value) {
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