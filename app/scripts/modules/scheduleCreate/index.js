'use strict';
angular.module('sbAdminApp', ['chartService'])
	.controller('scheduleCreateCtrl',
		function ($scope, $rootScope, $state, $stateParams, baseService, leafService, chartService) {
			$scope.displayed = [];
			$scope.sp = {};
			$scope.ids = [];
			$scope.leafes = [];
			$scope.currentGroup = $rootScope.rootGroup;
			$scope.sp.oid = $scope.currentGroup.id;
			$scope.currentLeaf = {};
			$scope.currentLeaf.id = '';
			$scope.sp.gid = '';
			$scope.sp.status = 1;
			$scope.tableState = {};
			$scope.playList = [];
			$scope.playListId = [];
			$scope.isShowMessage = false;

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
			var day = new Date();
			var oneDay = 24 * 60 * 60 * 1000;
			var today = day.getFullYear() + '-' + baseService.formateDay(day.getMonth() + 1) + '-' + baseService.formateDay(day.getDate());
			var maxDate = day.getFullYear() + 1 + '-' + baseService.formateDay(day.getMonth() + 2) + baseService.formateDay(day.getDate());
			var startDate = nowYear.toString() + getMonthNum(nowMonth) + getMonthNum(nowDate.toString());
			var endDate = (nowYear + 1).toString() + getMonthNum(nowMonth) + getMonthNum(nowDate.toString());
			var dateMap = {};
			for (var i = 0; i < 400; i++) {
				var newDay = Date.parse(today) + i * oneDay;
				var newDayFormate = day.getFullYear() + '/' + baseService.formateDay(day.getMonth() + 1) + '/' + baseService.formateDay(day.getDate());
				dateMap[(Date.parse(today) + i * oneDay)] = {};
			}
			if ($stateParams.id) {
				baseService.postData(baseService.api.programSchedule + 'getProgramScheduleById', {
					id: $stateParams.id
				}, function (schedule) {
					for (var i = 0; i < schedule.programs.length; i++) {
						var chartItem = {
							id: schedule.programs[i].id,
							name: schedule.programs[i].name,
							size: schedule.programs[i].size,
							materials: schedule.programs[i].materials,
							duration: schedule.programs[i].duration,
							content: schedule.programs[i].content,
							startDate: schedule.programs[i].startDate.toString(),
							endDate: schedule.programs[i].endDate.toString(),
							stype: schedule.programs[i].stype
						};
						if (schedule.programs[i].stype == 1) {
							chartItem.startTime = schedule.programs[i].startTime;
							chartItem.endTime = schedule.programs[i].endTime;
							chartItem.plays = schedule.programs[i].plays;
						}
						$scope.scheduleName = schedule.name;
						$scope.playListId.push(chartItem.id);
						$scope.playList.push(chartItem);

					}
					initChartSchedule();
				});
			}
			$scope.callServer = function (tableState) {
				baseService.initTable($scope, tableState, baseService.api.program + 'getProgramList');
			}

			$scope.initPage = function () {
				$scope.callServer($scope.tableState);
			}

			$scope.$on('emitGroupLeaf', function (e, group, leaf) {
				if ($scope.sp.oid != group.id || $scope.sp.gid != leaf.id) {
					$scope.currentGroup = group;
					$scope.sp.oid = group.id;
					$scope.sp.gid = leaf.id;
					$scope.initPage();
				}

			});
			$scope.showProgram = function (item) {
				item.pid = item.id;
				baseService.showProgram(item);
			}

			function initChartSchedule() {
				var minLen = 15;
				if ($scope.playList.length > minLen) {
					minLen = $scope.playList.length;
				}
				$scope.chartStyle = {
					height: minLen * 30 + 30 + 'px',
					width: '100%'
				}
				$scope.eoption = chartService.initChartSchedule($scope.playList, minLen);
				setTimeout(function () {
					$scope.$apply(); //必需手动进行脏值检测,否则数据无法刷新到界面  
				}, 1);
			}

			function checkCross(chartItem) {
				function cross(a1, a2, b1, b2, type) {
					if (b2 <= a1) {
						return false;
					} else if (b2 > a1 && b1 >= a2) {
						return false;
					} else if (b1 >= a2) {
						return false;
					} else if (b1 < a2 && b2 <= a1) {
						return false;
					} else if (b1 == a1 && b2 == a2) {
						if (type == 'date') {
							return true;
						} else {
							return false;
						}
					} else {
						return true;
					}
				}
				var result = {
					check: false
				};
				if (chartItem.stype == 0) {
					return result;
				} else {
					result.cross = [];
					if ((chartItem.eTime - chartItem.sTime) * 60 < chartItem.duration * chartItem.plays) {
						var crossItem = chartItem;
						crossItem.msg = {
							type: 4,
							info: '此时段剩余时间不足，无法添加此节目，您可以修改最少播放次数或添加其它节目试试~'
						};
						result.cross.push(crossItem);
					} else {

						for (var i = 0; i < $scope.playList.length; i++) {
							if ($scope.playList[i].stype == 1) {
								if (cross(chartItem.sTime, chartItem.eTime, $scope.playList[i].sTime, $scope.playList[i].eTime, 'time')) {
									if (cross(chartItem.startDate, chartItem.endDate, $scope.playList[i].startDate, $scope.playList[i].endDate, 'date')) {
										var crossItem = $scope.playList[i];
										crossItem.msg = {
											type: 3,
											info: '暂不能添加交叉时段，此时段与已添加的' + $scope.playList[i].startTime + '至' + $scope.playList[i].endTime + '交叉，请重新选择时段'
										};
										result.cross.push(crossItem);
									}
								}

							}
						}
						if (result.cross.length > 0) {
							result.check = true;
							return result;
						} else {
							var len = (baseService.formateDayTime(chartItem.endDate) - baseService.formateDayTime(chartItem.startDate)) / oneDay;
							var crossItem = {};
							for (var i = 0; i <= len; i++) {
								if (dateMap[baseService.formateDayTime(chartItem.startDate) + i * oneDay][chartItem.timeSel]) {
									if (dateMap[baseService.formateDayTime(chartItem.startDate) + i * oneDay][chartItem.timeSel].minuteRemain - chartItem.duration * chartItem.plays < 0) {
										var now = new Date(baseService.formateDayTime(chartItem.startDate) + i * oneDay);
										var newDay = now.getFullYear() + '-' + baseService.formateDay(now.getMonth() + 1) + '-' + baseService.formateDay(now.getDate());
										if (crossItem.date) {
											crossItem.dateInterval = crossItem.date + '至' + newDay;
										} else {
											crossItem = {
												date: newDay
											};
										}

										crossItem.msg = {
											type: 5,
											info: crossItem.dateInterval + '该时段剩余时间不足'
										};

									} else {
										dateMap[baseService.formateDayTime(chartItem.startDate) + i * oneDay][chartItem.timeSel] = {
											minuteRemain: dateMap[baseService.formateDayTime(chartItem.startDate) + i * oneDay][chartItem.timeSel].minuteRemain - chartItem.duration * chartItem.plays
										}
									}

								} else {

									dateMap[baseService.formateDayTime(chartItem.startDate) + i * oneDay][chartItem.timeSel] = {
										minuteRemain: (chartItem.eTime - chartItem.sTime) * 60 - chartItem.duration * chartItem.plays
									}
								}
							}
							if (crossItem.date) {
								result.cross.push(crossItem);
							}
							if (result.cross.length > 0) {
								result.check = true
							}
							return result;

						}


					}

				}
			}
			$scope.add = function (item) {
				baseService.confirmDialog(540, '添加排期', {}, "tpl/add_schedule.html", function (ngDialog, vm) {
					if (vm.modalForm.$valid && !vm.showTip && vm.data.endDate >= vm.data.startDate) {
						var chartItem = {
							id: item.id,
							name: item.name,
							size: item.size,
							materials: item.materials,
							duration: item.duration,
							content: item.content,
							startDate: vm.data.startDate,
							endDate: vm.data.endDate,
							stype: vm.stype
						};
						if (vm.stype == 1) {
							chartItem.sTime = vm.start_h * 60 + vm.start_m;
							chartItem.eTime = vm.end_h * 60 + vm.end_m;
							chartItem.timeSel = chartItem.sTime + '-' + chartItem.eTime;
							chartItem.startTime = baseService.formateDay(vm.start_h) + ':' + baseService.formateDay(vm.start_m);
							chartItem.endTime = baseService.formateDay(vm.end_h) + ':' + baseService.formateDay(vm.end_m);
							chartItem.plays = vm.data.plays;
						}
						var crossResult = checkCross(chartItem);
						if (crossResult.check) {
							baseService.confirmAlert('提示', crossResult.cross[0].msg.info, 'warning');
						} else {
							ngDialog.close();
							$scope.playListId.push(chartItem.id);
							$scope.playList.push(chartItem);
							initChartSchedule();
						}


					} else {
						vm.isShowMessage = true;
					}
				}, function (vm) {
					vm.instructions = '<p>1、如果排期中只有全天轮播，则每个节目轮流播放。</p>';
					vm.instructions += '<p>2、如果排期中只有按次数轮播，则按次数轮播节目在设置的时段内按比例轮播，在设置以外的时段轮流播放。如：节目A设置9:00-12:00至少播5次，节目B设置9:00-12:00至少播10次，则9:00-12:00内，节目B每播2次，节目A播1次，9:00-12:00以外的时段则按1:1轮流播放。</p>';
					vm.instructions += '<p>3、如果排期中包含以上二种播放方式，则按次数轮播节目只在设置时段内播，其它时段播放全天轮播节目。如：节目A、B按次数轮播，时段为9:00-12:00，节目C全天轮播，则9:00-12:00播节目A、B，其它时段播节目C。</p>';
					vm.start_h = 0;
					vm.start_m = 0;
					vm.end_h = 24;
					vm.end_m = 0;
					vm.showTip = false;
					vm.selectH = [];
					vm.selectM = [];

					var day = new Date();
					vm.today = today;
					vm.maxDate = maxDate;
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
					vm.data.startDate = startDate;
					vm.data.endDate = '';
					vm.stype = 0;
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
			$scope.saveSchedule = function () {
				if ($scope.scheduleNameForm.$valid) {
					baseService.confirm('提示', "确定保存排期：" + $scope.scheduleName + "?", function (ngDialog, vm) {
						vm.isPosting = true;
						baseService.postData(baseService.api.programSchedule + 'saveProgramSchedule', {
							id: $stateParams.type != 'saveAs' && $stateParams.id ? $stateParams.id : '',
							name: $scope.scheduleName,
							programs: JSON.stringify($scope.playList)
						}, function (data) {
							baseService.alert("添加成功", 'success');
							baseService.goToUrl('dashboard/schedule');
						});
					})
				} else {
					$scope.isShowMessage = true;
					window.scrollTo(0, 0);
				}

			}
			$scope.del = function (item) {
				if (item.stype == 1) {
					var len = (baseService.formateDayTime(item.endDate) - baseService.formateDayTime(item.startDate)) / oneDay;
					for (var i = 0; i <= len; i++) {
						dateMap[baseService.formateDayTime(item.startDate) + i * oneDay][item.timeSel] = {
							minuteRemain: dateMap[baseService.formateDayTime(item.startDate) + i * oneDay][item.timeSel].minuteRemain + item.duration * item.plays
						}
					}
				}

				$scope.playList = baseService.removeAryId($scope.playList, item.id);
				$scope.playListId = baseService.removeAry($scope.playListId, item.id);
				initChartSchedule();
			}
		}
	)