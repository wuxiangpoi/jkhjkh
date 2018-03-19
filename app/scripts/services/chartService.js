var chartService = angular.module('chartService', []);
chartService.factory('chartService', ['baseService', function (baseService) {
    var chartService = {
        initChartSchedule: function (playList) {
            var playData = {
                tooltip: {
                    trigger: 'item'
                    // axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    // 	type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    // },
                    // backgroundColor: '#fff',
                    // padding: [10, 20, 10, 5],
                    // textStyle: {
                    // 	color: '#000'
                    // },
                    // formatter: '<span style="color:#000;">{b}{c}{d}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#08a9d6;display:inline-block;margin-right:4px;"></span><span style="color:#08a9d6;font-size:12px;">播放时长</span><span style="color:#54e3c5;"> {b}小时</span>',
                    // extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'

                },
                grid: {
                    top: '0%',
                    left: '0%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    min: '',
                    interval: '',
                    max: '',
                    position: 'top',
                    axisLabel: {
                        formatter: function (value, index) {
                            if(playData.xAxis.interval == intervalDay){
                                var date = new Date(value);
                                var texts = [(date.getMonth() + 1), date.getDate()];
    
                                return texts.join('/');
                            }else{
                                var date = new Date(value);
                                var mon = '';
                                if(date.getDate() == 1){
                                    mon = date.getMonth() + 1 + '月';
                                    if(date.getMonth() + 1 == 1){
                                        mon = [(date.getFullYear()) + '年', mon].join('');
                                    }
                                }
                                return mon;
                            }
                            // 格式化成月/日，只在第一个刻度显示年份
                            
                        },
                        showMinLabel: true,
                        showMaxLabel: true,
                        color: '#24243e'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#e2e3e6'
                        },
                    },
                    axisTick: {
                        show: false,
                        length: 16,
                        lineStyle: {
                            color: '#e2e3e6'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#e2e3e6'
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    data: [],
                    axisTick: {
                        show: true,
                        length: 100,
                        lineStyle: {
                            color: '#e2e3e6'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#e2e3e6'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#e2e3e6',
                            width: 1
                        }
                    },
                    axisLabel: {
                        show: false,
                        formatter: '啊啊啊啊啊啊啊啊'
                    }
                },
                series: [{
                    name: '',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        },
                        emphasis: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0);',
                        textStyle: {
                            color: 'rgba(0,0,0,0);'
                        }
                    },
                    data: []
                }, {
                    name: '播放时长',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    barWidth: 28,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#00b0e2'
                            }, {
                                offset: 0.5,
                                color: '#1cbfef'
                            }, {
                                offset: 1,
                                color: '#3fd3ff'
                            }])
                        }
                    },
                    tooltip: {
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        },
                        backgroundColor: '#fff',
                        padding: [10, 20, 10, 5],
                        textStyle: {
                            color: '#000'
                        },
                        formatter: function(data){
                            console.log(data.data)
                            return '<span style="color:#000;font-size:16px;">' + data.data.name + '</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#08a9d6;display:inline-block;margin-right:4px;"></span><span style="color:#08a9d6;font-size:12px;">播放时长</span><span style="color:#54e3c5;"> {c}小时</span>'
                        },
                        extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'

                    },
                    data: []
                }]
            };
            var interval, dateInterval;
            var intervalDay = 5 * 24 * 60 * 60 * 1000;
            var intervalMon = 30.5 * 24 * 60 * 60 * 1000;
            var minLen = 12;
            var chartData = {};
            var dataXlist = [];
            var startDatelist = [];
            var endDatelist = [];
            if (playList.length) {
                chartData.minDate = baseService.formateDayTime(playList[0].startDate);
                chartData.maxDate = baseService.formateDayTime(playList[0].endDate);
            }
            if(playList.length > minLen){
                minLen = playList.length;
            }
            for (var j = 0; j < minLen; j++) {
                dataXlist.push({
                    value: ''
                });
                startDatelist.push({
                    value: '',
                    name: ''
                });
                endDatelist.push({
                    value: '',
                    name: ''
                });
            }
            
            for (var i = 0; i < playList.length; i++) {
                startDatelist[i].name = playList[i].name;
                startDatelist[i].value = baseService.formateDayTime(playList[i].startDate);
                endDatelist[i].name = playList[i].name;
                endDatelist[i].value = baseService.formateDayTime(playList[i].endDate)-baseService.formateDayTime(playList[i].startDate);
                
                if (baseService.formateDayTime(playList[i].startDate) < chartData.minDate) {
                    chartData.minDate = baseService.formateDayTime(playList[i].startDate);
                }
                if (baseService.formateDayTime(playList[i].endDate) > chartData.maxDate) {
                    chartData.maxDate = baseService.formateDayTime(playList[i].endDate);
                }
            }
            dateInterval = chartData.maxDate - chartData.minDate;
            if (dateInterval > intervalMon) {
                interval = intervalMon;
                chartData.minDate = Date.parse(baseService.getFirstorLastDay(chartData.minDate,true));
                chartData.maxDate = chartData.minDate + intervalMon*(Math.ceil(dateInterval/intervalMon) + 1);
            } else {
                interval = intervalDay;
                chartData.maxDate = chartData.maxDate + intervalDay;
            }
            playData.xAxis.interval = 24 * 60 * 60 * 1000;
            playData.yAxis.data = dataXlist;
            playData.series[0].data = startDatelist;
            playData.series[1].data = endDatelist;
            playData.xAxis.min = chartData.minDate;
            playData.xAxis.max = chartData.maxDate;
            console.log(playData)
            return playData;
        }
    };
    return chartService;
}]);