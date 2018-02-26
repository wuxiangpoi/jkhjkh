angular.module('sbAdminApp')
    .directive('eChartMeter', function ($http, $window, baseService) {
        function link($scope, element, attrs) {
            var myChart = echarts.init(element[0]);
            attrs.$observe('eData', function () { //通过$observe监听attrs中绑定的option属性，可以通过ajax请求数据，动态更新图表。
                var option = $scope.$eval(attrs.eData);
                if (angular.isObject(option)) {
                    myChart.setOption(option);
                    setInterval(function () {
                        function randomNum(Min, Max) {
                            var Range = Max - Min;
                            var Rand = Math.random();
                            if(Math.round(Rand * Range)==0){       
                              return Min + 1;
                            }
                            var num = Min + Math.round(Rand * Range);
                            return num;
                      }
                      
                        var addTerminal = randomNum(-100,100);
                        option.series[0].data[0].value += 1;
                        option.series[1].data[0].value += addTerminal;
                        if(option.series[1].data[0].value < 0){
                            option.series[1].data[0].value = 0;
                        }
                        option.series[2].data[0].value -= addTerminal;
                        if(option.series[2].data[0].value > option.series[2].max){
                            option.series[2].data[0].value = option.series[2].max;
                        }
                        myChart.setOption(option);
                    }, 2000)
                    $window.addEventListener('resize', function () {
                        myChart.resize();
                    })
                }
            }, true);
        }
        return {
            restrict: 'AE',
            scope: {
                source: '='
            },
            link: link
        };
    });