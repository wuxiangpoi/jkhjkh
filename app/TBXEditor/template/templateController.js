(function (app) {

    app.controller('templateListController', ['$scope', 'templateService', function ($scope, service) {

        $scope.pageSize = 10;
        $scope.pageIndex = 0;
        $scope.recordCount = 0;
        $scope.doPaging = doPaging;

        //$scope.doPaged = function () {
        //    console.log(arguments);
        //};

        doPaging(0);//默认打开第一页

        //执行翻页动作
        function doPaging(pageIndex) {
            var data = {
                pageSize: $scope.pageSize,
                pageIndex: pageIndex
            };
            service.getTemplateList(data, function (data, recordCount) {
                $scope.recordCount = recordCount;
                $scope.pageIndex = pageIndex;
                $scope.templates = data;
            });
        }

    }]);

})(app);
