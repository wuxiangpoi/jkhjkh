var kmsz = kmsz || {};

~function (util) {


    //吐司提示
    (function (util) {

        var transitionEndEvents = ['webkitTransitionEnd', 'mozTransitionEnd', 'oTransitionEnd', 'transitionend'];

        function bindEvents(types, listener, useCapture) {
            for (var i = 0, len = types.length; i < len; i++) {
                this.addEventListener(types[i], listener, useCapture);
            }
        }

        function unbindEvents(types, listener, useCapture) {
            for (var i = 0, len = types.length; i < len; i++) {
                this.removeEventListener(types[i], listener, useCapture);
            }
        }

        function toast(msg, ms, func) {
            if (typeof ms === 'function') {
                func = ms;
                ms = null;
            }
            var _toast = document.createElement('p');
            _toast.className = 'kmsz-toast';
            _toast.textContent = (msg === null || typeof msg === 'undefined') ? '' : msg;
            var _body = document.body;
            _body.appendChild(_toast);

            bindEvents.call(_toast, transitionEndEvents, function () {
                var that = this;
                unbindEvents.call(that, transitionEndEvents, arguments.callee);
                _body.removeChild(that);
                if (typeof func === "function") {
                    func();
                }
            }, false);

            window.setTimeout(function () {
                _toast.style.opacity = '0';
            }, ms || 1500);
        }

        util.toast = toast;

    })(util);

    //将URL字符串转换为URL对象
    (function (util) {
        //将查询字符串转换为对象
        function parseSearch(search) {
            var obj = {};
            var arr = search.split("&");
            for (var i = 0, len = arr.length; i < len; i++) {
                var item = arr[i];
                var index = item.indexOf("=");
                if (index >= 0) {
                    var key = item.substr(0, index);
                    var val = item.substr(index + 1);
                    obj[key] = window.decodeURIComponent(val);
                }
            }
            return obj;
        }

        //将URL字符串转换为URL对象
        function parseUrl(urlStr) {
            var url = urlStr;
            if (!url) {
                return null;
            }
            var res = {
                protocol: null,
                host: null,
                port: null,
                path: null,
                file: null,
                search: null,
                hash: null
            };
            var doubleSlashIndex = url.indexOf('://');
            if (doubleSlashIndex >= 0) {
                res.protocol = url.substr(0, doubleSlashIndex);
                url = url.substr(doubleSlashIndex + 3);
            }
            var firstSlashIndex = url.indexOf('/');
            if (firstSlashIndex >= 0) {
                var host_port = url.substring(0, firstSlashIndex);
                var colonSymbolIndex = host_port.indexOf(':');
                if (colonSymbolIndex < 0) {
                    res.host = host_port;
                } else {
                    res.host = host_port.substr(0, colonSymbolIndex);
                    res.port = window.parseInt(host_port.substr(colonSymbolIndex + 1))
                }
                url = url.substr(firstSlashIndex + 1);
            }
            var lastSlashIndex = url.lastIndexOf('/');
            if (lastSlashIndex >= 0) {
                res.path = url.substr(0, lastSlashIndex);
                url = url.substr(lastSlashIndex + 1);
            }
            var questionSymbolIndex = url.indexOf('?');
            if (questionSymbolIndex >= 0) {
                res.file = url.substr(0, questionSymbolIndex);
                url = url.substr(questionSymbolIndex + 1);
            }
            var hashSymbolIndex = url.lastIndexOf('#');
            if (hashSymbolIndex >= 0) {
                res.hash = url.substr(hashSymbolIndex + 1);
                url = url.substr(0, hashSymbolIndex);
            }
            res.search = parseSearch(url);
            return res;
        }

        util.parseUrl = parseUrl;
    })(util);


    //JSONP加载
    util.asyncLoadScript = function (url, handleSuccess, handleError) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        //处理正确结果
        script.onload = script.onreadystatechange = function (e) {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                if (head && this.parentNode) {
                    head.removeChild(this);
                }
            }
            if (typeof handleSuccess === 'function') {
                handleSuccess(e);
            }
        };
        //处理错误情况
        script.onerror = script.onabort = function (e) {
            if (head && this.parentNode) {
                head.removeChild(this);
            }
            if (typeof handleError === 'function') {
                handleError(e);
            }
        };
        //动态载入脚本
        script.type = 'text/javascript';
        script.src = url;
        head.insertBefore(script, head.firstChild);
    };


}(kmsz.util = kmsz.util || {});
