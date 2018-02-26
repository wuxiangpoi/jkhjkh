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
        $scope.callServer = function (tableState) {
            baseService.initTable($scope, tableState, baseService.api.admin + 'getAdminPageList');
        }
        $scope.save = function (item) {
            var postData = {
                id: item ? item.id : '',
                account: item ? item.account : '',
                name: item ? item.name : '',
                role: item ? item.role : '',
            }
            baseService.confirmDialog(540, item ? '编辑帐号' : '添加帐号', postData, 'tpl/user_save.html', function (ngDialog, vm) {
                vm.isShowMessage = false;
                if (vm.userForm.$valid) {
                    var onData = postData;
                    if(!item){
                        onData.password = baseService.md5_pwd(vm.password);
                    }
                    baseService.postData(baseService.api.admin + 'saveAdmin', onData, function () {
                        ngDialog.close();
                        baseService.alert(item ? '修改成功' : '添加成功');
                        $scope.callServer($scope.tableState);
                    })
                } else {
                    vm.isShowMessage = true;
                }

            },function(vm){
                vm.roles = [];
                baseService.getJson(baseService.api.admin + 'getAdminRoleInfoList ',{},function(data){
                    vm.roles = data;
                })
            })
        }
        $scope.changeStatus = function (item, index) {
            baseService.confirm(item.enabled == 0 ? '解禁账户' : '禁用账户', item.enabled == 0 ? '您确定解禁管理员：' + item.name : '您确定禁用管理员：' + item.name, function (ngDialog) {
                baseService.postData(baseService.api.admin + 'setAdminEnable', {
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
        $scope.resetPwd = function (item) {
            baseService.confirmDialog(540, '重置密码', {}, "tpl/reset_password.html", function (ngDialog, vm) {
                baseService.postData(baseService.api.admin + 'resetPwd', {
                    uid: item.id,
                    password: baseService.md5_pwd(vm.data.password)
                }, function (data) {
                    ngDialog.close();
                    baseService.alert("操作成功", 'success');
                });
            })
        }
    });
// JavaScript Document