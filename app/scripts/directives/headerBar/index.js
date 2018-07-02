'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('headerBar', function ($location, baseService, userService, $state) {
		return {
			templateUrl: 'scripts/directives/headerBar/template.html' + baseService.verson,
			restrict: 'E',
			replace: true,
			terminal: false,
			controller: function ($scope, $rootScope, $state) {
				$scope.collapseVar = 0;

				var postData = {
					password: '',
					newPassword: '',
					reNewPassword: ''
				}
				$scope.currentState = $state.current.name;

				function checkPatch() {
					if ($scope.currentState == 'dashboard.programAdd' || $scope.currentState == 'dashboard.programCopy' || $scope.currentState == 'dashboard.programEdit') {
						$('.navbar-static-side').addClass('txeit');
					} else {
						$('.navbar-static-side').removeClass('txeit');
					}
					switch ($scope.currentState) {
						case 'dashboard.home':
							$scope.collapseVar = 0
							break;

						case 'dashboard.terminal':
							$scope.collapseVar = 2
							break;
						case 'dashboard.material':
							$scope.collapseVar = 41
							break;
						case 'dashboard.program':
							$scope.collapseVar = 43
							break;
						case 'dashboard.materialCheck':
							$scope.collapseVar = 5
							break;
						case 'dashboard.programCheck':
							$scope.collapseVar = 5
							break;
						case 'dashboard.scheduleCheck':
							$scope.collapseVar = 5
							break;
						case 'dashboard.group':
							$scope.collapseVar = 3
							break;
						case 'dashboard.user':
							$scope.collapseVar = 3
							break;
						case 'dashboard.role':
							$scope.collapseVar = 3
							break;
						case 'dashboard.auser':
							$scope.collapseVar = 3
							break;
						case 'dashboard.terminalCommand':
							$scope.collapseVar = 6
							break;
						case 'dashboard.programCommand':
							$scope.collapseVar = 6
							break;
						case 'dashboard.led':
							$scope.collapseVar = 7
							break;
						case 'dashboard.ledgram':
							$scope.collapseVar = 7
							break;
						case 'dashboard.terminalLoginReport':
							$scope.collapseVar = 8
							break;
						case 'dashboard.terminalPlayReport':
							$scope.collapseVar = 8
							break;
						case 'dashboard.programPlayReport':
							$scope.collapseVar = 8
							break;
					}
				}
				checkPatch();
				$scope.colorArr = ['#00a0e9', '#ffb039', '#ff4040'];
				baseService.getJson(baseService.api.auth + 'getUserMessage', {}, function (data) {
					$rootScope.userMessage = [];
					$rootScope.materialCheckCounts = data.materialCheckCounts
					$rootScope.programCheckCounts = data.programCheckCounts
					$rootScope.programScheduleCheckCounts = data.programScheduleCheckCounts
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
					if (data.programScheduleCheckCounts && data.programScheduleCheckCounts != 0) {
						$rootScope.userMessage.push({
							name: 'scheduleCheck',
							value: data.programScheduleCheckCounts
						});
					}
					$rootScope.domainMessage = data.domainMessage;
				})
				$scope.updatePwd = function () {
					baseService.confirmDialog(540, '修改密码', {}, 'tpl/update_password.html', function (ngDialog, vm) {
						if (vm.modalForm.$valid && vm.data.newPassword == vm.data.reNewPassword) {
							var updpostData = {
								password: baseService.md5_pwd(vm.data.password),
								newPassword: baseService.md5_pwd(vm.data.newPassword),
								reNewPassword: baseService.md5_pwd(vm.data.reNewPassword)
							}
							vm.isPosting = true;
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
				$scope.progressBar = {
					width: $rootScope.userData.root_oss_percent + '%'
				}
				$scope.ledShowPerms = function () {
					if ($rootScope.userData.ledShow != 0) {

						if ($rootScope.perms(71) || $rootScope.perms(72)) {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}
				$scope.check = function (x, $event) {
					if (x == $scope.collapseVar)
						$scope.collapseVar = 0;
					else {
						$scope.collapseVar = x;
					}
				};
				$scope.$on('$stateChangeSuccess', function () {
					$scope.currentState = $state.current.name;

					checkPatch();
				});
				$scope.checkRoute = function (x, $event) {
					$scope.collapseVar = x;
					// if ($scope.currentState == 'dashboard.programAdd' || $scope.currentState == 'dashboard.programCopy' || $scope.currentState == 'dashboard.programEdit') {
					// 	$event.preventDefault();
					// 	baseService.confirm('提示', '当前节目未保存，是否离开当前页面？', function (ngDialog) {
					// 		ngDialog.close();
					// 		$location.path($event.currentTarget.href.split('#')[1]);
					// 	})
					// }
				}

				$scope.goToDetail = function (item) {
					baseService.goToUrl('/dashboard/' + item.name)
					$scope.collapseVar = 5;
				}
				$scope.updateLogo = function(){
					baseService.confirmDialog(560, '修改Logo', {
						info: '(支持jpg,png,jpeg,bmp格式的图片，不超过5M)'
					}, '/tpl/update_logo.html', function (ngDialog,vm) {
						vm.$broadcast('uploadImg',function(){});
					})
				}
			}
		}
	});