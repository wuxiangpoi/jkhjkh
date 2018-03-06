'use strict';
angular.module('sbAdminApp')
	.controller('programCtrl',
		function ($scope, $rootScope, baseService, leafService) {
			$scope.displayed = [];
			$scope.sp = {};
			$scope.ids = [];
			$scope.leafes = [];
			$scope.currentGroup = $rootScope.rootGroup;
			$scope.sp.oid = $scope.currentGroup.id;
			$scope.currentLeaf = {};
			$scope.currentLeaf.id = '';
			$scope.sp.gid = '';
			$scope.tableState = {};
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
				$scope.ids = [];
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
			$scope.addGroup = function () {
				leafService.addGroup(baseService.api.program + 'optGroupSave', $scope.currentGroup.id, function () {
					$scope.getGroups($scope.currentGroup.id);
					baseService.alert('添加成功', 'success');
				})
			}
			$scope.setGroup = function () {
				var gids = $scope.ids.join(',');
				leafService.setGroup(baseService.api.program + 'setOrganization', gids, function () {
					$scope.getGroups($scope.currentGroup.id);
					baseService.alert('设置成功', 'success');
					$scope.initPage();
				})
			}
			$scope.chooseLeaf = function (id, $event) {
				$scope.currentLeaf.id = id;
				$scope.sp.gid = id;
				$scope.initPage();
			}
			$scope.setLeaf = function () {
				var gids = $scope.ids.join(',');
				leafService.setLeaf(baseService.api.program + 'setGroupRelations', $scope.currentGroup.id, gids, $scope.leafes, function () {
					baseService.alert('设置成功', 'success', true);
					$scope.initPage();
				})
			}
			$scope.cancelLeaf = function () {
				var gids = $scope.ids.join(',');
				leafService.cancelLeaf(baseService.api.program + 'setGroupRelations', gids, $scope.currentLeaf, function () {
					baseService.alert('设置成功', 'success', true);
					$scope.initPage();
				})
			}
			$scope.editLeaf = function (item, $event) {
				var parent = $($event.currentTarget).parents('.leafGroup');
				var leafName = $($event.currentTarget).parents('.leafGroup').children('.leafName');
				var editInput = $($event.currentTarget).parents('.leafGroup').children('.leafEdit').children('input');
				var oVal = editInput.val();
				parent.addClass('edit');
				editInput.focus();
				editInput.blur(function () {
					var nVal = editInput.val();
					if (nVal == '' || nVal == oVal) {
						editInput.val(oVal);
						parent.removeClass('edit');
					} else {
						leafService.editLeaf(baseService.api.program + 'optGroupSave', {
							id: item.id,
							name: nVal,
							oid: $scope.currentGroup.id
						}, function () {
							parent.removeClass('edit');
							$scope.getGroups($scope.currentGroup.id);
							baseService.alert('修改成功', 'success', true);
						}, function () {
							leafName.text(oVal);
							editInput.val(oVal);
							parent.removeClass('edit');
						})
					}
				})

			}
			$scope.delLeaf = function (item) {
				leafService.delLeaf(baseService.api.program + 'optGroupDel', item, function () {
					$scope.getGroups($scope.currentGroup.id);
					baseService.alert('删除成功', 'success');
					$scope.currentLeaf = {};
					$scope.currentLeaf.id = '';
					$scope.sp.gid = '';
					$scope.callServer($scope.tableState);
				})

			}
			$scope.showProgram = function (item) {
				item.pid = item.id;
				baseService.showProgram(item);
			}
			$scope.sendCommandStopProgram = function (item) {
				item.info = '(仅显示登录账号权限范围内的终端)';
				baseService.confirmDialog(720, '播放管理', item, "tpl/terminal_list_modal.html", function (ngDialog, vm) {
					var s = vm.ids.join(',');
					if (s.length) {
						vm.isPosting = true;
						baseService.postData(baseService.api.program + 'programManage_sendCommand', {
								tids: s,
								type: 0, // 0停播  1 下发
								pid: item.id,
								oid: item.oid,
								gid: item.gid
							},
							function (data) {
								ngDialog.close();
								baseService.confirmAlert('信息提示', '操作成功', 'success', '终端命令执行成功后，将停播此节目，同时不显示在终端列表中~', '离线终端需上线后再执行命令，半小时内重复命令为您自动过滤')
							});
					} else {
						baseService.alert('请至少勾选一个终端再进行操作', 'warning', true);
					}


				}, function (vm) {
					vm.displayed = [];
					vm.sp = {};
					vm.ids = [];
					vm.currentGroup = $rootScope.rootGroup;
					vm.sp.oid = vm.currentGroup.id;
					vm.currentLeaf = {};
					vm.currentLeaf.id = '';
					vm.sp.gid = '';
					vm.sp.pid = item.id;
					vm.tableState = {};
					vm.callServer = function (tableState) {
						baseService.initTable(vm, tableState, baseService.api.program + 'getProgramPlayPageByPid');
					}
					vm.$on('emitGroupLeaf', function (e, group) {
						if (vm.sp.oid != group.id) {
							vm.currentGroup = group;
							vm.sp.oid = group.id;
							vm.sp.gid = '';
							vm.callServer(vm.tableState);
						}

					});
					vm.checkAll = function ($event) {
						baseService.checkAll($event, vm);
					}
					vm.checkThis = function (item, $event) {
						baseService.checkThis(item, $event, vm);
					}

				})
			}
			$scope.checkAll = function ($event) {
				baseService.checkAll($event, $scope);
			}
			$scope.checkThis = function (item, $event) {
				baseService.checkThis(item, $event, $scope);
			}

			$scope.showTip = function ($event) {
				if ($($event.currentTarget).children('.btn').hasClass('disabled')) {
					$($event.currentTarget).children('.tipDiv').show();
				}
			}
			$scope.hideTip = function ($event) {
				$($event.currentTarget).children('.tipDiv').hide();
			}
		}
	)