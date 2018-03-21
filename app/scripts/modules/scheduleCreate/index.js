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

			$scope.$on('emitGroupLeaf', function (e, group) {
				if ($scope.sp.oid != group.id) {
					$scope.currentGroup = group;
					$scope.sp.oid = group.id;
					$scope.sp.gid = '';
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
				$scope.eoption = chartService.initChartSchedule($scope.playList,minLen);
				setTimeout(function(){  
					$scope.$apply();//必需手动进行脏值检测,否则数据无法刷新到界面  
				},1); 
			}

			function checkCross(chartItem) {
				function cross(a, b, c, d) {
					if (c >= a && c < b) {
						return true;
					} else if (d > a && d <= b) {
						return true;
					} else if (c < a && d > b) {
						return true;
					} else {
						return false;
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
								if (chartItem.sTime == $scope.playList[i].sTime && chartItem.eTime == $scope.playList[i].eTime) {
									if (chartItem.startDate == $scope.playList[i].startDate && chartItem.endDate == $scope.playList[i].endDate) {
										var minuteRemain = ($scope.playList[i].eTime - $scope.playList[i].sTime) * 60;
										for (var j = 0; j < $scope.playList.length; j++) {
											if (chartItem.sTime == $scope.playList[i].sTime && chartItem.eTime == $scope.playList[i].eTime && chartItem.startDate == $scope.playList[i].startDate && chartItem.endDate == $scope.playList[i].endDate) {
												minuteRemain -= $scope.playList[i].duration * $scope.playList[i].plays
											}
										}
										if ((chartItem.eTime - chartItem.sTime) * 60 < minuteRemain) {
											var crossItem = $scope.playList[i];
											crossItem.msg = {
												type: 1,
												info: '此时段剩余时间不足，无法添加此节目，您可以修改最少播放次数或添加其它节目试试~',
												minuteRemain: minuteRemain
											};
											result.cross.push(crossItem);
										}
									} else {
										if (cross(chartItem.startDate, chartItem.endDate, $scope.playList[i].startDate, $scope.playList[i].endDate)) {
											var crossItem = $scope.playList[i];
											crossItem.msg = {
												type: 2,
												info: '暂不能添加交叉时段，此时段与已添加的' + $scope.playList[i].startDate + '至' + $scope.playList[i].endDate + '交叉，请重新选择时段'
											};
											result.cross.push(crossItem);
										}
									}

								} else {
									if (cross(chartItem.sTime, chartItem.eTime, $scope.playList[i].sTime, $scope.playList[i].sTime)) {
										if (cross(chartItem.startDate, chartItem.endDate, $scope.playList[i].startDate, $scope.playList[i].endDate)) {
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
						}

					}
					if (result.cross.length > 0) {
						result.check = true
					}
					return result;
				}
			}
			$scope.add = function (item) {
				baseService.confirmDialog(540, '添加排期', {}, "tpl/add_schedule.html", function (ngDialog, vm) {
					if (vm.modalForm.$valid && !vm.showTip && vm.data.endDate > vm.data.startDate) {
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
					vm.maxDate = day.getFullYear() + 1 + '-' + baseService.formateDay(day.getMonth() + 2) + baseService.formateDay(day.getDate());
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
							id: $stateParams.id? $stateParams.id: '',
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
				$scope.playList = baseService.removeAryId($scope.playList, item.id);
				$scope.playListId = baseService.removeAry($scope.playListId, item.id);
				initChartSchedule();
			}
		}
	)