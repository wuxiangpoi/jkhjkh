'use strict';
angular.module('sbAdminApp')
    .controller('programCommandCtrl',
        function ($scope, $rootScope, baseService) {
            $scope.displayed = [];
            $scope.sp = {};
            $scope.tableState = {};
            $scope.callServer = function (tableState) {
                baseService.initTable($scope, tableState, baseService.api.programCmd + 'getProgramCmdPageList');
            }
            $scope.showProgram = function (item) {
                item.pStatus = 1;
                baseService.showProgram(item);
            }
            
        }
    )