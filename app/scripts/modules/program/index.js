'use strict';
angular.module('sbAdminApp')
    .controller('programCtrl',
        function ($scope, $rootScope, baseService) {
            $scope.displayed = [];
            $scope.sp = {};
            $scope.tableState = {};
            $scope.callServer = function (tableState) {
                baseService.initTable($scope, tableState,baseService.api.program + 'getProgramList');
            }
            $scope.showMaterial = function(item){
                baseService.showMaterial(item,2);
            }
        }
    )