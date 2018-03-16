angular.module('sbAdminApp')
    .directive('eChart', function ($http, $window) {
        function link($scope, element, attrs) {
            var myChart = echarts.init(element[0]);

            $scope.$on('broadcastData', function (e, data) {
                var option = data;
                if (angular.isObject(option)) {
                    myChart.setOption(option);
                    $window.addEventListener('resize', function () {
                        myChart.resize();
                    })
                }
            });
            $scope.getDom = function() {
                console.log(element[0].offsetHeight)
                return {
                    'height': element[0].offsetHeight,
                    'width': element[0].offsetWidth
                };
            };
            $scope.$watch($scope.getDom, function() {
                console.log(1)
                myChart.resize();
            }, true);
        }
        return {
            restrict: 'AE',
            link: link
        };
    });