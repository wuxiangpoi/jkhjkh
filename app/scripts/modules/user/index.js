'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
    .controller('userCtrl', function ($scope, $rootScope, baseService) {
        $scope.displayed = [];
        $scope.sp = {};
        $scope.tableState = {};
        $scope.currentGroup = $rootScope.rootGroup;
        $scope.sp.oid = $scope.currentGroup.id;
        $scope.callServer = function (tableState,num) {
            if(baseService.isRealNum(num)){
                tableState.pagination.start = num;
            }
            baseService.initTable($scope, tableState, baseService.api.user + 'getUserPageList');
        }
        $scope.initPage = function () {
            $scope.tableState.pagination.start = 0;
            $scope.callServer($scope.tableState);
        }
        baseService.getJson(baseService.api.role + 'getRoleList', {}, function (data) {
            $scope.roles = data;
        });
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
                account: item ? item.account : '',
                password: item ? item.password : '',
                name: item ? item.name : '',
                role: item ? item.role : '',
                oid: item ? item.oid : ''
            }
            baseService.confirmDialog(540, item ? '编辑账号' : '添加账号', postData, 'tpl/user_save.html', function (ngDialog, vm) {
                vm.isShowMessage = false;
                if (vm.modalForm.$valid) {
                    var onData = {
                        id: item ? item.id : '',
                        account: vm.data.account,
                        password: vm.data.password,
                        name: vm.data.name,
                        role: vm.data.role,
                        oid: vm.currentGroup.id
                    }
                    if (!item) {
                        onData.password = baseService.md5_pwd(onData.password);
                    }
                    if (onData.role == 1) {
                        onData.oid = '';
                    }
                    vm.isPosting = true;
                    baseService.postData(baseService.api.user + 'saveUser', onData, function () {
                        ngDialog.close();
                        baseService.alert(item ? '修改成功' : '添加成功', 'success');
                        $scope.callServer($scope.tableState);
                    })
                } else {
                    vm.isShowMessage = true;
                }

            }, function (vm) {
                vm.roles = $scope.roles;
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
                    baseService.postData(baseService.api.user + 'resetPwd', {
                        uid: item.id,
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
        $scope.changeStatus = function (item) {
            baseService.confirm(item.enabled == 0 ? '解禁账号' : '禁用账号', '您确定' + (item.enabled == 0 ? '解禁' : '禁用') + '账号：' + item.name + '?', function (ngDialog, vm) {
                vm.isPosting = true;
                baseService.postData(baseService.api.user + 'setUserEnable', {
                    uid: item.id,
                    enabled: item.enabled == 1 ? 0 : 1
                }, function (data) {
                    ngDialog.close();
                    baseService.alert("操作成功", 'success');
                    $scope.callServer($scope.tableState);
                });

            })
        }
    });
// JavaScript Document