'use strict';
angular.module('sbAdminApp')
	.controller(
		'materialCtrl',
		function ($scope, $rootScope, $stateParams, baseService, leafService, FileUploader) {
			$scope.displayed = [];
			$scope.sp = {};
			$scope.tableState = {};
			$scope.ids = [];
			$scope.idsNoSubmitCheck = [];
			$scope.leafes = [];
			$scope.currentGroup = $rootScope.rootGroup;
			$scope.sp.oid = $scope.currentGroup.id;
			$scope.currentLeaf = {};
			$scope.currentLeaf.id = '';
			$scope.sp.gid = '';

			$scope.callServer = function (tableState) {
				$scope.ids = [];
				baseService.initTable($scope, tableState, baseService.api.material + 'getMaterialList');
			}
			$scope.getGroups = function (oid) {
				leafService.getLeafes(baseService.api.material + 'getMaterialGroups', oid, function (data) {
					$scope.leafes = data;
				})
			}
			$scope.initPage = function () {
				$scope.tableState.pagination.start = 0;
				$scope.ids = [];
				$scope.callServer($scope.tableState);
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

				function edit() {
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
				baseService.showMaterial(item, 1);
			}
			$scope.submitCheck = function (item) {
				baseService.confirm('提交审核', '是否提交审核？', function (ngDialog, vm) {
					vm.isPosting = true;
					var s = '';
					if (item) {
						s = item.id;
					} else {
						s = $scope.idsNoSubmitCheck.length ? $scope.idsNoSubmitCheck.join(',') : ''
					}
					if (s == '') {
						ngDialog.close();
						baseService.alert('提交成功', 'success');
						$scope.ids = [];
						$scope.idsNoSubmitCheck = [];
					} else {
						baseService.postData(baseService.api.material + 'sumbmitCheck', {
							id: s
						}, function (data) {
							ngDialog.close();
							baseService.alert('提交成功', 'success');
							$scope.callServer($scope.tableState);
							$scope.ids = [];
							$scope.idsNoSubmitCheck = [];
						});
					}

				});
			}
			$scope.saveName = function (item) {
				var modalData = {
					name: item.name
				}
				baseService.confirmDialog(540, '编辑', modalData, 'tpl/material_saveName.html', function (ngDialog, vm) {
					if (vm.modalForm.$valid) {
						vm.isPosting = true;
						baseService.postData(baseService.api.material + 'saveMaterial', {
							id: item.id,
							name: vm.data.name
						}, function () {
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
				});
			}
			$scope.del = function (item) {
				baseService.confirm('删除素材', "确定删除素材：" + item.name + "?", function (ngDialog, vm) {
					vm.isPosting = true;
					baseService.postData(baseService.api.material + 'delMaterial', {
						id: item.id
					}, function (item) {
						ngDialog.close();
						baseService.alert("删除成功", 'success');
						$scope.callServer($scope.tableState);
					});
				});
			}
			$scope.save = function () {
				baseService.confirmDialog(720, '添加素材', {}, 'tpl/material_save.html', function (ngDialog, vm) {
					if (vm.uploader.queue.length) {
						var filenameArray = [];
						for (var i = 0; i < vm.uploader.queue.length; i++) {
							vm.uploader.queue[i].oid = vm.currentGroup.id;
							vm.uploader.queue[i].gid = vm.currentLeaf.id;
							filenameArray.push(vm.uploader.queue[i].file.desc);
						}
						baseService.postData(baseService.api.material + 'addMaterial_checkUpload', {
							filenameArray: JSON.stringify(filenameArray)
						}, function (res) {
							if (res.length) {
								for (var i = 0; i < res.length; i++) {
									vm.uploader.queue[res[i].index].message = res[i].message;
									vm.uploader.queue[res[i].index].oname = res[i].name;
								}
							} else {
								vm.closeThisDialog();
								$rootScope.$broadcast('callUploader', vm.uploader);
							}
						})


					} else {
						baseService.alert('请先选择文件', 'warning', true);
					}
				}, function (vm) {

					vm.sp = {};
					vm.sp.oid = '';
					vm.currentGroup = $rootScope.rootGroup;
					vm.sp.oid = vm.currentGroup.id;
					vm.$on('emitGroupLeaf', function (e, group, leaf) {
						if (vm.sp.oid != group.id) {
							vm.currentGroup = group;
						}

					});
					var uploader = vm.uploader = new FileUploader({
						url: 'http://192.168.1.158:9090/client/oss/handleUpload'
					});

					// FILTERS

					vm.uploader.filters.push({
						name: 'customFilter',
						fn: function fn(item /*{File|FileLikeObject}*/ , options) {

							if (this.queue.length >= 10) {
								baseService.alert('上传队列达到最大值10个', 'warining', true);
								return false;
							}

							var ctype = item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase();
							var type = ',' + ctype + ',';
							var audiofile_type = ',mp3,';
							var programfile_type = ',zip,';
							// var type = ',' + item.type.slice(item.type.lastIndexOf('/') + 1) + ',';
							//var file_type = vm.data.type == '0' ? $rootScope.getRootDicNameStrs('image_format') : $rootScope.getRootDicNameStrs('video_format');
							var imgfile_type = vm.imgfile_type = $rootScope.getRootDicNameStrs('image_format');
							var videofile_type = vm.videofile_type = $rootScope.getRootDicNameStrs('video_format');
							if ((',' + imgfile_type.toLowerCase() + ',').indexOf(type) != -1 || (',' + videofile_type.toLowerCase() + ',').indexOf(type) != -1 || (',' + audiofile_type.toLowerCase() + ',').indexOf(type) != -1 || (',' + programfile_type.toLowerCase() + ',').indexOf(type) != -1) {
								if ((',' + imgfile_type.toLowerCase() + ',').indexOf(type) != -1) {
									if (item.size > 10 * 1024 * 1024) {
										baseService.alert('不得上传大于10Mb的图片', 'warning', true);
									} else {
										return true;
									}
								}
								 else if ((',' + audiofile_type.toLowerCase() + ',').indexOf(type) != -1) {
									if (item.size > 10 * 1024 * 1024) {
										baseService.alert('不得上传大于10Mb的音乐', 'warning', true);
									} else {
										return true;
									}
								}
								else {
									if (item.size > 500 * 1024 * 1024) {
										baseService.alert('不得上传大于500Mb的视频', 'warning', true);
									} else {
										return true;
									}
								}
							} else {
								baseService.confirmAlert('提示', '上传的文件格式平台暂时不支持，目前支持的图片格式是:' + imgfile_type + '，目前支持的视频格式是:' + videofile_type+ '，目前支持的音频格式是:mp3', 'warning');
								return false;
							}
						}
					});

					vm.uploader.onAfterAddingFile = function (fileItem) {
						var fileName = fileItem.file.name.split('.');
						fileName.pop();
						fileItem.file.desc = fileName.join(',');
					};

					vm.uploader.onCompleteItem = function (fileItem, response, status, headers) {
						if (response.code != 1) {
							fileItem.isSuccess = false;
							fileItem.isError = true;
							fileItem.errorMsg = response.message;
						}else{
							$scope.initPage();
						}
					};
				});
			};
			$scope.checkAll = function ($event) {
				$scope.ids = [];
				$scope.idsNoSubmitCheck = [];
				if ($($event.currentTarget).is(':checked')) {
					for (var i = 0; i < $scope.displayed.length; i++) {
						$scope.ids.push($scope.displayed[i].id)
						if ($scope.displayed[i].status == 0) {
							$scope.idsNoSubmitCheck.push($scope.displayed[i].id)
						}
					}
				} else {
					$scope.ids = [];
					$scope.idsNoSubmitCheck = [];
				}
			}
			$scope.checkThis = function (item, $event) {
				if ($($event.currentTarget).is(':checked')) {
					$scope.ids.push(item.id);
					if (item.status == 0) {
						$scope.idsNoSubmitCheck.push(item.id);
					}
				} else {
					$scope.ids = baseService.removeAry($scope.ids, item.id);
					$scope.idsNoSubmitCheck = baseService.removeAry($scope.idsNoSubmitCheck, item.id);
				}
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