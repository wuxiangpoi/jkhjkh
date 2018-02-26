'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
    .controller('roleCtrl', function ($scope, $rootScope, baseService) {
        $scope.displayed = [];
        $scope.sp = {};
        $scope.tableState = {};
        $scope.callServer = function (tableState) {
            baseService.initTable($scope, tableState, baseService.api.admin + 'getAdminRoleInfoPage');
        }

        function checkPerms(scope, item, set, zNodeSel) {
            baseService.confirmDialog(540, set == 1 ? '查看权限' : '设置权限', {
                set: set
            }, "tpl/perms_set.html", function (ngDialog, vm) {
                vm.$broadcast('getZtreeData', 'getChecked');
                vm.closeThisDialog();
            }, function (vm) {
                vm.$on('emitZtreeData', function (e, data) {
                    vm.fids = data;
                    scope.fids = data;
                });
                baseService.getPerms(function (permsData) {
                    var zNodes = [];
                    for (var i = 0; i < permsData.length; i++) {
                        if (set == 1 && zNodeSel.length) {
                            if (zNodeSel.split(',').indexOf(permsData[i].id) != -1) {
                                zNodes.push({
                                    id: permsData[i].id,
                                    pId: permsData[i].pid,
                                    name: permsData[i].name,
                                })
                            }
                        } else if(set == 0){
                            zNodes.push({
                                id: permsData[i].id,
                                pId: permsData[i].pid,
                                name: permsData[i].name,
                            })
                        }

                    }
                    vm.zTreeSetting = {
                        isCheck: set == 1 ? false : true,
                        zNodes: zNodes,
                        selectedNodes: set == 0 ? zNodeSel.split(',') : ''
                    };
                })


            })
        }
        $scope.checkPerms = function (item, set) {
            checkPerms($scope, item, set, item.fids);
        };
        $scope.save = function (item) {
            var postData = {
                id: item ? item.id : '',
                name: item ? item.name : '',
                fids: item ? item.fids : '',
                remark: item ? item.remark : '',
            }
            baseService.confirmDialog(540, item ? '编辑角色' : '添加角色', postData, 'tpl/role_save.html', function (ngDialog, vm) {
                vm.isShowMessage = false;
                if (vm.roleForm.$valid) {
                    if (vm.fids && vm.fids.length) {
                        vm.data.fids = [];
                        for (var i = 0; i < vm.fids.length; i++) {
                            vm.data.fids.push(vm.fids[i].id);
                        }
                        vm.data.fids = vm.data.fids.join(',');
                        baseService.postData(baseService.api.admin + 'saveAdminRoleInfo', vm.data, function () {
                            ngDialog.close();
                            baseService.alert(item ? '修改成功' : '添加成功','success');
                            $scope.callServer($scope.tableState);
                        })
                    } else {
                        baseService.alert('请先选择权限', 'warning');
                    }


                } else {
                    vm.isShowMessage = true;
                }

            }, function (vm) {
                vm.fids = item ? item.fids.split(',') : [];
                vm.checkPerms = function (item, set) {
                    checkPerms(vm, item, set, item.fids);
                }

            })
        }
        $scope.changeStatus = function (item, index) {
            baseService.confirm(item.enabled == 0 ? '解禁账户' : '禁用账户', item.enabled == 0 ? '您确定解禁安装人员：' + item.name : '您确定禁用安装人员：' + item.name, function (ngDialog) {
                aUserService.change({
                    uid: item.id,
                    enabled: item.enabled == 0 ? 1 : 0
                }, function () {
                    ngDialog.close();
                    baseService.alert("操作成功", 'success');
                    var nArr = $scope.displayed;
                    $scope.displayed[index].enabled = $scope.displayed[index].enabled == 0 ? 1 : 0;
                    $scope.displayed = [];
                    $scope.displayed = nArr;
                })

            })
        }
        $scope.del = function (item) {
            baseService.confirm('删除', '您确定删除角色：' + item.name + '?',
                function (ngDialog) {
                    baseService.postData(baseService.api.admin + 'deleteAdminRoleInfo', {
                        id: item.id
                    }, function () {
                        ngDialog.close();
                        baseService.alert("删除成功", 'success');
                        $scope.callServer($scope.tableState);
                    })
                })
        }
    });
// JavaScript Document