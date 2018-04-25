'use strict';
angular.module('sbAdminApp')
    .controller('materialCheckCtrl',
        function ($scope, $rootScope, baseService) {
            $scope.displayed = [];
            $scope.sp = {};
            $scope.tableState = {};
            $scope.callServer = function (tableState) {
                baseService.initTable($scope, tableState, baseService.api.material + 'materialCheck_getMaterialCheckList', function (data) {
                    $rootScope.materialCheckCounts = data.recordsTotal;
                });
            }
            $scope.initPage = function () {
				$scope.tableState.pagination.start = 0;
				$scope.callServer($scope.tableState);
			}
            $scope.showMaterial = function (item, type) {
                baseService.showMaterial(item, type, function (status) {
                    baseService.confirm('素材审核', "确定" + (status == 3 ? "通过" : "不通过") + "素材：" + item.name + "?", function (ngDialog, vm) {
                        vm.isPosting = true;
                        baseService.postData(baseService.api.material + 'materialCheck_check', {
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