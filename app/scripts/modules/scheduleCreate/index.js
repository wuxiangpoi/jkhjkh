'use strict';
angular.module('sbAdminApp')
	.controller('scheduleCreateCtrl',
		function ($scope, $rootScope, $state, baseService, leafService) {
			$scope.displayed = [];
			$scope.sp = {};
			$scope.ids = [];
			$scope.leafes = [];
			$scope.currentGroup = $rootScope.rootGroup;
			$scope.sp.oid = $scope.currentGroup.id;
			$scope.currentLeaf = {};
			$scope.currentLeaf.id = '';
			$scope.sp.gid = '';
			$scope.tableState = {};
			$scope.playData = {};
			$scope.dataXlist = [];
			$scope.dataPlaylist = [];
			$scope.callServer = function (tableState) {
				baseService.initTable($scope, tableState, baseService.api.program + 'getProgramList');
			}
			$scope.getGroups = function (oid) {
				leafService.getLeafes(baseService.api.program + 'getProgramGroups', oid, function (data) {
					$scope.leafes = data;
				})
			}
			$scope.initPage = function () {
				$scope.callServer($scope.tableState);
			}

			$scope.$on('emitGroupLeaf', function (e, group) {
				if ($scope.sp.oid != group.id) {
					$scope.currentGroup = group;
					$scope.sp.oid = group.id;
					$scope.sp.gid = '';
					$scope.initPage();
					$scope.getGroups($scope.sp.oid);
				}

			});
			$scope.getGroups($scope.currentGroup.id);
			$scope.showProgram = function (item) {
				item.pid = item.id;
				baseService.showProgram(item);
			}

			function initChart() {
				var dataXlist = [];
				var dataPlaylist = [];
				for (var i = 0; i < 12; i++) {
					dataXlist.push({
						value: '啊啊啊啊啊啊啊啊'
					});
					dataPlaylist.push({
						value: '',
						name: ''
					});
				}
				for (var j = 0; j < 12; j++) {
					dataPlaylist[j].name = 'kgkh';
					dataPlaylist[j].value = 6;
				}
			}

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
					interval: 3,
					max: 24,
					position: 'top',
					axisLabel: {
						formatter: '{value}:00',
						color: '#24243e',
						margin: 20
					},
					axisLine: {
						lineStyle: {
							color: '#e2e3e6'
						}
					},
					axisTick: {
						show: true,
						length: 16,
						lineStyle: {
							color: '#e2e3e6'
						}
					},
					splitLine: {
						show: true,
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
						show: false
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
					data: [3, 5]
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
						formatter: '<span style="color:#000;font-size:16px;">{b}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#08a9d6;display:inline-block;margin-right:4px;"></span><span style="color:#08a9d6;font-size:12px;">播放时长</span><span style="color:#54e3c5;"> {c}小时</span>',
						extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'

					},
					data: []
				}]
			};
			$scope.add = function (item) {
				baseService.confirmDialog(540, '添加排期', {}, "tpl/add_schedule.html", function (ngDialog, vm) {
					if (vm.modalForm.$valid) {
						ngDialog.close();
						var interval = 5*24*60*60*1000;
						console.log(interval)
						console.log(Date.parse(vm.data.startDate.substring(0,4) + '/' + vm.data.startDate.substring(4,6) + '/' + vm.data.startDate.substring(6,8)))
						for (var i = 0; i < 12; i++) {
							$scope.dataXlist.push({
								value: '啊啊啊啊啊啊啊啊'
							});
							$scope.dataPlaylist.push({
								value: '',
								name: ''
							});
						}
						for (var j = 0; j < 12; j++) {
							$scope.dataPlaylist[j].name = item.name;
							$scope.dataPlaylist[j].value = 6;
						}
						playData.yAxis.data = $scope.dataXlist;
						playData.series[1].data = $scope.dataPlaylist;
						$scope.playData = playData;
					} else {
						vm.isShowMessage = true;
					}
				}, function (vm) {
					function getMonthNum(month) {
						if (month < 10) {
							return '0' + month.toString();
						} else {
							return month.toString();
						}
					}
					var now = new Date();
					var nowYear = now.getFullYear();
					var nowMonth = now.getMonth() + 1;
					var nowDate = now.getDate();
					vm.instructions = '<p>1、如果排期中只有全天轮播，则每个节目轮流播放。</p>';
					vm.instructions += '<p>2、如果排期中只有按次数轮播，则按时段按最少播放次数比例轮流播放；如：节目A播5次，节目B播10次，则节目B每播2次，节目A播1次。</p>';
					vm.instructions += '<p>3、如果排期中包含二种播放方式，则优先按次数轮播，有剩余时间再播放全天轮播节目。</p>';
					vm.start_h = 0;
					vm.start_m = 0;
					vm.end_h = 24;
					vm.end_m = 0;
					vm.showTip = false;
					vm.selectH = [];
					vm.selectM = [];

					var day = new Date();
					vm.today = day.getFullYear() + '-' + baseService.formateDay(day.getMonth() + 1) + baseService.formateDay(day.getDate());
					for (var i = 0; i < 25; i++) {
						vm.selectH.push({
							name: i + '时',
							value: i
						})
					}
					for (var i = 0; i < 60; i++) {
						vm.selectM.push({
							name: i + '分',
							value: i
						})
					}
					vm.data.startDate = nowYear.toString() + getMonthNum(nowMonth) + getMonthNum(nowDate.toString());
					vm.data.endDate = (nowYear + 1).toString() + getMonthNum(nowMonth) + getMonthNum(nowDate.toString());
					vm.playType = 0;
					vm.formDate = function (n, o, attr) {
						vm.data[attr] = n._i.split('-').join('');
					}
					vm.checkTime = function () {
						if (vm.start_h == 24) {
							vm.start_m = 0;
						}
						if (vm.end_h == 24) {
							vm.end_m = 0;
						}
						if (parseFloat(vm.end_h + vm.end_m / 60) <= parseFloat(vm.start_h + vm.start_m / 60)) {
							vm.showTip = true;
						} else {
							vm.showTip = false;
						}
					}
				})
			}

		}
	)