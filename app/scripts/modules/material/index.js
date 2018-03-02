'use strict';
angular.module('sbAdminApp')
	.controller(
		'materialCtrl',
		function ($scope, $rootScope, $stateParams, baseService, leafService) {
			$scope.displayed = [];
			$scope.sp = {};
			$scope.tableState = {};
			$scope.ids = [];
			$scope.leafes = [];
			$scope.currentGroup = $rootScope.rootGroup;
			$scope.sp.oid = $scope.currentGroup.id;
			$scope.currentLeaf = {};
			$scope.currentLeaf.id = '';
			$scope.sp.gid = '';
			$scope.callServer = function (tableState) {
				baseService.initTable($scope, tableState, baseService.api.material + 'getMaterialList');
			}
			$scope.getGroups = function (oid) {
				leafService.getLeafes(baseService.api.material + 'getMaterialGroups', oid, function (data) {
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
				leafService.addGroup(baseService.api.material + 'optGroupSave', $scope.currentGroup.id, function () {
					$scope.getGroups($scope.currentGroup.id);
					baseService.alert('添加成功', 'success');
				})
			}
			$scope.setGroup = function () {
				var gids = $scope.ids.join(',');
				leafService.setGroup(baseService.api.material + 'setOrganization', gids, function () {
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
				leafService.setLeaf(baseService.api.material + 'setGroupRelations', $scope.currentGroup.id, gids, $scope.leafes, function () {
					baseService.alert('设置成功', 'success', true);
					$scope.initPage();
				})
			}
			$scope.cancelLeaf = function () {
				var gids = $scope.ids.join(',');
				leafService.cancelLeaf(baseService.api.material + 'setGroupRelations', gids, $scope.currentLeaf, function () {
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
						leafService.editLeaf(baseService.api.material + 'optGroupSave', {
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
				leafService.delLeaf(baseService.api.material + 'optGroupDel', item, function () {
					$scope.getGroups($scope.currentGroup.id);
					baseService.alert('删除成功', 'success');
					$scope.currentLeaf = {};
					$scope.currentLeaf.id = '';
					$scope.sp.gid = '';
					$scope.callServer($scope.tableState);
				})

			}
			$scope.showMaterial = function (item) {
				baseService.showMaterial(item, 2);
			}
			$scope.submitCheck = function (item) {
				baseService.confirm('提交审核', '是否提交审核？', function (ngDialog, vm) {
					vm.isPosting = true;
					baseService.postData(baseService.api.material + 'sumbmitCheck', {
						id: item.id
					}, function (data) {
						ngDialog.close();
						baseService.alert('提交成功', 'success');
						$scope.callServer($scope.tableState);
					});
				});
			}
			$scope.saveName = function (item) {
				baseService.confirmDialog(540, '编辑', item, 'tpl/material_saveName.html', function (ngDialog, vm) {
					if (vm.modalForm.$valid) {
						
						vm.isPosting = true;
						baseService.postData(baseService.api.material + 'saveMaterial', {
							id: item.id,
							name: vm.data.name,
						}, function () {
							ngDialog.close();
							$scope.callServer($scope.tableState);
							baseService.alert(item ? '修改成功' : '添加成功', 'success');
						})

					} else {
						vm.isShowMessage = true;
					}
				});
			}
			$scope.del = function(item){
				baseService.confirm('删除素材', "确定删除素材：" + item.name + "?", function (ngDialog,vm) {
					vm.isPosting = true;
					baseService.postData(baseService.api.material + 'delMaterial', {
						id: item.id
					}, function (item) {
						ngDialog.close();
						baseService.alert("删除成功");
						$scope.callServer($scope.tableState);
					});
				});
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
		})