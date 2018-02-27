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
        'smart-table',
        'ngMessages',
        'baseService',
        'userService',
        'qmedia.editor'
    ]).run(function ($rootScope, $state, $location, $stateParams, $filter, ngDialog, baseService,userService) {
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
        fileUploaderOptions.autoUpload = true;
        fileUploaderOptions.url = "/imgapi/image/upload"
    }]);