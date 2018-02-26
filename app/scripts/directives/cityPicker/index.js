'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('cityPicker', function (baseService, userService) {
		return {
			templateUrl: 'scripts/directives/cityPicker/template.html' + baseService.verson,
			restrict: 'E',
			replace: true,
			terminal: false,
			controller: function ($scope, $rootScope) {
				$scope.province = '选择省份';
				$scope.city = '选择城市';
				$scope.district = '选择区域';
				$scope.provinceSeled = {};
				$scope.citySeled = {};
				$scope.districtSeled = {};
				function emitData() {
					$scope.$emit('emitCity', $scope.emitData);
				}
				$scope.emitData = {
					province: '',
					city: '',
					district: ''
				};
				$scope.$watch('$viewContentLoaded', function () {
					$scope.provinces = ChineseDistricts[86];
				});
				$scope.provinceSel = function (c) {
					if ($scope.emitData.province != c.code) {
						$scope.emitData.province = c.code;
						$scope.emitData.city = '';
						$scope.emitData.district = '';
						$scope.province = c.address;
						$scope.city = '选择城市';
						$scope.district = '选择区域';
						$scope.citySeled = ChineseDistricts[c.code];
						$scope.districtSeled = [];
						emitData();
					} else {
						return;
					}
				}
				$scope.citySel = function (c,v) {
					if ($scope.emitData.city != c) {
						$scope.emitData.city = c;
						$scope.emitData.district = '';
						$scope.city = v;
						$scope.district = '选择区域';
						$scope.districtSeled = ChineseDistricts[c];
						emitData();
					} else {
						return;
					}
				}
				$scope.districtSel = function (c,v) {
					if ($scope.emitData.city != c) {
						$scope.emitData.district = c;
						$scope.district = v;
						emitData();
					} else {
						return;
					}
				}
			}
		}
	});