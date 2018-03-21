'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
    .directive('imageView', ['$rootScope', 'baseService', function ($rootScope, baseService) {
        function link($scope, element, attrs) {
            function fullScreen() {
                var el = document.documentElement,
                    rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
                    wscript;

                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                    return;
                }

                if (typeof window.ActiveXObject != "undefined") {
                    wscript = new ActiveXObject("WScript.Shell");
                    if (wscript) {
                        wscript.SendKeys("{F11}");
                    }
                }
            }

            function exitFullScreen() {
                var el = document,
                    cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
                    wscript;

                if (typeof cfs != "undefined" && cfs) {
                    cfs.call(el);
                    return;
                }

                if (typeof window.ActiveXObject != "undefined") {
                    wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            }

            function fullscreenchange() {
                document.addEventListener("fullscreenchange", function () {
                    if (!document.fullscreen) {
                        $scope.imgPreview = false;
                        $scope.$apply();
                    }
                }, false);

                document.addEventListener("mozfullscreenchange", function () {
                    if (!document.mozFullScreen) {
                        $scope.imgPreview = false;
                        $scope.$apply();
                    }
                }, false);



                document.addEventListener("webkitfullscreenchange", function () {
                    if (!document.webkitIsFullScreen) {
                        $scope.imgPreview = false;
                        $scope.$apply();
                    }
                }, false);

                document.addEventListener("msfullscreenchange", function () {
                    if (!document.msFullscreenElement) {
                        $scope.imgPreview = false;
                        $scope.$apply();
                    }
                }, false);
            }
            $scope.$on('callImg', function (e, data, type) {
                $scope.data = data;
                $scope.data.imgType = type;
                if (type == 1) {

                    if (data.width > data.height) {
                        var windowWidth = window.screen.width;
                        if (data.width > windowWidth) {
                            $scope.imgStyle = {
                                width: '100%',
                                height: 'auto',
                                maxHeight: '100%',
                                verticalAlign: 'middle'
                            }
                        } else {
                            $scope.imgStyle = {
                                width: data.width,
                                height: data.height,
                            }
                        }

                    } else {
                        var windowHeight = window.screen.height;
                        if (data.height > windowHeight) {
                            $scope.imgStyle = {
                                width: 'auto',
                                height: windowHeight,
                                verticalAlign: 'middle'
                            }
                        } else {
                            $scope.imgStyle = {
                                width: 'auto',
                                height: '100%',
                                verticalAlign: 'middle'
                            }
                        }

                    }
                } else {
                    var windowHeight = window.screen.height;
                    $scope.size = windowHeight;
                }

                $scope.imgPreview = true;
                fullScreen();
                fullscreenchange();
            });
            $scope.close = function () {
                exitFullScreen();
                $scope.imgPreview = false;
            }
        }
        return {
            templateUrl: 'scripts/directives/imageView/imageview.html' + baseService.verson,
            restrict: 'AE',
            replace: true,
            link: link
        }
    }]);