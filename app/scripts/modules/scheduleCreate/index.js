'use strict';
angular.module('sbAdminApp', ['chartService'])
	.controller('scheduleCreateCtrl',
		function ($scope, $rootScope, $state, baseService, leafService, chartService) {
			$scope.displayed = [];
			$scope.sp = {};
			$scope.ids = [];
			$scope.leafes = [];
			$scope.currentGroup = $rootScope.rootGroup;
			$scope.sp.oid = $scope.currentGroup.id;
			$scope.currentLeaf = {};
			$scope.currentLeaf.id = '';
			$scope.sp.gid = '';
			$scope.sp.length = 10;
			$scope.tableState = {};
			$scope.playList = [];
			$scope.playListId = [];
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
			$scope.add = function (item) {
				baseService.confirmDialog(540, '添加排期', {}, "tpl/add_schedule.html", function (ngDialog, vm) {
					if (vm.modalForm.$valid) {
						// if(){

						// }else{

						// }
						ngDialog.close();
						var chartItem = {
							id: item.id,
							name: item.name,
							playType: vm.playType,
							startDate: vm.data.startDate,
							endDate: vm.data.endDate
						};
						$scope.playListId.push(chartItem.id);
						$scope.playList.push(chartItem);
						var minLen = 12;
						if ($scope.playList.length > minLen) {
							minLen = $scope.playList.length;
						}
						$scope.chartStyle = {
							'width': '100%',
							'height': minLen * 30 + 30 + 'px',
							'position': 'relative'
						}
						$scope.$broadcast('broadcastData', chartService.initChartSchedule($scope.playList));
						
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
			$scope.del = function (item) {
				$scope.playList = baseService.removeAryId($scope.playList, item.id);
				$scope.playListId = baseService.removeAry($scope.playListId, item.id);
				$scope.$broadcast('broadcastData', chartService.initChartSchedule($scope.playList));
			}
		}
	)