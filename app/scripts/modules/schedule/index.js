'use strict';
angular.module('sbAdminApp')
	.controller('scheduleCtrl',
		function ($scope, $rootScope, $state, baseService, leafService) {
			$scope.displayed = [];
			$scope.sp = {};
			$scope.tableState = {};
			$scope.callServer = function (tableState) {
				baseService.initTable($scope, tableState, baseService.api.program + 'getProgramList');
			}
			
		}
	)