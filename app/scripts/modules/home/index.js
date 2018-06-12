'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
	.controller('homeCtrl', ['$scope', '$window', '$rootScope', 'baseService', function ($scope, $window, $rootScope, baseService) {
		$scope.ter_all = 0;
		$scope.ter_ok = 0;
		$scope.ter_noAct = 0;
		$scope.ter_offline = 0;

		$scope.ter_error = 0;
		baseService.getJson(baseService.api.apiUrl + 'api/auth/getMainPageReport',{},function(res){
			console.log(res)
			for(var i = 0; i < res.terminalReport.length; i ++){
				if(res.terminalReport[i].status == 1){
					$scope.ter_ok = res.terminalReport[i].allCount;
				}else if(res.terminalReport[i].status == 2){
					$scope.ter_offline = res.terminalReport[i].allCount;
				}else if(res.terminalReport[i].status == 3){
					$scope.ter_error = res.terminalReport[i].allCount;
				}else if(res.terminalReport[i].status == 0){
					$scope.ter_noAct = res.terminalReport[i].allCount;
				}
				$scope.ter_all = $scope.ter_ok + $scope.ter_offline + $scope.ter_error + $scope.ter_noAct;
			}
		})
	}]);
// JavaScript Document