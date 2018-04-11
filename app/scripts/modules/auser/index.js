'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
    .controller('auserCtrl', function ($scope, $rootScope, baseService) {
        $scope.displayed = [];
        $scope.sp = {};
        $scope.tableState = {};
        $scope.currentGroup = $rootScope.rootGroup;
        $scope.sp.oid = $scope.currentGroup.id;
        $scope.callServer = function (tableState) {
            baseService.initTable($scope, tableState, baseService.api.installUser + 'getInstallUserPageList');
        }
        $scope.initPage = function () {
            $scope.callServer($scope.tableState);
        }
        $scope.$on('emitGroupLeaf', function (e, group) {
            if ($scope.sp.oid != group.id) {
                $scope.currentGroup = group;
                $scope.sp.oid = group.id;
                $scope.initPage();
            }

        });
        $scope.save = function (item) {
            var postData = {
                id: item ? item.id : '',
                phone: item ? item.phone : '',
                password: item ? item.password : '',
                name: item ? item.name : '',
                oid: item ? item.oid : ''
            }
            baseService.confirmDialog(540, item ? '编辑账号' : '添加账号', postData, 'tpl/auser_save.html', function (ngDialog, vm) {
                vm.isShowMessage = false;
                if (vm.modalForm.$valid) {
                    var onData = {
                        id: item ? item.id : '',
                        phone: vm.data.phone,
                        password: vm.data.password,
                        name: vm.data.name,
                        oid: vm.currentGroup.id
                    }
                    if (!item) {
                        onData.password = baseService.md5_pwd(onData.password);
                    }
                    vm.isPosting = true;
                    baseService.postData(baseService.api.installUser + 'saveInstallUser', onData, function () {
                        ngDialog.close();
                        baseService.alert(item ? '修改成功' : '添加成功', 'success');
                        $scope.callServer($scope.tableState);
                    })
                } else {
                    vm.isShowMessage = true;
                }

            }, function (vm) {
                vm.$on('emitGroupLeaf', function (e, group, leaf) {
                    vm.currentGroup = group;
                    vm.currentGroup.id = group.id;
                })
            })
        }

        $scope.resetPwd = function (item) {
            baseService.confirmDialog(540, '重置密码', {}, "tpl/reset_password.html", function (ngDialog, vm) {
                if (vm.modalForm.$valid) {
                    vm.isPosting = true;
                    baseService.postData(baseService.api.installUser + 'resetInstallUserPassword', {
                        id: item.id,
                        password: baseService.md5_pwd(vm.data.password)
                    }, function () {
                        ngDialog.close();
                        baseService.alert('修改成功', 'success');
                        $scope.callServer($scope.tableState);
                    })
                } else {
                    vm.isShowMessage = true;
                }
            })
        }
        $scope.del = function (item) {
            baseService.confirm('删除', '您确定删除安装人员：' + item.name + '?', function (ngDialog, vm) {
                vm.isPosting = true;
                baseService.postData(baseService.api.installUser + 'deleteInstallUser', {
                    id: item.id
                }, function (data) {
                    ngDialog.close();
                    baseService.alert("删除成功", 'success');
                    $scope.callServer($scope.tableState);
                });

            })
        }
    });
// JavaScript Document