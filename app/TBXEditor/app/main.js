var app = angular.module('myApp', ['ui.router', 'ngDialog', 'qmedia.editor', 'ui.sortable']);

(function (app) {

    app.controller('indexCtrl', ['$scope', function ($scope) {

        //侧边栏折叠效果
        $scope.isSidebarFold = false;
        $scope.slideFold = function () {
            $scope.isSidebarFold = !$scope.isSidebarFold;
        };

    }]);

})(app);
