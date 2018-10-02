/*
    增删改查
*/

//push 先diff 在同步到云库
//注意，修改的数据必须是自己插入的
function push(collectionName, items) {
    if (Object.prototype.toString.call(items) === '[object Array]') {

    } else {

    }
}

//pull 跟本地先 diff 再同步到本地（不进行 add 和 remove，只匹配更新 store.data 的所有数据）
function pull(collectionName, where) {

}

//push 本地数据全部同步到云库
function pushLocal() {

}

//pull 先收集所有collectionName 和 _id 数据，然后拉去并同步到本地数据
function pullLocal() {

}

//增加数据云库
function add(collectionName, data) {

}

//从云库删除
function remove(collectionName, id) {

}

//测试深度嵌套的字段
function diffToPushObj(diffResult, storeData){

}

console.error(diffItemToObj('user.item.a.b',{cc:1}))
console.error(diffItemToObj('user.list[1].a.b',{cc:1}))
function diffItemToObj(path, value, storeData){
    const arr = path.replace(/\[|(].)|\]/g, '.').split('.')
    if (arr[arr.length - 1] == '') arr.pop()
    const result = {}
    const obj = {}
    result.obj = obj
    let current = null
    const len = arr.length
    
    if (arr[1] === 'list') {
        console.log(arr)
        //const item = 
    } else{
        for (let i = 2; i < len; i++) {
            if(len === 3){
                obj[arr[i]]  = value
            }else{
                if(i === len-1){
                    current[arr[i]] = value
                }else{
                    const pre = current
                    current ={}
                    if(i===2){
                        obj[arr[i]] = current
                    }else{
                        pre[arr[i]] = current
                    }
                }
                
            
              
            }
        }
    }

    return obj
    
}