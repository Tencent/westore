var DataTypes;
(function (DataTypes) {
    DataTypes["ARRAYTYPE"] = "[object Array]";
    DataTypes["OBJECTTYPE"] = "[object Object]";
    DataTypes["FUNCTIONTYPE"] = "[object Function]";
})(DataTypes || (DataTypes = {}));
const ARRAYTYPE = DataTypes.ARRAYTYPE;
const OBJECTTYPE = DataTypes.OBJECTTYPE;
const FUNCTIONTYPE = DataTypes.FUNCTIONTYPE;
const clone = require('rfdc')();
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
        if ((current).length >= (previous).length) {
            (previous).forEach((item, index) => {
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
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(previous).length && path !== '') {
            setResult(result, path, current);
        }
        else {
            for (let key in current) {
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
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, concatPathAndKey(path, key), currentValue);
                    }
                    else {
                        for (let subKey in currentValue) {
                            const realPath = concatPathAndKey(path, key) + (subKey.includes('.') ? `["${subKey}"]` : `.${subKey}`);
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
            if (current.length < previous.length) {
                setResult(result, path, current);
            }
            else {
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
        : (path == '' ? '' : path + ".") + key;
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
    }
    bind(key, view) {
        //设置回 view 的 data，不然引用地址 错误
        this.data = view.data;
        this.views[key] = view;
    }
    update(viewKey) {
        if (viewKey) {
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

export { index as default };
//# sourceMappingURL=index.esm.js.map
