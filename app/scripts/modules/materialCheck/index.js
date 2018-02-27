'use strict';
angular.module('sbAdminApp')
    .controller('materialCheckCtrl',
        function ($scope, $rootScope, baseService) {
            $scope.displayed = [];
            $scope.sp = {};
            $scope.tableState = {};
            $scope.callServer = function (tableState) {
                baseService.initTable($scope, tableState, baseService.api.material + 'materialCheck_getMaterialCheckList');
            }
            $scope.showMaterial = function(item){
                baseService.showMaterial(item,2);
            }
        }
    )