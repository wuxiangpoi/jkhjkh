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
			controller: function ($scope, $rootScope) {
				var postData = {
					password: '',
					newPassword: '',
					reNewPassword: ''
				}
				userService.getUserSrc(function (userData) {
					$rootScope.userData = userData;
					$rootScope.current_perms = userData.current_perms;
				});
				$scope.updatePwd = function () {
					baseService.confirmDialog(540, '修改密码', postData, 'tpl/update_password.html', function (ngDialog, vm) {
						if (vm.updatePwdForm.$valid && postData.newPassword == postData.reNewPassword) {
							var updpostData = {
								password: baseService.md5_pwd(vm.data.password),
								newPassword: baseService.md5_pwd(vm.data.newPassword),
								reNewPassword: baseService.md5_pwd(vm.data.reNewPassword)
							}
							userService.updatePwd(updpostData, function () {
								ngDialog.close();
								baseService.alert('修改成功', 'success');
							})
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
				$scope.toggleFullwidth = function () {
					$('body').toggleClass('toggleFullwidth');
				}
			}
		}
	});