'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
    .controller('terminalLoginReportCtrl', function ($scope, $rootScope, baseService) {
        $scope.displayed = [];
        var day = new Date();
        $scope.year = day.getFullYear();
        $scope.month = baseService.formateDay(day.getMonth() + 1);
        $scope.sp = {
            year: $scope.year,
            month: $scope.month,
            oid: $rootScope.rootGroup.id,
            gid: ''
        };
        $scope.tableState = {};

        $scope.callServer = function (tableState) {
            baseService.initTable($scope, tableState, baseService.api.termialRegReport + 'getTermialRegPageList');
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
        $scope.formDate = function (n, o) {
            $scope.sp.year = n._i.split('-')[0];
            $scope.sp.month = n._i.split('-')[1];
            $scope.initPage();
        }
        function getExportQuery() {
            var q = '';
            for (var k in $scope.sp) {
                if ($scope.sp[k]) {
                    q += "&" + k + "=" + $scope.sp[k];
                }
            }
            if (q) {
                q = "?" + q.substr(1);
            }
            return q;
        }
       $scope.exportExcel = function () {
            baseService.confirm('导出表格', '确定将当前查询的所有的设备信息导出excel表格?', function (ngDialog) {
                ngDialog.close()
                window.open(baseService.api.termialRegReport + 'exportTermialRegList' +
                    getExportQuery());
            })
        }
    });
// JavaScript Document