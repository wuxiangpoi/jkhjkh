/* global window, _ */

(function(window, angular) {
    'use strict';
    angular.module('sbAdminApp')
        .factory('CustomHTTPInterceptor', function($rootScope, $q, RESTSTATUS) {
            var handler = function(response) {
                var needLogin = false;
                if (response.status == RESTSTATUS['unauthorized']) {
                    needLogin = true;
                } else if (response.data && response.data.status && response.data.status == RESTSTATUS['unauthorized']) {
                    needLogin = true;
                }
                if (needLogin) {
                    window.location.href = '/login.html';
                    return;
                }
                return response;
            };
            return {
                request: function(config) {
                    if (config.url.indexOf('/web/') > -1) {
                        if (config.url.indexOf('?') > -1) {
                            config.url = config.url + '&t=' + (new Date()).getTime();
                        } else {
                            config.url = config.url + '?t=' + (new Date()).getTime();
                        }
                    }
                    if (!!config.params && config.params.hasOwnProperty('pageIndex') && config.params.hasOwnProperty('pageSize')) {
                        config.params.pageIndex = config.params.pageIndex > 0 ? config.params.pageIndex : 1;
                    }
                    config.headers['Within'] = 'XHR';
                    return config || $q.when(config);
                },
                responseError: handler,
                response: handler
            };
        });

})(window, window.angular);
