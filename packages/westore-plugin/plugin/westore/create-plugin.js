import diff from './diff'


export default function create(option) {

    const attached = option.attached
    option.attached = function () {
        this.store = Object.assign({ data: {} }, option.data)
        this.__originData = JSON.parse(JSON.stringify(option.data))
        this.setData.call(this, this.store.data)
        rewriteUpdate(this)
        attached && attached.call(this)
    }
    Component(option)
}

function rewriteUpdate(ctx) {
    ctx.update = () => {
        const diffResult = diff(ctx.store.data, ctx.__originData)
        ctx.setData(diffResult)
        ctx.store.onChange && ctx.store.onChange(diffResult)
        for (let key in diffResult) {
            updateOriginData(ctx.__originData, key, diffResult[key])
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