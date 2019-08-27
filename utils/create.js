import diff from './diff'

let originData = null
let globalStore = null
let fnMapping = {}

const ARRAYTYPE = '[object Array]'
const OBJECTTYPE = '[object Object]'
const FUNCTIONTYPE = '[object Function]'

export default function create(store, option) {
    let updatePath = null
    if (arguments.length === 2) {   
        if (option.data && Object.keys(option.data).length > 0) {
            updatePath = getUpdatePath(option.data)
            syncValues(store.data, option.data)
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
            extendStoreMethod(store)
        }
        getApp().globalData && (getApp().globalData.store = store)
        //option.data = store.data
        const onLoad = option.onLoad
        walk(store.data)
        // 解决函数属性初始化不能显示的问题，要求必须在data中声明使用
        // 这段代码是同步store.data到option.data，只有经过walk方法后store.data中的函数才能变成属性，才能被小程序page方法渲染
        if (option.data && Object.keys(option.data).length > 0) {
            updatePath = getUpdatePath(option.data)
            syncValues(store.data, option.data)
        }
        option.onLoad = function (e) {
            this.store = store
            this._updatePath = updatePath
            rewriteUpdate(this)
            store.instances[this.route] = []
            store.instances[this.route].push(this)
            onLoad && onLoad.call(this, e)
            syncValues(store.data, this.data)
            this.setData(this.data)
        }

	// 解决执行navigateBack或reLaunch时清除store.instances对应页面的实例
	const onUnload = option.onUnload
    option.onUnload = function () {
        onUnload && onUnload.call(this)
        store.instances[this.route] = []
    }

        Page(option)
    } else {
        store.lifetimes = store.lifetimes || {}
        const ready = store.ready || store.lifetimes.ready
        const pure = store.pure
        const componentUpdatePath = getUpdatePath(store.data)
        
        store.ready = store.lifetimes.ready = function () {
            if (pure) {
                this.store = { data: store.data || {} }
                this.store.originData = store.data ? JSON.parse(JSON.stringify(store.data)) : {}
                walk(store.data || {})
                rewritePureUpdate(this)
            } else {
                this.page = getCurrentPages()[getCurrentPages().length - 1]
                this.store = this.page.store
                this._updatePath = componentUpdatePath
                syncValues(this.store.data, store.data)
                walk(store.data || {})
                this.setData.call(this, this.store.data)
                rewriteUpdate(this)
                this.store.instances[this.page.route].push(this)
            }
            ready && ready.call(this)
        }
        Component(store)
    }
}

function syncValues(from, to){
    Object.keys(to).forEach(key=>{
        if(from.hasOwnProperty(key)){
            to[key] = from[key]
        }
    })
}


function getUpdatePath(data) {
	const result = {}
    dataToPath(data, result)
	return result
}

function dataToPath(data, result) {
	Object.keys(data).forEach(key => {
		result[key] = true
		const type = Object.prototype.toString.call(data[key])
		if (type === OBJECTTYPE) {
			_objToPath(data[key], key, result)
		} else if (type === ARRAYTYPE) {
			_arrayToPath(data[key], key, result)
		}
	})
}

function _objToPath(data, path, result) {
	Object.keys(data).forEach(key => {
		result[path + '.' + key] = true
		delete result[path]
		const type = Object.prototype.toString.call(data[key])
		if (type === OBJECTTYPE) {
			_objToPath(data[key], path + '.' + key, result)
		} else if (type === ARRAYTYPE) {
			_arrayToPath(data[key], path + '.' + key, result)
		}
	})
}

function _arrayToPath(data, path, result) {
	data.forEach((item, index) => {
		result[path + '[' + index + ']'] = true
		delete result[path]
		const type = Object.prototype.toString.call(item)
		if (type === OBJECTTYPE) {
			_objToPath(item, path + '[' + index + ']', result)
		} else if (type === ARRAYTYPE) {
			_arrayToPath(item, path + '[' + index + ']', result)
		}
	})
}

function rewritePureUpdate(ctx) {
    ctx.update = function (patch) {
        const store = this.store
        const that = this
        return new Promise(resolve => {
            //defineFnProp(store.data)
            if (patch) {
                for (let key in patch) {
                    updateByPath(store.data, key, patch[key])
                }
            }
            let diffResult = diff(store.data, store.originData)
            let array = []
            if (Object.keys(diffResult).length > 0) {
                array.push( new Promise( cb => that.setData(diffResult, cb) ) )
                store.onChange && store.onChange(diffResult)
                for (let key in diffResult) {
                    updateByPath(store.originData, key, typeof diffResult[key] === 'object' ? JSON.parse(JSON.stringify(diffResult[key])) : diffResult[key])
                }
            }
            Promise.all(array).then( e => resolve(diffResult) )
        })
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
        if (globalStore.methods && globalStore.methods[arr[0]]) {
            Object.keys(globalStore.methods[arr[0]]).forEach(key => {
                if (obj.hasOwnProperty(key)) {
                    delete obj[key]
                }
            })
        }
        globalStore.db.collection(arr[0]).doc(id).update({
            data: obj
        }).then((res) => {
            resolve(res)
        })
    })
}

