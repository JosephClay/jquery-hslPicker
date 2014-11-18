var toString = ({}).toString;

var keys = Object.keys || function(obj) {
    var arr = [];
    for (var key in obj) {
        arr.push(key);
    }
    return arr;
};

module.exports = {
    isString: function(obj) {
        return toString.call(obj) === '[object String]';
    },

    isArray: Array.isArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    },

    isNumber: function(obj) {
        return toString.call(obj) === '[object Number]';
    },

    each: function(obj, iteratee) {
        if (!obj) { return obj; }

        var length = obj.length;
        if (length === +length) {
            for (var idx = 0; idx < length; idx++) {
                if (iteratee(obj[idx], idx, obj) === false) { break; }
            }
        } else {
            for (var key in obj) {
                if (iteratee(obj[key], key, obj) === false) { break; }
            }
        }

        return obj;
    },

    reduce: function(obj, iteratee, memo) {
        if (!obj) { obj = []; }

        var keys = obj.length !== +obj.length && keys(obj),
            length = (keys || obj).length,
            index = 0, currentKey;
        if (arguments.length < 3) {
            if (!length) { return memo; }
            memo = obj[keys ? keys[index++] : index++];
        }
        for (; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }

        return memo;
    }
};