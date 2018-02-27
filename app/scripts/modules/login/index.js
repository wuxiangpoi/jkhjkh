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
        $scope.domain = '';
        $scope.account = '';
        $scope.password = '';
        $scope.isRemembered = true;
        $scope.isShowMessage = false;
        if($.cookie('user_cookie') && $.cookie('user_cookie').length != 4){
            var cookiesData = JSON.parse($.cookie('user_cookie'));
            $scope.domain = cookiesData.domain;
            $scope.account = cookiesData.account;
            $scope.password = cookiesData.password;
        }
        $scope.login = function () {
            if ($scope.loginForm.$valid) {
                var postData = {
                    domain: $scope.domain,
                    account: $scope.account,
                    password: baseService.md5_pwd($scope.password)
                }
                userService.login(postData, function () {
                    userService.getUserSrc(function (userData) {
                        $rootScope.userData = userData;
                        baseService.goToUrl('/dashboard/home');
                        if ($scope.isRemembered) {
                            $.cookie('user_cookie', JSON.stringify({
                                domain: $scope.domain,
                                account: $scope.account,
                                password: $scope.password
                            }));
                        }else{
                            $.cookie('user_cookie', null);
                        }
                    });
                })
            } else {
                $scope.isShowMessage = true;
            }
        }
    });
// JavaScript Document