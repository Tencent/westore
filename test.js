
var oba = require("./oba.js");

describe("A suite is just a function", function() {
    var a;

    it("and so is a spec", function() {
        a = true;

        expect(a).toBe(true);
    });
});



describe("A suite is just a function", function() {
    var obj = { a: 1 ,c:33};
    //watch obj
    var count = 0;
    oba(obj, function (name, value,old,path) {
        //console.log(name + "__" + value + "__" + old+"__"+path);
        count++;
    });
    oba(obj,"c", function (name, value,old,path) {
       // console.log(name + "__" + value + "__" + old+"__"+path);
        count++;
    });
    obj.c = 2;


    it("and so is a spec", function() {

        expect(count).toBe(2);
    });
});