'use strict';

var rfdc_1 = rfdc;

function copyBuffer (cur) {
  if (cur instanceof Buffer) {
    return Buffer.from(cur)
  }

  return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length)
}

function rfdc (opts) {
  opts = opts || {};

  if (opts.circles) return rfdcCircles(opts)
  return opts.proto ? cloneProto : clone

  function cloneArray (a, fn) {
    var keys = Object.keys(a);
    var a2 = new Array(keys.length);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var cur = a[k];
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur;
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur);
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur);
      } else {
        a2[k] = fn(cur);
      }
    }
    return a2
  }

  function clone (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, clone)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone))
    var o2 = {};
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) continue
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur);
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), clone));
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), clone));
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        o2[k] = clone(cur);
      }
    }
    return o2
  }

  function cloneProto (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, cloneProto)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), cloneProto))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), cloneProto))
    var o2 = {};
    for (var k in o) {
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur);
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        o2[k] = cloneProto(cur);
      }
    }
    return o2
  }
}

function rfdcCircles (opts) {
  var refs = [];
  var refsNew = [];

  return opts.proto ? cloneProto : clone

  function cloneArray (a, fn) {
    var keys = Object.keys(a);
    var a2 = new Array(keys.length);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var cur = a[k];
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur;
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur);
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur);
      } else {
        var index = refs.indexOf(cur);
        if (index !== -1) {
          a2[k] = refsNew[index];
        } else {
          a2[k] = fn(cur);
        }
      }
    }
    return a2
  }

  function clone (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, clone)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone))
    var o2 = {};
    refs.push(o);
    refsNew.push(o2);
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) continue
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur);
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), clone));
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), clone));
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        var i = refs.indexOf(cur);
        if (i !== -1) {
          o2[k] = refsNew[i];
        } else {
          o2[k] = clone(cur);
        }
      }
    }
    refs.pop();
    refsNew.pop();
    return o2
  }

  function cloneProto (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, cloneProto)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), cloneProto))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), cloneProto))
    var o2 = {};
    refs.push(o);
    refsNew.push(o2);
    for (var k in o) {
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur);
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), cloneProto));
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), cloneProto));
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        var i = refs.indexOf(cur);
        if (i !== -1) {
          o2[k] = refsNew[i];
        } else {
          o2[k] = cloneProto(cur);
        }
      }
    }
    refs.pop();
    refsNew.pop();
    return o2
  }
}

const clone = rfdc_1();
var DataTypes;
(function (DataTypes) {
    DataTypes["ARRAYTYPE"] = "[object Array]";
    DataTypes["OBJECTTYPE"] = "[object Object]";
    DataTypes["FUNCTIONTYPE"] = "[object Function]";
})(DataTypes || (DataTypes = {}));
const ARRAYTYPE = DataTypes.ARRAYTYPE;
const OBJECTTYPE = DataTypes.OBJECTTYPE;
const FUNCTIONTYPE = DataTypes.FUNCTIONTYPE;
function diffData(current, previous) {
    const result = {};
    if (!previous)
        return current;
    syncKeys(current, previous);
    _diff(current, previous, '', result);
    return result;
}
function syncKeys(current, previous) {
    if (current === previous)
        return;
    const rootCurrentType = getType(current);
    const rootPreType = getType(previous);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        for (let key in previous) {
            const currentValue = current[key];
            if (currentValue === undefined) {
                current[key] = null;
            }
            else {
                syncKeys(currentValue, previous[key]);
            }
        }
    }
    else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (current.length >= previous.length) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            previous.forEach((item, index) => {
                syncKeys(current[index], item);
            });
        }
    }
}
function setResult(result, k, v) {
    if (getType(v) != FUNCTIONTYPE) {
        result[k] = v;
    }
}
function _diff(current, previous, path, result) {
    if (current === previous)
        return;
    const rootCurrentType = getType(current);
    const rootPreType = getType(previous);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE ||
            (Object.keys(current).length < Object.keys(previous).length &&
                path !== '')) {
            setResult(result, path, current);
        }
        else {
            for (const key in current) {
                const currentValue = current[key];
                const preValue = previous[key];
                const currentType = getType(currentValue);
                const preType = getType(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue !== previous[key]) {
                        setResult(result, concatPathAndKey(path, key), currentValue);
                    }
                }
                else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, concatPathAndKey(path, key), currentValue);
                    }
                    else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, concatPathAndKey(path, key), currentValue);
                        }
                        else {
                            currentValue.forEach((item, index) => {
                                _diff(item, preValue[index], concatPathAndKey(path, key) + '[' + index + ']', result);
                            });
                        }
                    }
                }
                else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE ||
                        Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, concatPathAndKey(path, key), currentValue);
                    }
                    else {
                        for (let subKey in currentValue) {
                            const realPath = concatPathAndKey(path, key) +
                                (subKey.includes('.') ? `["${subKey}"]` : `.${subKey}`);
                            _diff(currentValue[subKey], preValue[subKey], realPath, result);
                        }
                    }
                }
            }
        }
    }
    else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (current.length < previous.length) {
                setResult(result, path, current);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                current.forEach((item, index) => {
                    _diff(item, previous[index], path + '[' + index + ']', result);
                });
            }
        }
    }
    else {
        setResult(result, path, current);
    }
}
function concatPathAndKey(path, key) {
    return key.includes('.')
        ? path + `["${key}"]`
        : (path == '' ? '' : path + '.') + key;
}
function getType(obj) {
    return Object.prototype.toString.call(obj);
}
function update(view, callback) {
    const patch = diffData(view.data, view._westorePrevData);
    view.setData(patch, callback);
    view._westorePrevData = clone(view.data);
}
class Store {
    constructor() {
        this.views = {};
        this._westoreViewId = 0;
    }
    bind(keyOrView, view) {
        if (arguments.length === 1) {
            this.data = keyOrView.data;
            this.views[this._westoreViewId++] = keyOrView;
        }
        else {
            //设置回 view 的 data，不然引用地址 错误
            this.data = view.data;
            this.views[keyOrView] = view;
        }
    }
    update(viewKey) {
        if (arguments.length === 1) {
            update(this.views[viewKey]);
        }
        else {
            for (const key in this.views) {
                update(this.views[key]);
            }
        }
    }
}

var index = { diffData, update, Store };

module.exports = index;
//# sourceMappingURL=index.cmd.js.map
