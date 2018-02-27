(function (window, angular) {
    angular.module('sbAdminApp')
        .config(function ($stateProvider, $urlRouterProvider, $controllerProvider) {
            var lazyDeferred = null;

            $stateProvider
                .state('login', {
                    url: '/login',
                    controller: 'loginCtrl',
                    templateUrl: 'scripts/modules/login/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'css/login/style.css',
                                    'scripts/modules/login/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('password_find', {
                    url: '/password_find',
                    controller: 'password_findCtrl',
                    templateUrl: 'scripts/modules/passwordFind/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'css/passwordFind/style.css',
                                    'scripts/modules/passwordFind/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'tpl/main.html'
        
                })
                .state('dashboard.terminal', {
                    url: '/terminal',
                    controller: 'terminalCtrl',
                    templateUrl: 'scripts/modules/terminal/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'css/terminal/style.css',
                                    'scripts/modules/terminal/index.js'
                                ]
                            })
                        }
                    }
                })
        });

})(window, window.angular);