function update(patch) {
    return new Promise(resolve => {
        //defineFnProp(globalStore.data)
        if (patch) {
            for (let key in patch) {
                updateByPath(globalStore.data, key, patch[key])
            }
        }
        let diffResult = diff(globalStore.data, originData)
        if (Object.keys(diffResult)[0] == '') {
            diffResult = diffResult['']
        }
        const updateAll = matchGlobalData(diffResult)
        let array = []
        if (Object.keys(diffResult).length > 0) {
            for (let key in globalStore.instances) {
                globalStore.instances[key].forEach(ins => {
                    if(updateAll || globalStore.updateAll || ins._updatePath){
                        // 获取需要更新的字段
                        const needUpdatePathList = getNeedUpdatePathList(diffResult, ins._updatePath)
                        if (needUpdatePathList.length) {
                            const _diffResult = {}
                            for (let _path in diffResult) {
                                if (needUpdatePathList.includes(_path)) {
                                    _diffResult[_path] = typeof diffResult[_path] === 'object' ? JSON.parse(JSON.stringify(diffResult[_path])) : diffResult[_path]
                                }
                            }
                            array.push( new Promise(cb => {
                                ins.setData.call(ins, _diffResult, cb)
                            }) )
                        }
                    }
                })
            }
            globalStore.onChange && globalStore.onChange(diffResult)
            for (let key in diffResult) {
                updateByPath(originData, key, typeof diffResult[key] === 'object' ? JSON.parse(JSON.stringify(diffResult[key])) : diffResult[key])
            }
        }
        Promise.all(array).then(e=>{
            resolve(diffResult)
        })
    })
}

function matchGlobalData(diffResult) {
    if(!globalStore.globalData) return false
    for (let keyA in diffResult) {
        if (globalStore.globalData.indexOf(keyA) > -1) {
            return true
        }
        for (let i = 0, len = globalStore.globalData.length; i < len; i++) {
            if (includePath(keyA, globalStore.globalData[i])) {
                return true
            }
        }
    }
    return false
}

function getNeedUpdatePathList(diffResult, updatePath){
    const paths = []
    for(let keyA in diffResult){
        if(updatePath[keyA]){
            paths.push(keyA)
        }
        for(let keyB in updatePath){
            if(includePath(keyA, keyB)){
                paths.push(keyA)
            }
        }
    }
    return paths
}

function includePath(pathA, pathB){
    if(pathA.indexOf(pathB)===0){
        const next = pathA.substr(pathB.length, 1)
        if(next === '['||next === '.'){
            return true
        }
    }
    return false
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
    return new Promise(function (resolve) {
        globalStore.db.collection(cn).where(where || {}).get().then(res => {
            extend(res, cn)
            resolve(res)
        })
    })
}

function extend(res, cn) {
    res.data.forEach(item => {
        const mds = globalStore.methods[cn]
        mds && Object.keys(mds).forEach(key => {
            Object.defineProperty(item, key, {
                enumerable: true,
                get: () => {
                    return mds[key].call(item)
                },
                set: () => {
                    //方法不能改写
                }
            })
        })
    })
}

function add(cn, data) {
    return globalStore.db.collection(cn).add({ data })
}

function remove(cn, id) {
    return globalStore.db.collection(cn).doc(id).remove()
}

function diffToPushObj(diffResult) {
    const result = {}
    Object.keys(diffResult).forEach(key => {
        diffItemToObj(key, diffResult[key], result)
    })
    return result
}

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

function extendStoreMethod() {
    globalStore.method = function (path, fn) {
        fnMapping[path] = fn
        let ok = getObjByPath(path)
        Object.defineProperty(ok.obj, ok.key, {
            enumerable: true,
            get: () => {
                return fnMapping[path].call(globalStore.data)
            },
            set: () => {
                console.warn('Please using store.method to set method prop of data!')
            }
        })
    }
}

function getObjByPath(path) {
    const arr = path.replace(/]/g, '').replace(/\[/g, '.').split('.')
    const len = arr.length
    if (len > 1) {
        let current = globalStore.data[arr[0]]
        for (let i = 1; i < len - 1; i++) {
            current = current[arr[i]]
        }
        return { obj: current, key: arr[len - 1] }
    } else {
        return { obj: globalStore.data, key: arr[0] }
    }
}

function walk(data) {
    Object.keys(data).forEach(key => {
        const obj = data[key]
        const tp = type(obj)
        if (tp == FUNCTIONTYPE) {
            setProp(key, obj)
        } else if (tp == OBJECTTYPE) {
            Object.keys(obj).forEach(subKey => {
                _walk(obj[subKey], key + '.' + subKey)
            })

        } else if (tp == ARRAYTYPE) {
            obj.forEach((item, index) => {
                _walk(item, key + '[' + index + ']')
            })

        }
    })
}

function _walk(obj, path) {
    const tp = type(obj)
    if (tp == FUNCTIONTYPE) {
        setProp(path, obj)
    } else if (tp == OBJECTTYPE) {
        Object.keys(obj).forEach(subKey => {
            _walk(obj[subKey], path + '.' + subKey)
        })

    } else if (tp == ARRAYTYPE) {
        obj.forEach((item, index) => {
            _walk(item, path + '[' + index + ']')
        })

    }
}

function setProp(path, fn) {
    const ok = getObjByPath(path)
    fnMapping[path] = fn
    Object.defineProperty(ok.obj, ok.key, {
        enumerable: true,
        get: () => {
            return fnMapping[path].call(globalStore.data)
        },
        set: () => {
            console.warn('Please using store.method to set method prop of data!')
        }
    })
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}