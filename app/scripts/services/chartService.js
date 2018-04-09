var chartService = angular.module('chartService', []);
chartService.factory('chartService', ['baseService', function (baseService) {
    var chartService = {
        initChartSchedule: function (playList,mLen) {
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
                    right: '2%',
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
                            if (playData.xAxis.interval == intervalDay) {
                                var date = new Date(value);
                                var texts = [(date.getMonth() + 1), date.getDate()].join('/');
                                return ['', texts].join('\n');
                            } else {
                                var date = new Date(value);
                                var mon = '';
                                if (date.getDate() == 1) {
                                    var monTxt = date.getMonth() + 1 + '月';
                                    mon = ['', monTxt].join('\n');
                                    if (date.getMonth() + 1 == 1) {
                                        mon = [(date.getFullYear()) + '年', monTxt].join('\n');
                                    }
                                }
                                return mon;
                            }
                            // 格式化成月/日，只在第一个刻度显示年份

                        },
                        fontSize: 12,
                        showMinLabel: true,
                        showMaxLabel: false,
                        color: '#24243e'
                        
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#e2e3e6'
                        },
                    },
                    axisTick: {
                        show: false,
                        length: 8,
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
                        formatter: function (data) {
                            var playData = data.data.playData;
                            var min_max = baseService.formateDayTxt(playData.startDate) + '-' + baseService.formateDayTxt(playData.endDate);
                            var period = playData.stype == 1 ? playData.startTime + '-' + playData.endTime : '全天';
                            var str = '<span style="color:#000;font-size:16px;">' + data.data.name + '</span><br />'
                            str += '<span style="font-size:13px;">播放日期</span><span style="font-size:12px;color:#9f9f9f;"> ' + min_max + '</span><br />'
                            str += '<span style="font-size:13px;">播放时段</span><span style="font-size:12px;color:#9f9f9f;"> ' + period + '</span><br />'
                            if (playData.stype == 1) {
                                str += '<span style="font-size:13px;">播放次数</span><span style="font-size:12px;"> ' + playData.plays + '次</span>'
                            }
                            return str;
                        },
                        extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'

                    },
                    data: []
                }]
            };
            var interval, dateInterval;
            var intervalDay = 5 * 24 * 60 * 60 * 1000;
            var intervalMon = 30 * 24 * 60 * 60 * 1000;
            var minLen = mLen;
            var chartData = {};
            var dataXlist = [];
            var startDatelist = [];
            var endDatelist = [];
            if (playList.length) {
                chartData.minDate = baseService.formateDayTime(playList[0].startDate);
                chartData.maxDate = baseService.formateDayTime(playList[0].endDate);
            }
            if (playList.length > minLen) {
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
                startDatelist[i].value = baseService.formateDayTime(playList[i].startDate);
                endDatelist[i].name = playList[i].name;
                endDatelist[i].value = baseService.formateDayTime(playList[i].endDate) - baseService.formateDayTime(playList[i].startDate) + intervalDay/5;
                endDatelist[i].playData = playList[i];

                if(playList[i].stype == 1){
                    endDatelist[i].itemStyle = {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                offset: 0,
                                color: '#84fab0'
                            }, {
                                offset: 1,
                                color: '#8fd3f4'
                            }])
                        }
                    }
                }
                if (baseService.formateDayTime(playList[i].startDate) < chartData.minDate) {
                    chartData.minDate = baseService.formateDayTime(playList[i].startDate);
                }
                if (baseService.formateDayTime(playList[i].endDate) > chartData.maxDate) {
                    chartData.maxDate = baseService.formateDayTime(playList[i].endDate);
                }
            }
            dateInterval = chartData.maxDate - chartData.minDate;
            if (dateInterval > intervalMon) {
                interval = 24 * 60 * 60 * 1000;
                chartData.minDate = Date.parse(baseService.getFirstorLastDay(chartData.minDate, true));
                chartData.maxDate = chartData.minDate + intervalMon * (Math.ceil(dateInterval / intervalMon) + 1);
            } else {
                interval = intervalDay;
                chartData.minDate = chartData.minDate;
                chartData.maxDate = chartData.maxDate + intervalDay;
            }
            playData.xAxis.interval = interval;
            playData.yAxis.data = dataXlist;
            playData.series[0].data = startDatelist;
            playData.series[1].data = endDatelist;
            playData.xAxis.min = chartData.minDate;
            playData.xAxis.max = chartData.maxDate;
            return playData;
        }
    };
    return chartService;
}]);