'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
    .controller('programPlayDetailCtrl', function ($scope, $rootScope, baseService,$stateParams) {
        $scope.displayed = [];
        $scope.sp = {};
        $scope.tableState = {};
        $scope.programName = $stateParams.name;
        $scope.sp.programId = $stateParams.id;      
        $scope.sp.month = $stateParams.month;      
        $scope.callServer = function (tableState) {
            baseService.initTable($scope, tableState, baseService.api.apiUrl + '/api/programPlayMonthly/getProgramPlayMonthlyDetailsPageList');
        }
       
        $scope.initPage = function () {
            $scope.tableState.pagination.start = 0;
            $scope.callServer($scope.tableState);
        }
       
    });
// JavaScript Document