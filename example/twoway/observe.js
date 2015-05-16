/* observejs --- By dnt http://kmdjs.github.io/
 * Github: https://github.com/kmdjs/observejs
 * MIT Licensed.
 */
;(function (win) {
    var observe = function (target, arr,callback) {
        var _observe = function (target, arr, callback) {
            if (observe.isArray(target)) {
                this.mock(target);
            }
            for (var prop in target) {
                if (target.hasOwnProperty(prop)) {
                    if (callback) {
                        if (observe.isArray(arr) && observe.isInArray(arr, prop)) {
                            this.watch(target, prop);
                        } else if (observe.isString(arr) && prop == arr) {
                            this.watch(target, prop);
                        }                       
                    } else{
                        this.watch(target, prop);
                    }
                }
            }         
            this.target = target;
            this.propertyChangedHandler = callback ? callback : arr;
        }
        _observe.prototype = {
            "onPropertyChanged": function (prop, value,oldValue,target) {
                value!== oldValue && this.propertyChangedHandler && this.propertyChangedHandler.call(this.target, prop, value, oldValue);
				if(typeof value === "object"){
					this.watch(target,prop);
				}
            },
            "mock": function (target) {
                var self = this;
                observe.methods.forEach(function (item) {
                    target[item] = function () {
                        var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                        for (var cprop in this) {
                            if (this.hasOwnProperty(cprop)  && !observe.isFunction(this[cprop])) {
                                self.watch(this, cprop);
                            }
                        }
                        if (new RegExp("\\b" + item + "\\b").test(observe.triggerStr)) {
                            self.onPropertyChanged("array", item, arguments[0]);
                        }
                        return result;
                    };
                });
            },
            "watch": function (target, prop) {
                if (!target.$observeProps) target.$observeProps = {};
                if (prop === "$observeProps") return;
                var self = this;
                if (observe.isFunction(target[prop])) return;
                var currentValue = target.$observeProps[prop] = target[prop];
                Object.defineProperty(target, prop, {
                    get: function () {
                        return this.$observeProps[prop];
                    },
                    set: function (value) {
                        var old = this.$observeProps[prop];
                        this.$observeProps[prop] = value;
                        self.onPropertyChanged(prop, value, old, this);                   
                    }
                });
                if (typeof currentValue == "object") {
                    if (observe.isArray(currentValue)) {
                        this.mock(currentValue);
                    }
                    for (var cprop in currentValue) {
                        if (currentValue.hasOwnProperty(cprop)) {
                            this.watch(currentValue, cprop);
                        }
                    }
                }
            }
        }
        return new _observe(target, arr, callback)
    }
    observe.methods = ["concat", "every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "reverse", "shift", "slice", "some", "sort", "splice", "unshift", "toLocaleString","toString","size"]
    observe.triggerStr = ["concat", "pop", "push", "reverse", "shift", "sort", "splice", "unshift","size"].join(",")
    observe.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    observe.isString = function (obj) {
        return typeof obj === "string";
    }
    observe.isInArray = function (arr, item) {
        for (var i = arr.length; --i > -1;) {
            if (item === arr[i]) return true;
        }
        return false;
    }
    observe.isFunction = function (obj) {
        return Object.prototype.toString.call(obj) == '[object Function]';
    }
    observe.twoWay = function (objA, aProp, objB, bProp) {
        if (typeof objA[aProp] === "object" && typeof objB[bProp] === "object") {
            observe(objA, aProp, function (name, value) {
                objB[bProp] = this[aProp];
            })
            observe(objB, bProp, function (name, value) {
                objA[aProp] = this[bProp];
            })
        } else {
            observe(objA, aProp, function (name, value) {
                objB[bProp] = value;
            })
            observe(objB, bProp, function (name, value) {
                objA[aProp] = value;
            })
        }
    }
    
	Array.prototype.size=function(length){
		this.length = length;
	}
	
    if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = observe }
    else if (typeof define === 'function' && define.amd) { define(observe) }
    else { win.observe = observe };
})(Function('return this')());
