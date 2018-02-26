(function (fn) {

    //查找第一个匹配项
    fn.find = function (match) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (match(this[i])) {
                return this[i];
            }
        }
        return null;
    };

    //移除元素
    fn.remove = function (item) {
        for (var i = this.length - 1; i >= 0; i--) {
            if (this[i] === item) {
                this.splice(i, 1);
            }
        }
    };

    //清空数组
    fn.clear = function () {
        this.splice(0, this.length);
    };

    function defaultConverter(item) {
        return item;
    }

    //取数组最大值
    fn.max = function (converter) {
        var len = this.length;
        if (len === 0) {
            return null;
        }
        converter = converter || defaultConverter;
        var pointer = this[0];
        var max = converter(pointer);
        for (var i = 1; i < len; i++) {
            var thisPointer = this[i];
            var cur = converter(thisPointer);
            if (max < cur) {
                pointer = thisPointer;
                max = cur;
            }
        }
        return pointer;
    };

    //取数组最小值
    fn.min = function (converter) {
        var len = this.length;
        if (len === 0) {
            return null;
        }
        converter = converter || defaultConverter;
        var pointer = this[0];
        var min = converter(pointer);
        for (var i = 1; i < len; i++) {
            var thisPointer = this[i];
            var cur = converter(thisPointer);
            if (min > cur) {
                pointer = thisPointer;
                min = cur;
            }
        }
        return pointer;
    };

    //数组去重复
    fn.unique = function (converter) {
        converter = converter || defaultConverter;
        var arr = [];
        for (var i = 0, len = this.length; i < len; i++) {
            var cur = this[i];
            var cur_convert = converter(cur);
            if (arr.every(function (item) {
                    return converter(item) !== cur_convert;
                })) {
                arr.push(cur);
            }
        }
        return arr;
    };

})(Array.prototype);
