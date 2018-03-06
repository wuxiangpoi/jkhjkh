'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
var app = angular.module('sbAdminApp', [
        'ngDialog',
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'angularFileUpload',
        'moment-picker',
        'uiSlider',
        'smart-table',
        'me-lazyload',
        'ngMessages',
        'baseService',
        'userService',
        'leafService',
        'qmedia.editor'
    ]).run(function ($rootScope, $state, $location, $stateParams, $filter, ngDialog, baseService, userService) {
        $rootScope.paginationNumber = [10, 15, 20, 30, 50, 100];
        $rootScope.$on('$stateChangeSuccess', function () {
            window.scrollTo(0, 0);
        });
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            ngDialog.close();
            if (!$rootScope.userData) {
                if (toState.name.split('.')[0] == 'dashboard') {
                    event.preventDefault();
                    userService.getUserSrc(function (userData) {
                        $rootScope.userData = userData;
                        $rootScope.current_perms = userData.current_perms;
                        for (var i = 0; i < userData.root_organizations.length; i++) {
                            if (userData.root_organizations[i].pid == '') {
                                $rootScope.rootGroup = userData.root_organizations[i];
                            }
                        }
                        $state.go(toState.name);
                    });
                }
            }

        });
        $rootScope.formateDate = function (date) {
            if (date) {
                return date.toString().substring(0, 4) + '-' + date.toString().substring(4, 6) + '-' + date.toString().substring(6, 8);
            }
        }
        $rootScope.getRootDicName = function (key, did) {
            var ar = $rootScope.userData.root_dic[key];
            for (var i in ar) {
                if (ar.hasOwnProperty(i)) {

                    var _dic = ar[i];
                    if (_dic.val == did) {
                        return _dic.name;
                    }
                }
            }
            return "";

        }
        $rootScope.getCityName = function (cno) {
            for (var i in $rootScope.userData.root_citys) {
                if ($rootScope.userData.root_citys.hasOwnProperty(i)) {
    
                    if (cno == $rootScope.userData.root_citys[i].key) {
                        return $rootScope.userData.root_citys[i].value;
                    }
    
                }
            }
        }
        $rootScope.perms = function (rid) {
            return ("," + $rootScope.userData.current_perms + ",").indexOf("," + rid + ",") > -1 ? true : false;
        }
        $rootScope.dmbdOSSImageUrlResizeFilter = function (imgUrl, size) {
            var joinChar = imgUrl.indexOf('?') >= 0 ? '&' : '?';
            return imgUrl + joinChar + 'x-oss-process=image/resize,m_lfit,' + size + ',w_' + size;
        }
        $rootScope.getRootDicNameStrs = function (key) {
            var ar = $rootScope.userData.root_dic[key];
            var s = '';
            for (var i = 0; i < ar.length; i++) {
                var _dic = ar[i];
                s += "," + _dic.name;
            }
            if (s) {
                s = s.substr(1);
            }
    
            return s;
            
        }
    })
    .config(['$urlRouterProvider', '$locationProvider',
        function ($urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise('/login');
        }
    ])
    .config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            closeByDocument: true
        });
    }])
    .config(['momentPickerProvider', function (momentPickerProvider) {
        momentPickerProvider.options({
            locale: "zh-cn",
        });
    }])
    .run(['fileUploaderOptions', function (fileUploaderOptions) {
        fileUploaderOptions.autoUpload = false;
    }]);