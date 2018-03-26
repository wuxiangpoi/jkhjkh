'use strict';
angular.module('sbAdminApp',['chartService'])
	.controller(
		'terminalCtrl',
		function ($scope, $rootScope, $stateParams, baseService, leafService,chartService) {
			$scope.displayed = [];
			$scope.sp = {};
			$scope.tableState = {};
			$scope.ids = [];
			$scope.idsNormal = [];
			$scope.leafes = [];
			$scope.currentGroup = $rootScope.rootGroup;
			$scope.sp.oid = $scope.currentGroup.id;
			$scope.currentLeaf = {};
			$scope.currentLeaf.id = '';
			$scope.sp.gid = '';
			$scope.init_status = $stateParams.status;
			if ($stateParams.status) {
				$scope.sp.status = $stateParams.status;
			}
			$scope.callServer = function (tableState) {
				baseService.initTable($scope, tableState, baseService.api.terminal + 'getTerminalPageList');
			}
			$scope.getTerminalGroups = function (oid) {
				leafService.getLeafes(baseService.api.terminal + 'getTerminalGroups', oid, function (data) {
					$scope.leafes = data;
				})
			}
			$scope.initPage = function () {
				$scope.callServer($scope.tableState);
				$scope.ids = [];
				$scope.idsNormal = [];
			}
			$scope.$on('emitGroupLeaf', function (e, group) {
				if ($scope.sp.oid != group.id) {
					$scope.currentGroup = group;
					$scope.sp.oid = group.id;
					$scope.sp.gid = '';
					$scope.initPage();
					$scope.getTerminalGroups($scope.sp.oid);
				}

			});
			$scope.getTerminalGroups($scope.currentGroup.id);
			$scope.addGroup = function () {
				leafService.addGroup(baseService.api.terminal + 'optGroupSave', $scope.currentGroup.id, function () {
					$scope.getTerminalGroups($scope.currentGroup.id);
					baseService.alert('添加成功', 'success');
				})
			}
			$scope.setGroup = function () {
				var gids = $scope.ids.join(',');
				leafService.setGroup(baseService.api.terminal + 'setOrganization', gids, function () {
					$scope.getTerminalGroups($scope.currentGroup.id);
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
				leafService.setLeaf(baseService.api.terminal + 'setGroupRelations', $scope.currentGroup.id, gids, $scope.leafes, function () {
					baseService.alert('设置成功', 'success', true);
					$scope.initPage();
				})
			}
			$scope.cancelLeaf = function () {
				var gids = $scope.ids.join(',');
				leafService.cancelLeaf(baseService.api.terminal + 'setGroupRelations', gids, $scope.currentLeaf, function () {
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
						leafService.editLeaf(baseService.api.terminal + 'optGroupSave', {
							id: item.id,
							name: nVal,
							oid: $scope.currentGroup.id
						}, function () {
							parent.removeClass('edit');
							$scope.getTerminalGroups($scope.currentGroup.id);
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
				leafService.delLeaf(baseService.api.terminal + 'optGroupDel', item, function () {
					$scope.getTerminalGroups($scope.currentGroup.id);
					baseService.alert('删除成功', 'success');
					$scope.currentLeaf = {};
					$scope.currentLeaf.id = '';
					$scope.sp.gid = '';
					$scope.callServer($scope.tableState);
				})

			}
			$scope.details = function (item) {
				baseService.getJson(baseService.api.terminal + 'getTerminalInfo', {
					tid: item.id
				}, function (data) {
					baseService.confirmDialog(580, '终端状态信息', data, 'tpl/terminal_details.html', function (ngDialog) {
						ngDialog.close();
					})
				});

			}

			$scope.save = function (item) {
				var modalData = {
					name: item.name,
					no: item.no,
					id: item.id,
					city_no: item.city_no,
					remark: item.remark,
					cityName: '',
					addr: item.addr
				};
				baseService.confirmDialog(580, '编辑终端信息', modalData, 'tpl/terminal_save.html', function (ngDialog, vm) {
					if (vm.modalForm.$valid) {
						var formData = {
							name: vm.data.name,
							id: vm.data.id,
							city_no: vm.data.city_no,
							remark: vm.data.remark ? vm.data.remark : '',
							cityName: '',
							addr: vm.data.addr
						}
						vm.isPosting = true;
						baseService.postData(baseService.api.terminal + 'modifyTerminalInfo', formData, function (data) {
							$rootScope.userData.root_citys = data;
							ngDialog.close();
							$scope.callServer($scope.tableState);
							baseService.alert(item ? '修改成功' : '添加成功', 'success');
						}, function (msg) {
							vm.isPosting = false;
							baseService.alert(msg, 'warning', true)
						})

					} else {
						vm.isShowMessage = true;
					}

				})
			}
			$scope.sendCommand = function (command) {
				var tids = $scope.idsNormal.join(',');

				switch (command) {
					case 2:
					case 3:
						var modalData = {
							command: command
						}
						if ($scope.idsNormal.length == 1) {
							var t = {};
							for (var i = 0; i < $scope.displayed.length; i++) {
								if ($scope.displayed[i].id == tids) {
									t = $scope.displayed[i];
								}
							}
							if (command == 3) {
								modalData.volumn = t.volumn;
							} else {
								if (t.workCron) {
									var st = t.workCron.split("/")[0];
									var et = t.workCron.split("/")[1];
									modalData.start_h = parseInt(st.split(" ")[2]);
									modalData.start_m = parseInt(st.split(" ")[1]);
									modalData.end_h = parseInt(et.split(" ")[2]);
									modalData.end_m = parseInt(et.split(" ")[1]);
									var _week = st.split(" ")[5];
									modalData.weeks = _week == '*' ? '1,2,3,4,5,6,7' : _week;
								}
							}
						}
						baseService.confirmDialog(450, $rootScope.getRootDicName('terminal_cmd', command), modalData, 'tpl/terminal_command.html', function (ngDialog, vm) {
							var postData = {
								tids: tids,
								command: command
							}
							if (command == 3) {
								if (vm.modalForm.$valid) {
									vm.isPosting = true;
									postData.volumn = vm.data.volumn;
									vm.isPosting = true;
									baseService.postData(baseService.api.terminal + 'sendCommand', postData,
										function (data) {
											ngDialog.close();
											baseService.alert('设置成功', 'success');
											$scope.callServer($scope.tableState);

										});
								} else {
									vm.isShowMessage = true;
								}

							} else {
								if (vm.modalForm.$valid && vm.data.end_h * 60 + vm.data.end_m >= vm.data.start_h * 60 + vm.data.start_m) {

									vm.isPosting = true;
									postData.start_h = vm.data.start_h;
									postData.start_m = vm.data.start_m;
									postData.end_h = vm.data.end_h;
									postData.end_m = vm.data.end_m;
									postData.week = '1,2,3,4,5,6,7'.split(',');
									baseService.postData(baseService.api.terminal + 'sendCommand', postData,
										function (data) {
											ngDialog.close();
											baseService.alert('设置成功', 'success');
											$scope.callServer($scope.tableState);

										});
								} else {
									vm.isShowMessage = true;

								}
							}


						}, function (vm) {
							vm.selectH = [];
							vm.selectM = [];
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
							vm.checkTime = function () {
								if (vm.data.start_h == 24) {
									vm.data.start_m = 0;
								}
								if (vm.data.end_h == 24) {
									vm.data.end_m = 0;
								}

							}
						})
						break;
					case 4:
					case 7:
					case 8:
						baseService.confirm('终端操作', "确定对当前选中的设备执行命令：" + $rootScope.getRootDicName('terminal_cmd', command) + "?", function (ngDialog, vm) {
							vm.isPosting = true;
							baseService.postData(baseService.api.terminal + 'sendCommand', {
									tids: tids,
									command: command
								},
								function (data) {
									ngDialog.close()
									baseService.alert('操作成功', 'success')
								});
						})
						break;
				}
			}
			$scope.checkAll = function ($event) {
				$scope.ids = [];
				$scope.idsNormal = [];
				if ($($event.currentTarget).is(':checked')) {
					for (var i = 0; i < $scope.displayed.length; i++) {
						$scope.ids.push($scope.displayed[i].id)
						if ($scope.displayed[i].status == 1) {
							$scope.idsNormal.push($scope.displayed[i].id)
						}
					}
				} else {
					$scope.ids = [];
					$scope.idsNormal = [];
				}
			}
			$scope.checkThis = function (item, $event) {
				if ($($event.currentTarget).is(':checked')) {
					$scope.ids.push(item.id);
					if (item.status == 1) {
						$scope.idsNormal.push(item.id);
					}
				} else {
					$scope.ids = baseService.removeAry($scope.ids, item.id);
					$scope.idsNormal = baseService.removeAry($scope.idsNormal, item.id);
				}
			}

			$scope.showPrograms = function (item) {
				baseService.confirmDialog(720, '播放管理', item, 'tpl/terminal_programPlay_list.html', function (ngDialog, vm) {
					var s = '';
					s = vm.ids.join(',');
					var typeTxt =  vm.programOrSchedule == 0?'节目':'排期';
					if (s.length) {
						baseService.confirm('节目操作', "确定在该设备上停播选中" + typeTxt + "?", function (ngDialog, vm1) {
							vm1.isPosting = true;
							var postUrl = vm.programOrSchedule == 0?'programManage_sendCommand_StopPlayByPids':'programManage_sendCommand_StopPlayByPids'
							baseService.postData(baseService.api.program + postUrl, {
									tid: item.id,
									type: 0, // 0停播  1 下发
									pids: s
								},
								function (data) {
									ngDialog.close();
									baseService.confirmAlert('信息提示', '操作成功', 'success', '终端命令执行成功后，将停播此节目，同时不显示在终端列表中~', '离线终端需上线后再执行命令，半小时内重复命令为您自动过滤')
								});
						})
					} else {
						baseService.alert('请至少勾选一个' + typeTxt + '再进行操作', 'warning', true);
					}
				}, function (vm) {
					vm.displayed = [];
					vm.sp = {};
					vm.sp.tid = item.id;
					vm.tableState = {};
					vm.ids = [];
					vm.showType = 0;
					vm.checkPerms = false;
					vm.programOrSchedule = 0;
					vm.callUrl = baseService.api.terminal + 'getTerminalProgramPlayPageByTid';
					vm.callServer = function (tableState) {
						baseService.initTable(vm, tableState, vm.callUrl, function (result) {
							if(result.data[0]){
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
						switch (vm.showType) {
							case 0:
								vm.callUrl = baseService.api.terminal + 'getTerminalProgramPlayPageByTid';
								break;
							case 1:
								vm.callUrl = baseService.api.terminal + 'getTerminalProgramCommandPengdingPageByTid';
								break;
						}
						vm.callServer(vm.tableState);
					}
					vm.switchTab = function (type) {
						vm.showType = type;
						vm.initTable();
					}
					vm.checkAll = function ($event) {
						vm.ids = [];
						if ($($event.currentTarget).is(':checked')) {
							for (var i = 0; i < vm.displayed.length; i++) {
								vm.ids.push(vm.displayed[i].pid)
							}
						} else {
							vm.ids = [];
						}
					}
					vm.checkThis = function (item, $event) {
						if ($($event.currentTarget).is(':checked')) {
							vm.ids.push(item.pid);

						} else {
							vm.ids = baseService.removeAry(vm.ids, item.pid);
						}
					}
					vm.showProgramOrSchedule = function (item) {
						if(item.stype && item.stype == 1){
							item.id = item.pid;
							baseService.showSchedule(item, 2, chartService);
							
						}else{
							item.pStatus = 1;
							baseService.showProgram(item);
						}
						
					}
				})
			}

			$scope.showTip = function ($event) {
				if ($($event.currentTarget).children('.btn').hasClass('disabled')) {
					$($event.currentTarget).children('.tipDiv').show();
				}
			}
			$scope.hideTip = function ($event) {
				$($event.currentTarget).children('.tipDiv').hide();
			}

			function getExportQuery() {
				var q = '';
				for (var k in $scope.sp) {
					if ($scope.sp[k]) {
						q += "&" + k + "=" + $scope.sp[k];
					}
				}
				if (q) {
					q = "?" + q.substr(1);
				}
				return q;
			}
			$scope.exportExcel = function () {
				baseService.confirm('导出表格', '确定将当前查询的所有的设备信息导出excel表格?', function (ngDialog) {
					ngDialog.close()
					window.open(baseService.api.terminal + 'exportTerminal' +
						getExportQuery());
				})
			}
		})