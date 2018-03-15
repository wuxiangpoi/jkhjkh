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
                userService.login(postData, function (pdata) {
                    userService.getUserSrc(function (userData) {
                        $rootScope.userData = userData;
                        $rootScope.current_perms = userData.current_perms;
                        $rootScope.root_programReslotions = userData.root_programReslotions;
                        $rootScope.rootGroup = userData.root_organizations[0];
                        for (var i = 0; i < userData.root_organizations.length; i++) {
                            if (userData.root_organizations[i].pid == '') {
                                $rootScope.rootGroup = userData.root_organizations[i];
                            }
                        }
                        baseService.goToUrl('/dashboard/home');
                        if ($scope.isRemembered) {
                            $.cookie('user_cookie', JSON.stringify({
                                domain: $scope.domain,
                                account: $scope.account,
                                password: $scope.password
                            }), { expires: 30 });
                        }else{
                            $.cookie('user_cookie', null);
                        }
                        
                    });
                })
            } else {
                $scope.isShowMessage = true;
            }
        }
        $scope.myKeyup = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                $scope.login();
            }
        };
    });
// JavaScript Document