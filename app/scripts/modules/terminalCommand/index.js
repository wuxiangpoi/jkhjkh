'use strict';
angular.module('sbAdminApp')
    .controller('terminalCommandCtrl',
        function ($scope, $rootScope, baseService) {
            $scope.displayed = [];
            $scope.sp = {};
            $scope.tableState = {};
            $scope.callServer = function (tableState) {
                baseService.initTable($scope, tableState, baseService.api.terminalCmd + 'getTerminalCmdPageList');
            }
            $scope.initPage = function () {
                $scope.tableState.pagination.start = 0;
                $scope.callServer($scope.tableState);
            }
            $scope.showProgram = function (item) {
                baseService.showProgram(item);
            }
            
        }
    )