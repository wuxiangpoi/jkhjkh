angular.module('sbAdminApp')
	.directive('eChart', function ($http, $window) {
    function link($scope, element, attrs) {
        var myChart = echarts.init(element[0]);
        attrs.$observe('eData', function () { //通过$observe监听attrs中绑定的option属性，可以通过ajax请求数据，动态更新图表。
            var option = $scope.$eval(attrs.eData);
            if (angular.isObject(option)) {
                myChart.setOption(option);
                $window.addEventListener('resize', function () {
                    myChart.resize();
                })
            }
        }, true);
       
    }
    return {
        restrict:'AE',
        scope: {
            source:'='
        },
        link: link
    };
});