(function (app) {

    //app.config(['$httpProvider', function ($httpProvider) {
    //
    //    $httpProvider.defaults.transformRequest = function (obj) {
    //        var arr = [];
    //        for (var k in obj) {
    //            if (obj.hasOwnProperty(k)) {
    //                arr.push(encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]));
    //            }
    //        }
    //        return arr.join("&");
    //    };
    //
    //    $httpProvider.defaults.headers.post = {
    //        'Content-Type': 'application/x-www-form-urlencoded'
    //    }
    //
    //}]);

    //获取当前脚本路径
    var currentScriptFolder = (function () {
        var scripts = document.getElementsByTagName("script");
        var currentPath = scripts[scripts.length - 1].getAttribute("src");
        var index = currentPath.lastIndexOf("/");
        return currentPath.substring(0, index + 1);
    })();

    app.service('dmbdRest', ['$http', '$state', function ($http, $state) {

        var host = 'http://47.92.116.16:9090/TBXEditor/';

        //var host = currentScriptFolder + '../';

        function handlerResponse(response, success) {
            var result = response.data;
            if (result.code === 1) {
                success(result.content);
            } else if (result.code === 2) {
                //todo 跳转登录页面
                //console.log(result.message);
                $state.go("login");
            } else if (result.code === 0) {
                //todo 提示错误消息
                //console.log(result.message);
                layer.msg(result.message);
            }
        }

        //GET
        this.get = function (url, data, success) {
            var url2 = getParamsUrl(host + url, data);
            return $http.get(url2, {
                withCredentials: true
            }).then(function (response, status, headers, config) {
                handlerResponse(response, success);
            }, function (data, status, headers, config) {
                console.log(data);
            });
        };

        //POST
        this.post = function (url, data, success) {
            return $http({
                method: 'post',
                url: host + url,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true,
                transformRequest: object2Search
            }).then(function (response, status, headers, config) {
                handlerResponse(response, success);
            }, function (data, status, headers, config) {
                console.log(data);
            });
        };

        function getParamsUrl(url, data) {
            if (!data) {
                return url;
            }

            var search = object2Search(data);
            var joinChar = url.indexOf('?') >= 0 ? '&' : '?';
            return url + joinChar + search;
        }

        function object2Search(obj) {
            var arr = [];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    arr.push(encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]));
                }
            }
            return arr.join("&");
        }

    }]);

})(app);
