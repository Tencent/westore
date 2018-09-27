import diff from './diff'

let originData = null

export default function create(option) {

    const attached = option.attached
    option.attached = function () {

        this.store = { data: {} }
        Object.assign(this.store.data, option.data)
        if (!originData) {
            originData = JSON.parse(JSON.stringify(option.data))
        }
        this.setData.call(this, this.store.data)
        rewriteUpdate(this)
        if (!this.store.instances) this.store.instances = { '&plugin': [] }
        this.store.instances['&plugin'].push(this)
        attached && attached.call(this)
    }
    Component(option)

}

function rewriteUpdate(ctx) {
    ctx.update = () => {
        const diffResult = diff(ctx.store.data, originData)
        //优化数据和组件关联定向更新
        for (let key in ctx.store.instances) {
            ctx.store.instances[key].forEach(ins => {
                ins.setData.call(ins, diffResult)
            })
        }
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