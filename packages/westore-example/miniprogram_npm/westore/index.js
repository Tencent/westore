module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1632569496947, function(require, module, exports) {
const ARRAYTYPE = '[object Array]'
const OBJECTTYPE = '[object Object]'
const FUNCTIONTYPE = '[object Function]'
const clone = require('rfdc')()

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function diffData(current, previous) {
  const result = {}
  if (!previous) return current
  syncKeys(current, previous)
  _diff(current, previous, '', result)
  return result
};exports.diffData = diffData

function syncKeys(current, previous) {
  if (current === previous) return
  const rootCurrentType = getType(current)
  const rootPreType = getType(previous)
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key in previous) {
      const currentValue = current[key]
      if (currentValue === undefined) {
        current[key] = null
      } else {
        syncKeys(currentValue, previous[key])
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= previous.length) {
      previous.forEach((item, index) => {
        syncKeys(current[index], item)
      })
    }
  }
}

function _diff(current, previous, path, result) {
  if (current === previous) return
  const rootCurrentType = getType(current)
  const rootPreType = getType(previous)
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(previous).length && path !== '') {
      setResult(result, path, current)
    } else {
      for (let key in current) {
        const currentValue = current[key]
        const preValue = previous[key]
        const currentType = getType(currentValue)
        const preType = getType(preValue)
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue !== previous[key]) {
            setResult(result, concatPathAndKey(path, key), currentValue)
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(result, concatPathAndKey(path, key), currentValue)
          } else {
            if (currentValue.length < preValue.length) {
              setResult(result, concatPathAndKey(path, key), currentValue)
            } else {
              currentValue.forEach((item, index) => {
                _diff(item, preValue[index], concatPathAndKey(path, key) + '[' + index + ']', result)
              })
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(result, concatPathAndKey(path, key), currentValue)
          } else {
            for (let subKey in currentValue) {
              const realPath = concatPathAndKey(path, key) + (subKey.includes('.') ? `["${subKey}"]` : `.${subKey}`)
              _diff(currentValue[subKey], preValue[subKey], realPath, result)
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current)
    } else {
      if (current.length < previous.length) {
        setResult(result, path, current)
      } else {
        current.forEach((item, index) => {
          _diff(item, previous[index], path + '[' + index + ']', result)
        })
      }
    }
  } else {
    setResult(result, path, current)
  }
}

function concatPathAndKey(path, key) {
  return key.includes('.')
    ? path + `["${key}"]`
    : (path == '' ? '' : path + ".") + key
}

function setResult(result, k, v) {
  if (getType(v) != FUNCTIONTYPE) {
    result[k] = v
  }
}

function getType(obj) {
  return Object.prototype.toString.call(obj)
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });function update(view, callback) {
  const patch = diffData(view.data, view._westorePrevData)
  view.setData(patch, callback)
  view._westorePrevData = clone(view.data)
};exports.update = update


if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });class Store {
  constructor() {
    this.views = {}
    this._westoreViewId = 0
  }

  bind(keyOrView, view) {
    if (arguments.length === 1) {
      this.data = keyOrView.data
      this.views[this._westoreViewId++] = keyOrView
    } else {
      //设置回 view 的 data，不然引用地址 错误
      this.data = view.data
      this.views[keyOrView] = view
    }
  }

  update(viewKey) {
    if (arguments.length === 1) {
      update(this.views[viewKey])
    } else {
      for (const key in this.views) {
        update(this.views[key])
      }
    }
  }
};exports.Store = Store
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1632569496947);
})()
//miniprogram-npm-outsideDeps=["rfdc"]
//# sourceMappingURL=index.js.map