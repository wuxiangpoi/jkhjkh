'use strict';
angular.module('sbAdminApp')
    .controller('password_findCtrl',
        function ($scope, $rootScope, $interval, baseService) {
            $scope.step = 1;
            $scope.isSend = false;
            $scope.countdown = 60;
            $scope.data = {
                email: '',
                yanz: '',
                newPassword1: '',
                newPassword: ''
            }
            $scope.nextStep = function () {
                switch ($scope.step) {
                    case 1:
                        if ($scope.mailForm.$valid) {
                            baseService.postData(baseService.api.apiUrl + '/client/user/checkResetPasswordCodeByEmail', {
                                email: $scope.data.email,
                                code: $scope.data.yanz
                            }, function (data) {
                                $scope.step += 1;
                            })
                        } else {
                            $scope.isShowMessage = true;
                        }

                        break;
                    case 2:
                        if ($scope.psdForm.$valid) {
                            baseService.postData(baseService.api.apiUrl + '/client/user/resetAdminPasswordByEmail', {
                                email: $scope.data.email,
                                code: $scope.data.yanz,
                                newPassword: $rootScope.md5_pwd($scope.data.newPassword)
                            }, function () {
                                $scope.step += 1;
                            })
                        } else {
                            $scope.isShowMessage = true;
                        }
                        break;

                }
            }
            $scope.sendYz = function () {
                if ($scope.isSend) {
                    return;
                } else {
                    if ($scope.data.email != '') {
                        var testEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                        if (testEmail.test($scope.data.email)) {
                            var countdownInter = $interval(function () {
                                if ($scope.countdown <= 0) {
                                    $scope.isSend = false;
                                    $scope.countdown = 60;
                                    $interval.cancel(countdownInter);
                                } else {
                                    $scope.countdown--;
                                }
                            }, 1000)

                            baseService.getJson(baseService.api.apiUrl + '/client/user/getResetPasswordCode', {
                                email: $scope.data.email
                            }, function (data) {
                                $scope.isSend = true;
                                countdownInter;
                            })
                        } else {
                            baseService.alert('请输入正确邮箱', 'warning', true);
                        }

                    } else {
                        baseService.alert('请先输入邮箱', 'warning', true);
                    }
                }
            }
        }
    )