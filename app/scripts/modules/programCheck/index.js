'use strict';
angular.module('sbAdminApp')
    .controller('programCheckCtrl',
        function ($scope, $rootScope, baseService) {
            $scope.displayed = [];
            $scope.sp = {};
            $scope.tableState = {};
            $scope.callServer = function (tableState) {
                baseService.initTable($scope, tableState, baseService.api.program + 'getCheckProgramList',function(data){
                    $rootScope.programCheckCounts = data.recordsTotal;
                });
            }
            $scope.showProgram = function (item,type) {
                item.pid = item.id;
                baseService.showProgram(item,type,function(ntype){
                    baseService.confirm('节目审核', "确定" + (ntype == 3 ? "通过" : "不通过") + "节目：" + item.name + "?", function (ngDialog,vm) {
                        vm.isPosting = true;
                        var status, url;
                        if (item.status == 2) {
                            ntype == 3 ? status = 6 : status = 4;
                            url = baseService.api.program + 'check';
                        } else {
                            ntype == 3 ? status = 3 : status = 7;
                            url = baseService.api.program + 'checkFinal';
                        }
                        baseService.postData(url, {
                            id: item.id,
                            status: status
                        }, function (data) {
                            ngDialog.close();
                            baseService.alert('操作成功', 'success');
                            $scope.callServer($scope.tableState);
                        });
                    });
                });
            }
        }
    )