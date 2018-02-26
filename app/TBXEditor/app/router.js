(function (app) {

    //获取当前脚本路径
    var currentScriptFolder = (function () {
        var scripts = document.getElementsByTagName("script");
        var currentPath = scripts[scripts.length - 1].getAttribute("src");
        var index = currentPath.lastIndexOf("/");
        return currentPath.substring(0, index + 1);
    })();

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        //注意when一定要写在$stateProvider前面，注意参数前的斜杠
        $urlRouterProvider
            .when('/program', '/program/list')
            .when('/template', '/template/list');

        //这句可前可后
        $urlRouterProvider.otherwise('program');

        var template = '<div ui-view style="width: 100%;height: 100%;"></div>';

        //节目模块路由
        $stateProvider.state('program', {
            //abstract: true,
            url: '/program',
            template: template
        }).state('program.list', {
            url: '/list',
            templateUrl: currentScriptFolder + '../program/program_list.html',
            controller: 'programListController'
        }).state('program.add', {
            url: '/add',
            templateUrl: currentScriptFolder + '../program/program_add.html',
            controller: 'programAddController'
        }).state('program.edit', {
            //onExit: ['$state', '$stateParams', function ($state, $stateParams) {
            //    console.log(this);
            //    console.log($state);
            //    console.log($stateParams);
            //}],
            url: '/edit/{id}',
            templateUrl: currentScriptFolder + '../program/program_edit.html',
            controller: 'programEditController'
        }).state('program.copy', {
            url: '/copy/{id}',
            templateUrl: currentScriptFolder + '../program/program_copy.html',
            controller: 'programCopyController'
        });

        //模板模块路由
        $stateProvider.state('template', {
            //abstract: true,
            url: '/template',
            template: template
        }).state('template.list', {
            url: '/list',
            templateUrl: currentScriptFolder + '../template/template_list.html',
            controller: 'templateListController'
        });

    }]);

})(app);
