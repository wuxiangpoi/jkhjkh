'use strict';
angular.module('sbAdminApp')
	.controller(
		'materialCtrl',
		function ($scope, $rootScope, $stateParams, baseService) {
			$scope.displayed = [];
			$scope.sp = {};
			$scope.tableState = {};
			$scope.ids = [];
			$scope.idsNormal = [];

			$scope.callServer = function (tableState) {
				baseService.initTable($scope, tableState, baseService.api.material + 'getMaterialList');
			}
			
			$scope.details = function (item) {
				baseService.getJson(baseService.api.terminal + 'getTerminalInfo', {
					tid: item.id
				}, function (data) {
					baseService.confirmDialog(580, '设备详情', data, 'tpl/terminal_details.html', function (ngDialog) {

					})
				});
			}

			$scope.save = function (item) {
				baseService.confirmDialog(580, '', item, 'tpl/terminal_save.html', function (ngDialog) {
					var formData = {
						name: item.name,
						id: item.id,
						city_no: item.city_no,
						remark: item.remark,
						cityName: '',
						addr: item.addr
					}
					terminalService.saveTerminal(formData, function () {
						ngDialog.close();
						baseService.alert("编辑成功", 'success');
					})
				})
			}

			
			$scope.sendCommand = function (command) {
				var tids = $scope.ids.join(',');

				function switchCommand(commandTxt) {
					switch (commandTxt) {
						case 7:
							return '终端截屏'
							break;
						case 8:
							return '获取终端信息'
							break;
						case 9:
							return '终端初始化'
							break;
					}
				}
				switch (command) {
					case 7:
					case 8:
					case 9:
						baseService.confirm('终端操作', "确定对当前选中的设备执行命令：" + switchCommand(command) + "?", function (ngDialog) {
							baseService.postData(baseService.api.terminalCommandSend + 'sendCommand', {
									tids: tids,
									command: command
								},
								function (data) {
									ngDialog.close()
									$scope.sendCommand()
									baseService.alert('操作成功', 'success')
								});
						})
						break;
					case 31:
						baseService.confirmDialog(720, '终端升级', {}, "tpl/versionFile_list.html", function (ngDialog, vm) {
							if (vm.displayed.length == 0) {
								baseService.alert('请至少勾选一个版本文件再进行操作', 'info', true);
							} else {
								baseService.postData(baseService.api.terminalCommandSend + 'sendCommand', {
									tids: tids,
									version: vm.ids.join(','),
									command: 31
								}, function () {
									ngDialog.close();
									baseService.alert('操作成功', 'success', true);
								})
							}
						}, function (vm) {
							vm.displayed = [];
							vm.sp = {};
							vm.tableState = {};
							vm.ids = [];
							vm.callServer = function (tableState) {
								baseService.initTable(vm, tableState, baseService.api.versionFile + 'getVersionFileListPage');
							}
							vm.checkAll = function ($event) {
								vm.ids = [];
								if ($($event.currentTarget).is(':checked')) {
									for (var i = 0; i < vm.displayed.length; i++) {
										vm.ids.push(vm.displayed[i].id)
										if (vm.displayed[i].status == 1) {}
									}
								} else {
									vm.ids = [];
								}
							}
							vm.checkThis = function (item, $event) {
								if ($($event.currentTarget).is(':checked')) {
									vm.ids.push(item.id);
								} else {
									vm.ids = baseService.removeAry(vm.ids, item.id);
								}
							}
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
			$scope.details = function (item) {
				baseService.getJson(baseService.api.terminal + 'getTerminalInfo', {
					tid: item.id
				}, function (data) {
					baseService.confirmDialog(580, '终端详情', data, 'tpl/terminal_details.html', function (ngDialog) {
						ngDialog.close();
					})
				});

			}
			$scope.showPrograms = function (item) {
				baseService.confirmDialog(720, '播放列表', item, 'tpl/terminal_programPlay_list.html', function (ngDialog) {

				}, function (vm) {
					vm.displayed = [];
					vm.sp = {};
					vm.sp.tid = item.id;
					vm.sp.domain = $stateParams.id ? $stateParams.id : item.domain;
					vm.tableState = {};
					vm.callServer = function (tableState) {
						baseService.initTable(vm, tableState, baseService.api.terminal + 'getProgramPlayByTid');
					}
					vm.showPlay = function (row) {
						row.detailType = 0;
						row.nstatus = $rootScope.getCheckStatusAttr(row.status, 0);
						baseService.confirmDialog(750, '节目预览', row, "tpl/program_details.html", function (ngDialog, vm) {

						}, function (vm) {
							programService.getProgramById(row.pid, $stateParams.id ? $stateParams.id : item.domain, function (program) {
								vm.program = program;
							});
						})
					}
					vm.stop = function (row) {
						baseService.confirm('节目操作', "确定在该设备上停播节目：" + row.name + "?", function (ngDialog) {
							baseService.postData($http,
								baseService.api.terminal + 'programManage_sendCommand', {
									tids: row.id,
									type: 0, // 0停播  1 下发
									pid: row.pid
								},
								function (data) {
									ngDialog.close();
									baseService.alert('操作成功', 'success', true);
								});
						})
					}
				})
			}
			$scope.setEnabled = function (enable) {
				baseService.confirm(enable == 1 ? '启用' : '停用', enable == 1 ? '确定启用选中设备？' : '确定停用选中设备？', function (ngDialog) {
					terminalService.changeEnabled({
						tids: $scope.ids.join(','),
						enabled: enable
					}, function () {
						ngDialog.close();
						baseService.alert("操作成功", 'success');
						$scope.callServer($scope.tableState);
					})
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
			$scope.sendNotice = function () {
				var data = {
					tids: $scope.ids.join(','),
					command: 23,
					start_h: '',
					start_m: '',
					end_h: '',
					end_m: '',
					noticeText: '',
				}
				baseService.confirmDialog(540, '发布通知', data, 'tpl/send_notice.html', function (ngDialog, vm) {
					vm.isShowMessage = false;
					if (vm.noticeForm.$valid) {
						if (sentencesService.checkCon(vm.data.noticeText).sentencesArr.length) {
							baseService.alert('抱歉，您输入的内容包含被禁止的词汇，建议修改相关内容', 'warning');
							vm.data.noticeText = sentencesService.checkCon(vm.data.noticeText).sentencesCon;
						} else {
							var startTime = vm.startDate.toString() + vm.data.start_h.toString() + (vm.data.start_m/60).toString();
							var endTime = vm.endDate.toString() + vm.data.end_h.toString() + (vm.data.end_m/60).toString();
							if (parseInt(startTime) > parseInt(endTime)) {
								baseService.alert('结束时间不得小于开始时间', 'warning');
							} else {
								vm.data.startDate = $rootScope.formateDate(vm.startDate);
								vm.data.endDate = $rootScope.formateDate(vm.endDate);
								baseService.postData(baseService.api.terminalCommandSend + 'sendCommandWithNotice', vm.data, function (data) {
									ngDialog.close();
									baseService.alert('发布成功', 'success');
								})
							}
						}


					} else {
						vm.isShowMessage = true;
					}
				}, function (vm) {
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
					vm.formDate = function (n, o, attr) {
						vm[attr] = n._i.split('-').join('');
					}
				})
			}
		})