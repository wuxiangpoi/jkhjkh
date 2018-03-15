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
                    controller: function ($state) {
                        if ($state.current.name == 'help') {
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
                    params: {
                        "status": null
                    },
                    templateUrl: 'scripts/modules/terminal/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/terminal/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.material', {
                    url: '/material',
                    controller: 'materialCtrl',
                    templateUrl: 'scripts/modules/material/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/material/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.program', {
                    url: '/program',
                    controller: 'programCtrl',
                    templateUrl: 'scripts/modules/program/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/program/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.group', {
                    url: '/group',
                    controller: 'groupCtrl',
                    templateUrl: 'scripts/modules/group/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'css/group/style.css',
                                    'scripts/modules/group/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.schedule', {
                    url: '/schedule',
                    controller: 'scheduleCtrl',
                    templateUrl: 'scripts/modules/schedule/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/schedule/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.scheduleCreate', {
                    url: '/scheduleCreate',
                    controller: 'scheduleCreateCtrl',
                    templateUrl: 'scripts/modules/scheduleCreate/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/scheduleCreate/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.role', {
                    url: '/role',
                    controller: 'roleCtrl',
                    templateUrl: 'scripts/modules/role/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/role/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.user', {
                    url: '/user',
                    controller: 'userCtrl',
                    templateUrl: 'scripts/modules/user/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/user/index.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.auser', {
                    url: '/auser',
                    controller: 'auserCtrl',
                    templateUrl: 'scripts/modules/auser/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/auser/index.js'
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
                .state('dashboard.programCheck', {
                    url: '/programCheck',
                    controller: 'programCheckCtrl',
                    templateUrl: 'scripts/modules/programCheck/template.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/programCheck/index.js'
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
                .state('dashboard.led', {
                    url: '/led',
                    controller: 'ledCtrl',
                    templateUrl: 'scripts/modules/led/template.html'
                    ,
                    resolve: {
                        loadMyFiles: function loadMyFiles($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/led/index.js'
                                ]
                            });
                        }
                    }
                })
                .state('dashboard.ledgram', {
                    url: '/ledgram',
                    controller: 'ledgramCtrl',
                    templateUrl: 'scripts/modules/ledgram/template.html'
                    ,
                    resolve: {
                        loadMyFiles: function loadMyFiles($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/modules/ledgram/index.js',
                                ]
                            });
                        }
                    }
                })
                .state('dashboard.programAdd', { //  下面是编辑器相关
                    url: '/programAdd/{gid}',
                    templateUrl: 'TBXEditor/program/program_add.html',
                    controller: 'programAddController'
                }).state('dashboard.programEdit', {
                    url: '/programEdit/{id}',
                    templateUrl: 'TBXEditor/program/program_edit.html',
                    controller: 'programEditController'
                }).state('dashboard.programCopy', {
                    url: '/programCopy/{id}',
                    templateUrl: 'TBXEditor/program/program_copy.html',
                    controller: 'programCopyController'
                });
        });

})(window, window.angular);