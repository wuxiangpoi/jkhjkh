'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
    .controller('terminalPlayReportCtrl', function ($scope, $rootScope, baseService,$stateParams) {
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

        $scope.callServer = function (tableState) {
            if ($stateParams.pos){
                if(!tableState.pagination.init){
                    tableState.pagination = {};
                    tableState.pagination.start = $stateParams.pos;
                    tableState.pagination.init = true;
                }
            }
            baseService.initTable($scope, tableState, baseService.api.apiUrl + '/api/termialPlayMonthly/getTerminalPlayMonthlyPageList');
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
        $scope.showProgram = function(item){
            baseService.confirmDialog(720, '播放统计', item, 'tpl/terminal_play_daily_detail.html', function (ngDialog, vm) {
                
            }, function (vm) {
                vm.displayed = [];
                vm.sp = {};
                vm.sp.terminalId = item.terminalId;
                vm.sp.month = item.month;
                vm.tableState = {};
                vm.ids = [];
               
                vm.callUrl = baseService.api.apiUrl + '/api/termialPlayMonthly/getTerminalPlayMonthlyDetailsPageList';
                vm.callServer = function (tableState) {
                    baseService.initTable(vm, tableState, vm.callUrl);
                }
                vm.initTable = function () {
                   vm.callServer(vm.tableState);
                }
                
                vm.showProgram = function (item) {
                    item.pid = item.programId;
                    baseService.showProgram(item);
                }
            })
        }
    });
// JavaScript Document