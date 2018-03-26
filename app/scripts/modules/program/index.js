'use strict';
angular.module('sbAdminApp')
	.controller('programCtrl',
		function ($scope, $rootScope, $state, baseService, leafService) {
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

				function edit() {
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
						}, function () {
							leafName.text(oVal);
							editInput.val(oVal);
							parent.removeClass('edit');
						})
					}
				}
				editInput.blur(function () {
					edit();
				})
				editInput.bind("keydown", function (e) {
					// 兼容FF和IE和Opera    
					var theEvent = e || window.event;
					var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
					if (code == 13) {
						edit();
					}
				});
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
				baseService.confirmDialog(720, '播放管理', item, "tpl/terminal_list_modal.html", function (ngDialog, vm) {
					var s = vm.ids.join(',');
					if (s.length) {
						vm.isPosting = true;
						var postUrl = vm.programOrSchedule == 0?'programManage_sendCommand':'programManage_sendCommand_StopPlayByPids'
						baseService.postData(baseService.api.program + postUrl, {
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
					vm.showType = 0;
					vm.checkPerms = false;
					vm.programOrSchedule = 0;
					vm.callUrl = baseService.api.program + 'getProgramPlayPageByPid';
					vm.callServer = function (tableState) {
						baseService.initTable(vm, tableState, vm.callUrl, function (result) {
							if(result){
								if (!result.data[0].stype || result.data[0].stype == 0) {
									if ($rootScope.perms(436)) {
										vm.checkPerms = true;
									}
									vm.programOrSchedule = 0;
								} else {
									if ($rootScope.perms(445)) {
										vm.checkPerms = true;
									}
									vm.programOrSchedule = 1;
								}
							}
						});
					}
					vm.initTable = function () {
						vm.sp.resolution = '';
						vm.sp.status = '';
						switch (vm.showType) {
							case 0:
								vm.callUrl = baseService.api.program + 'getProgramPlayPageByPid';
								break;
							case 1:
								vm.callUrl = baseService.api.program + 'getProgramCommandPengdingPageByPid';
								break;
						}
						vm.currentGroup = $rootScope.rootGroup;
						vm.sp.oid = vm.currentGroup.id;
						vm.currentLeaf = {};
						vm.currentLeaf.id = '';
						vm.sp.gid = '';
						vm.callServer(vm.tableState);
					}
					vm.switchTab = function (type) {
						vm.showType = type;
						vm.initTable();
					}
					vm.$on('emitGroupLeaf', function (e, group, leaf) {
						if (vm.sp.oid != group.id || vm.sp.gid != leaf.id) {
							vm.currentGroup = group;
							vm.sp.oid = group.id;
							vm.sp.gid = leaf.id;
							vm.callServer(vm.tableState);
						}

					});
					vm.checkAll = function ($event) {
						vm.ids = [];
						if ($($event.currentTarget).is(':checked')) {
							for (var i = 0; i < vm.displayed.length; i++) {
								vm.ids.push(vm.displayed[i].tid)
							}
						} else {
							vm.ids = [];
						}
					}
					vm.checkThis = function (item, $event) {
						if ($($event.currentTarget).is(':checked')) {
							vm.ids.push(item.tid);

						} else {
							vm.ids = baseService.removeAry(vm.ids, item.tid);
						}
					}
				})
			}
			$scope.sendDown = function (item) {
				baseService.confirmDialog(820, '发布', item, "tpl/terminal_list_set_modal.html", function (ngDialog, vm) {
					var s = vm.ids.join(',');
					if (s.length) {
						if (vm.data.endDate > vm.data.startDate) {
							if (vm.showTip) {
								baseService.alert('请选择正确的播放时间段', 'warning', true);
							} else {
								vm.isPosting = true;
								baseService.postData(baseService.api.program + 'programManage_sendCommand', {
									tids: s,
									type: 1,
									pid: item.id,
									start_h: vm.start_h,
									start_m: vm.start_m,
									end_h: vm.end_h,
									end_m: vm.end_m,
									startDate: $rootScope.formateDate(vm.data.startDate),
									endDate: $rootScope.formateDate(vm.data.endDate)
								}, function () {
									ngDialog.close();
									baseService.confirmAlert('信息提示', '操作成功', 'success', '终端命令执行成功后，节目方能在终端管理->节目数量查看', '离线终端需上线后再执行命令，半小时内重复命令为您自动过滤')
									vm.callServer(vm.tableState);
								})
							}

						} else {
							baseService.alert('请选择正确的播放日期', 'warning', true);
						}

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

					vm.start_h = 0;
					vm.start_m = 0;
					vm.end_h = 24;
					vm.end_m = 0;
					vm.showTip = false;
					vm.selectH = [];
					vm.selectM = [];
					var day = new Date();
					vm.today = day.getFullYear() + '-' + baseService.formateDay(day.getMonth() + 1) + baseService.formateDay(day.getDate());
					for (var i = 0; i < 25; i++) {
						vm.selectH.push({
							name: i + '时',
							value: i
						})
					}
					for (var i = 0; i < 60; i++) {
						vm.selectM.push({
							name: i + '分',
							value: i
						})
					}

					function getMonthNum(month) {
						if (month < 10) {
							return '0' + month.toString();
						} else {
							return month.toString();
						}
					}
					vm.callServer = function (tableState) {
						baseService.initTable(vm, tableState, baseService.api.program + 'programManage_getAllOkTerminalList');
					}
					var now = new Date();
					var nowYear = now.getFullYear();
					var nowMonth = now.getMonth() + 1;
					var nowDate = now.getDate();
					vm.data.startDate = nowYear.toString() + getMonthNum(nowMonth) + getMonthNum(nowDate.toString());
					vm.data.endDate = (nowYear + 1).toString() + getMonthNum(nowMonth) + getMonthNum(nowDate.toString());
					vm.formDate = function (n, o, attr) {
						vm.data[attr] = n._i.split('-').join('');
					}
					vm.checkTime = function () {
						if (vm.start_h == 24) {
							vm.start_m = 0;
						}
						if (vm.end_h == 24) {
							vm.end_m = 0;
						}
						if (parseFloat(vm.end_h + vm.end_m / 60) <= parseFloat(vm.start_h + vm.start_m / 60)) {
							vm.showTip = true;
						} else {
							vm.showTip = false;
						}
					}
					vm.$on('emitGroupLeaf', function (e, group, leaf) {
						if (vm.sp.oid != group.id || vm.sp.gid != leaf.id) {
							vm.currentGroup = group;
							vm.sp.oid = group.id;
							vm.sp.gid = leaf.id;
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
			$scope.del = function (item) {
				baseService.confirm('删除', "确定删除节目：" + item.name + "?", function (ngDialog, vm) {
					vm.isPosting = true;
					baseService.postData(baseService.api.program + 'deleteProgram', {
						id: item.id
					}, function (data) {
						ngDialog.close()
						baseService.alert("删除成功", 'success');
						$scope.callServer($scope.tableState);
					});
				})
			}
			$scope.submitCheck = function (item) {
				baseService.confirm('提交审核', '是否提交审核？', function (ngDialog, vm) {
					vm.isPosting = true;
					baseService.postData(baseService.api.program + 'sumbmitCheck', {
						id: item.id
					}, function (data) {
						ngDialog.close();
						baseService.alert('提交成功', 'success');
						$scope.callServer($scope.tableState);
					});
				})


			}
			$scope.saveEdit = function (item) {
				$state.go('dashboard.programEdit', {
					id: item.id
				});
			}
			$scope.saveAs = function (item) {
				$state.go('dashboard.programCopy', {
					id: item.id
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
		}
	)