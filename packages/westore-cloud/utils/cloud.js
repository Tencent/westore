/*
    增删改查
*/

//push 先diff 在同步到云库
//没有标记 _id 的直接进行 add 并把生成的id 写到 store.data
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