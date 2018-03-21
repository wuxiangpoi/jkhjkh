'use strict';
angular.module('sbAdminApp',['chartService'])
	.controller('scheduleCtrl',
		function ($scope, $rootScope, $state, baseService, leafService,chartService) {
			$scope.displayed = [];
			$scope.sp = {};
			$scope.tableState = {};
			$scope.callServer = function (tableState) {
				baseService.initTable($scope, tableState, baseService.api.programSchedule + 'getProgramSchedulePageList');
			}
			$scope.showSchedule = function (item) {
				baseService.showSchedule(item,2,chartService);
			}
			$scope.del = function (item) {
				baseService.confirm('删除', "确定删除排期：" + item.name + "?", function (ngDialog, vm) {
					vm.isPosting = true;
					baseService.postData(baseService.api.programSchedule + 'deleteProgramScheduleById', {
						id: item.id
					}, function (data) {
						ngDialog.close()
						baseService.alert("删除成功", 'success');
						$scope.callServer($scope.tableState);
					});
				})
			}
			$scope.submitCheck = function (item) {
				baseService.confirm('提交审核', '是否提交审核？', function (ngDialog, vm) {
					vm.isPosting = true;
					baseService.postData(baseService.api.programSchedule + 'submitProgramScheduleById', {
						id: item.id
					}, function (data) {
						ngDialog.close();
						baseService.alert('提交成功', 'success');
						$scope.callServer($scope.tableState);
					});
				})


			}
			$scope.saveAs = function (item) {
				$state.go('dashboard.scheduleCreate', {
					id: item.id
				});
			}
		}
	)