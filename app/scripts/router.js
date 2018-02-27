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
                .state('help', {
                    url: '/help',
                    controller: function($state){
                        if($state.current.name == 'help'){
                            $state.go('help.guide')
                        }
                    },
                    templateUrl: 'scripts/modules/help/main.html',
                })
                .state('help.guide', {
                    url: '/guide',
                    templateUrl: 'scripts/modules/help/guide.html',
                })
                .state('help.statement', {
                    url: '/statement',
                    templateUrl: 'scripts/modules/help/statement.html',
                })
                .state('help.agreement', {
                    url: '/agreement',
                    templateUrl: 'scripts/modules/help/agreement.html',
                })
                .state('help.partner', {
                    url: '/partner',
                    templateUrl: 'scripts/modules/help/partner.html',
                })
                .state('help.aboutus', {
                    url: '/aboutus',
                    templateUrl: 'scripts/modules/help/aboutus.html',
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'tpl/main.html'
        
                })
                .state('dashboard.home', {
                    url: '/home',
                    controller: 'homeCtrl',
                    templateUrl: 'scripts/modules/home/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'css/home/style.css',
                                    'scripts/modules/home/index.js'
                                ]
                            })
                        }
                    }
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
                .state('dashboard.materialCheck', {
                    url: '/materialCheck',
                    controller: 'materialCheckCtrl',
                    templateUrl: 'scripts/modules/materialCheck/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/materialCheck/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.terminalCommand', {
                    url: '/terminalCommand',
                    controller: 'terminalCommandCtrl',
                    templateUrl: 'scripts/modules/terminalCommand/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/terminalCommand/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.programCommand', {
                    url: '/programCommand',
                    controller: 'programCommandCtrl',
                    templateUrl: 'scripts/modules/programCommand/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/programCommand/index.js'
                                ]
                            })
                        }
                    }
                })
        });

})(window, window.angular);