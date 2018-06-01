'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
    .controller('terminalPlayDetailCtrl', function ($scope, $rootScope, baseService,$stateParams) {
        $scope.displayed = [];
        $scope.sp = {};
        $scope.tableState = {};
        $scope.currentGroup = $rootScope.rootGroup;
        $scope.sp.terminalId = $stateParams.id;
        $scope.terminalName = $stateParams.name;
        $scope.resolution = $stateParams.resolution;
        $scope.pos = $stateParams.pos;
        $scope.callServer = function (tableState) {
            baseService.initTable($scope, tableState, baseService.api.apiUrl + '/api/termialPlayMonthly/getTerminalPlayMonthlyPageList');
        }
       
        $scope.initPage = function () {
            $scope.tableState.pagination.start = 0;
            $scope.callServer($scope.tableState);
        }
        $scope.showProgram = function(item){
            baseService.confirmDialog(720, '播放管理', item, 'tpl/terminal_play_daily_detail.html', function (ngDialog, vm) {
                
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