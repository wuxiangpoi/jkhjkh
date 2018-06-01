'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
    .controller('programPlayReportCtrl', function ($scope, $rootScope, baseService) {
        $scope.displayed = [];
        var day = new Date();
        $scope.year = day.getFullYear();
        $scope.month = baseService.formateDay(day.getMonth() + 1);
        $scope.sp = {
            month: $scope.year + '' + $scope.month,
            oid: $rootScope.rootGroup.id,
            gid: ''
        };
        $scope.tableState = {};
        var day = new Date();
        
        $scope.callServer = function (tableState) {
            baseService.initTable($scope, tableState, baseService.api.apiUrl + '/api/programPlayMonthly/getProgramPlayMonthlyPageList');
        }
       
        $scope.initPage = function () {
            $scope.tableState.pagination.start = 0;
            $scope.callServer($scope.tableState);
        }
        $scope.$on('emitGroupLeaf', function (e, group, leaf) {
            if ($scope.sp.oid != group.id || $scope.sp.gid != leaf.id) {
                $scope.currentGroup = group;
                $scope.sp.oid = group.id;
                $scope.sp.gid = leaf.id;
                $scope.initPage();
            }

        });
        $scope.formDate = function (n, o, attr) {
            $scope.sp.month = n._i.split('-').join('');
            $scope.initPage();
        }
        $scope.showProgram = function (item) {
            item.pid = item.programId;
            baseService.showProgram(item);
        }
    });
// JavaScript Document