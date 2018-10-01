/*
    增删改查
*/

//push 先diff 在同步到云库
function push(collectionName, items) {
    if (Object.prototype.toString.call(items) === '[object Array]') {

    } else {

    }
}

//pull 跟本地先 diff 再同步到本地（不进行 add 和 remove，只匹配更新 store.data 的所有数据）
function pull(collectionName, where) {

}

//增加数据云库
function add(collectionName, data) {

}

//从云库删除
function remove(collectionName, id) {

}