'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('headerBar', function (baseService, userService) {
		return {
			templateUrl: 'scripts/directives/headerBar/template.html' + baseService.verson,
			restrict: 'E',
			replace: true,
			terminal: false,
			controller: function ($scope, $rootScope,$state) {
				var postData = {
					password: '',
					newPassword: '',
					reNewPassword: ''
				}
				$scope.colorArr = ['#00a0e9', '#ffb039', '#ff4040'];
				baseService.getJson(baseService.api.auth + 'getUserMessage', {}, function (data) {
					$rootScope.userMessage = [];
					$rootScope.materialCheckCounts = data.materialCheckCounts
					$rootScope.programCheckCounts = data.programCheckCounts
					if (data.materialCheckCounts && data.materialCheckCounts != 0) {
						$rootScope.userMessage.push({
							name: 'materialCheck',
							value: data.materialCheckCounts
						});
					}
					if (data.programCheckCounts && data.programCheckCounts != 0) {
						$rootScope.userMessage.push({
							name: 'programCheck',
							value: data.programCheckCounts
						});
					}
					$rootScope.domainMessage = data.domainMessage;
				})
				$scope.updatePwd = function () {
					baseService.confirmDialog(540, '修改密码', postData, 'tpl/update_password.html', function (ngDialog, vm) {
						if (vm.modalForm.$valid && postData.newPassword == postData.reNewPassword) {
							var updpostData = {
								password: baseService.md5_pwd(vm.data.password),
								newPassword: baseService.md5_pwd(vm.data.newPassword),
								reNewPassword: baseService.md5_pwd(vm.data.reNewPassword)
							}
							vm.isPosting = true;
							userService.updatePwd(updpostData, function () {
								ngDialog.close();
								baseService.alert('修改成功', 'success');
							},vm)
						} else {
							vm.isShowMessage = true;
						}
					})
				}
				$scope.logout = function () {
					baseService.confirm('退出', '是否退出登录？', function (ngDialog) {
						baseService.goToUrl('/login')
					})
				}
				$scope.progressBar = {
					width: $rootScope.userData.root_oss_percent + '%'
				}
				
				$scope.collapseVar = 0;
				console.log($state)
				$scope.check = function (x, $event) {
					if (x == $scope.collapseVar)
					  $scope.collapseVar = 0;
					else {
					  $scope.collapseVar = x;
					}
				  };
			}
		}
	});