'use strict';
angular.module('sbAdminApp',['chartService'])
    .controller('programCommandCtrl',
        function ($scope, $rootScope, baseService,chartService) {
            $scope.displayed = [];
            $scope.sp = {};
            $scope.tableState = {};
            $scope.callServer = function (tableState) {
                baseService.initTable($scope, tableState, baseService.api.programCmd + 'getProgramCmdPageList');
            }
            $scope.initPage = function () {
                $scope.tableState.pagination.start = 0;
                $scope.callServer($scope.tableState);
            }
            $scope.showProgramOrSchedule = function (item) {
                if(item.cmdCode == 21 || item.cmdCode == 22){
                    item.pStatus = 1;
                    baseService.showProgram(item);
                }else{
                    item.id = item.pid;
                    baseService.showSchedule(item, 2, chartService);
                }
                
            }
            
        }
    )