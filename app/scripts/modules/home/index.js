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
	}]);
// JavaScript Document