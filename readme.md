##observe.js

用于观察任意对象的任意变化的类库，以轻巧、实用、强大而闻名。

##3分钟精通observe.js

### 对象字面量
```javascript
var obj = { a: 1 };
//watch obj
observe(obj, function (name, value) {
    console.log(name + "__" + value);//a__2 
});
obj.a = 2;
```

### 数组
```javascript
var arr = [1, 2, 3];
//watch obj
observe(arr, function (name, value, old) {
    console.log(name + "__" + value+"__"+old);
});
arr.push(4);//array__push_4 
arr[3] = 5;//3__5_4
```

### 复杂对象
```javascript
var complexObj = { a: 1, b: 2, c: [{ d: [4] }] };
//watch complexObj
observe(complexObj, function (name, value) {
    console.log(name + "__" + value);    //d__100 
});
complexObj.c[0].d = 100;
```
### 普通对象
```javascript
var User = function (name, age) {
    this.name = name;
    this.age = age;
    //只监听name
    observe(this,["name"] function (name, value, oldValue) {
        console.log(name + "__" + value + "__" + oldValue);//name__wangwu__lisi 
    });
}
var user = new User("lisi", 25);
user.name = "wangwu";
```


This content is released under the (http://opensource.org/licenses/MIT) MIT License.

