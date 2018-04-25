'use strict';
angular.module('sbAdminApp',['chartService'])
    .controller('scheduleCheckCtrl',
        function ($scope, $rootScope, baseService,chartService) {
            $scope.displayed = [];
            $scope.sp = {};
            $scope.tableState = {};
            $scope.callServer = function (tableState) {
                baseService.initTable($scope, tableState, baseService.api.apiUrl + '/api/programScheduleCheck/getProgramScheduleCheckPageList',function(data){
                    $rootScope.programScheduleCheckCounts = data.recordsTotal;
                });
            }
            $scope.initPage = function () {
				$scope.tableState.pagination.start = 0;
				$scope.callServer($scope.tableState);
			}
            $scope.showSchedule = function (item,type) {
				baseService.showSchedule(item,type,chartService,function(status){
                    baseService.confirm('排期审核', "确定" + (status == 1 ? "通过" : "不通过") + "排期：" + item.name + "?", function (ngDialog,vm) {
                        vm.isPosting = true;
                        baseService.postData(baseService.api.apiUrl + '/api/programScheduleCheck/checkProgramSchedule', {
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