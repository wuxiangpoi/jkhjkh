'use strict';
angular.module('sbAdminApp')
    .controller('programCtrl',
        function ($scope, $rootScope, baseService,leafService) {
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