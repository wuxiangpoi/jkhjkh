'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('loginCtrl', function ($scope, $rootScope, baseService, userService) {
        $scope.account = '';
        $scope.password = '';
        $scope.isShowMessage = false;
        $scope.login = function () {
            if ($scope.loginForm.$valid) {
                var postData = {
                    account: $scope.account,
                    password: baseService.md5_pwd($scope.password)
                }
                userService.login(postData, function () {
                    userService.getUserSrc(function (userData) {
                        $rootScope.userData = userData;
                        $rootScope.root_citys = userData.root_citys;
                        $rootScope.current_perms = userData.current_perms;
                        baseService.goToUrl('/main');
                    });
                })
            } else {
                $scope.isShowMessage = true;
            }
        }
    });
// JavaScript Document