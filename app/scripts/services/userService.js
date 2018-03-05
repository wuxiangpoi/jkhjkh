var userService = angular.module('userService', []);
userService.factory('userService', ['baseService', function (baseService) {
    var userService = {
        getUserSrc: function (cb) {
            baseService.getJson(baseService.api.auth + 'getUserSrc', {}, function (userData) {
                cb(userData)
            })
        },
        login: function (postData, cb) {
            baseService.postData(baseService.api.auth + 'login', postData, function (data) {
                cb(data)
            })
        },
        updatePwd: function (postData, cb) {
            baseService.postData(baseService.api.auth + 'updatePwd', postData, function (data) {
                cb(data)
            })
        },
        logout: function () {
            baseService.postData(baseService.api.auth + 'logout', {}, function (data) {
                cb(data)
            })
        }
    };
    return userService;
}]);