(function (app) {

    //获取当前脚本路径
    var currentScriptFolder = (function () {
        var scripts = document.getElementsByTagName("script");
        var currentPath = scripts[scripts.length - 1].getAttribute("src");
        var index = currentPath.lastIndexOf("/");
        return currentPath.substring(0, index + 1);
    })();

    //页面缩略图指令
    app.directive('editorPageThumb', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorPageThumb.html',
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                size: '=',
                programSize: '=',
                page: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watchGroup(['pixelHorizontal', 'pixelVertical'], function (args) {
                    var pixelHorizontal = args[0];
                    var pixelVertical = args[1];
                    $scope.originalPixel = pixelHorizontal > pixelVertical ? pixelHorizontal : pixelVertical;
                    $scope.fontSize = $scope.originalPixel / 100;
                });

                //销毁时移除事件
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }]
        };
    });


    //页面预览指令
    app.directive('editorPageView', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorPageView.html',
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                size: '=',
                programSize: '=',
                page: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watchGroup(['pixelHorizontal', 'pixelVertical'], function (args) {
                    var pixelHorizontal = args[0];
                    var pixelVertical = args[1];
                    $scope.originalPixel = pixelHorizontal > pixelVertical ? pixelHorizontal : pixelVertical;
                    $scope.fontSize = $scope.originalPixel / 100;
                });

                //销毁时移除事件
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }]
        };
    });


    //页面编辑指令
    app.directive('editorPageEdit', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorPageEdit.html',
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                //size: '=',
                //programSize: '=',
                cache: '=',
                commit: '&',
                autoAnchor: '=',
                isShowGridding: '=',
                //当选取单图片时
                onSelectSingleImage: '&',
                //当选取多图片时
                onSelectMultipleImage: '&',
                //当选取单个视频时
                onSelectSingleVideo: '&',
                //当选取多个视频时
                onSelectMultipleVideo: '&'
            },
            controller: ['$scope', function ($scope) {
                //点击选中元素
                $scope.selectElement = function (ele, $event) {
                    $event.stopPropagation();
                    $scope.cache.currentElement = ele;
                };

                //取消元素选中
                $scope.unSelectElement = function ($event) {
                    $event.stopPropagation();
                    $scope.cache.currentElement = null;
                };

            }],
            link: function (scope, elements, attrs) {
                var pNode = elements[0].parentNode;

                scope.$on('resize', function (event) {
                    scope.$apply(function () {
                        var pixelHorizontal = scope.pixelHorizontal;
                        var pixelVertical = scope.pixelVertical;
                        //var ts = scope.originalPixel / 2000;
                        var ts = 1;

                        if (pixelHorizontal / pixelVertical < pNode.clientWidth / pNode.clientHeight) {
                            if (pixelHorizontal > pixelVertical) {
                                var scale = pixelHorizontal / pixelVertical * ts;
                                scope.size = pNode.clientHeight * scale;
                                scope.programSize = pNode.clientHeight * scale;
                            } else {
                                scope.size = pNode.clientHeight * ts;
                                scope.programSize = pNode.clientHeight * ts;
                            }
                        } else {
                            if (pixelHorizontal > pixelVertical) {
                                scope.size = pNode.clientWidth * ts;
                                scope.programSize = pNode.clientWidth * ts;
                            } else {
                                var scale = pixelVertical / pixelHorizontal * ts;
                                scope.size = pNode.clientWidth * scale;
                                scope.programSize = pNode.clientWidth * scale;
                            }
                        }
                    });
                });

                var watcher = scope.$watchGroup(['pixelHorizontal', 'pixelVertical'], function (args) {
                    var pixelHorizontal = args[0];
                    var pixelVertical = args[1];
                    scope.originalPixel = pixelHorizontal > pixelVertical ? pixelHorizontal : pixelVertical;
                    scope.fontSize = scope.originalPixel / 100;
                    //var ts = scope.originalPixel / 2000;
                    var ts = 1;

                    if (pixelHorizontal / pixelVertical < pNode.clientWidth / pNode.clientHeight) {
                        if (pixelHorizontal > pixelVertical) {
                            var scale = pixelHorizontal / pixelVertical * ts;
                            scope.size = pNode.clientHeight * scale;
                            scope.programSize = pNode.clientHeight * scale;
                        } else {
                            scope.size = pNode.clientHeight * ts;
                            scope.programSize = pNode.clientHeight * ts;
                        }
                    } else {
                        if (pixelHorizontal > pixelVertical) {
                            scope.size = pNode.clientWidth * ts;
                            scope.programSize = pNode.clientWidth * ts;
                        } else {
                            var scale = pixelVertical / pixelHorizontal * ts;
                            scope.size = pNode.clientWidth * scale;
                            scope.programSize = pNode.clientWidth * scale;
                        }
                    }
                });

                //销毁时移除事件
                scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }
        };
    });


    //页面编辑区拖动
    app.directive('editorPageEditDrag', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorPageEditDrag.html',
            transclude: true,
            scope: {
                size: '=',
                scale: '=',
                onDrag: '&'
            },
            link: function (scope, elements, attrs) {
                var cSize = scope.size * scope.scale / 100;
                var pNode = elements[0];
                var cNode = elements.find('div')[0];
                cNode.style.width = cSize + 'px';
                cNode.style.height = cSize + 'px';

                //cNode.style.top = (1 - cSize / pNode.clientHeight) * 100 / 2 + '%';
                //cNode.style.left = (1 - cSize / pNode.clientWidth) * 100 / 2 + '%';

                //拖拽/滚轮
                (function () {
                    var isStart = false;
                    var isTarget = false;
                    var startX = 0, startY = 0;
                    var startLeftPercent = 50;
                    var startTopPercent = 50;


                    function targetMousedownFunc() {
                        isTarget = true;
                    }

                    function targetMouseupFunc() {
                        isTarget = false;
                    }

                    function mousedownFunc(e) {
                        //console.log(e);
                        if ((e.button === 0 || e.which === 1) && isTarget) {//鼠标左键且经过关键节点
                            isStart = true;
                            startX = e.pageX;
                            startY = e.pageY;
                            pNode.classList.remove('editor-page-openhand');
                            pNode.classList.add('editor-page-closehand');
                        }
                    }

                    function mousemoveFunc(e) {
                        if (isStart && ((e.button === 0 || e.which === 1))) {
                            var percentX = (e.pageX - startX) * 100 / pNode.clientWidth;
                            var percentY = (e.pageY - startY) * 100 / pNode.clientHeight;
                            var cPercentX = scope.size * scope.scale / pNode.clientWidth;
                            var cPercentY = scope.size * scope.scale / pNode.clientHeight;

                            var nowLeftPercent = startLeftPercent + percentX;
                            if (nowLeftPercent > (100 + cPercentX) / 2) {
                                nowLeftPercent = (100 + cPercentX) / 2;
                            }
                            if (nowLeftPercent < (100 - cPercentX) / 2) {
                                nowLeftPercent = (100 - cPercentX) / 2;
                            }

                            var nowTopPercent = startTopPercent + percentY;
                            if (nowTopPercent > (100 + cPercentY) / 2) {
                                nowTopPercent = (100 + cPercentY) / 2;
                            }
                            if (nowTopPercent < (100 - cPercentY) / 2) {
                                nowTopPercent = (100 - cPercentY) / 2;
                            }

                            cNode.style.left = nowLeftPercent + '%';
                            cNode.style.top = nowTopPercent + '%';
                        }
                    }

                    function mouseupFunc(e) {
                        if (isStart && ((e.button === 0 || e.which === 1))) {
                            var percentX = (e.pageX - startX) * 100 / pNode.clientWidth;
                            var percentY = (e.pageY - startY) * 100 / pNode.clientHeight;
                            var cPercentX = scope.size * scope.scale / pNode.clientWidth;
                            var cPercentY = scope.size * scope.scale / pNode.clientHeight;

                            var nowLeftPercent = startLeftPercent + percentX;
                            if (nowLeftPercent > (100 + cPercentX) / 2) {
                                nowLeftPercent = (100 + cPercentX) / 2;
                            }
                            if (nowLeftPercent < (100 - cPercentX) / 2) {
                                nowLeftPercent = (100 - cPercentX) / 2;
                            }

                            var nowTopPercent = startTopPercent + percentY;
                            if (nowTopPercent > (100 + cPercentY) / 2) {
                                nowTopPercent = (100 + cPercentY) / 2;
                            }
                            if (nowTopPercent < (100 - cPercentY) / 2) {
                                nowTopPercent = (100 - cPercentY) / 2;
                            }

                            startLeftPercent = nowLeftPercent;
                            startTopPercent = nowTopPercent;
                            startX = 0;
                            startY = 0;
                            isStart = false;
                            pNode.classList.add('editor-page-openhand');
                            pNode.classList.remove('editor-page-closehand');
                        }
                    }

                    function mousewheelFunc(e) {
                        var scale = scope.scale;
                        if (e.wheelDelta > 0) { //当滚轮向上滚动时
                            scale += 10;
                        } else if (e.wheelDelta < 0) { //当滚轮向下滚动时
                            scale -= 10;
                        }
                        if (scale > 180) {
                            scale = 180;
                        } else if (scale < 60) {
                            scale = 60;
                        }
                        if (scale !== scope.scale) {
                            cNode.style.width = scope.size * scale / 100 + 'px';
                            cNode.style.height = scope.size * scale / 100 + 'px';
                            scope.$apply(function () {
                                scope.scale = scale;
                            });
                        }
                    }

                    function mouseScrollFunc(e) {
                        var scale = scope.scale;
                        if (e.detail < 0) { //当滚轮向上滚动时
                            scale += 10;
                        } else if (e.detail > 0) { //当滚轮向下滚动时
                            scale -= 10;
                        }
                        if (scale > 180) {
                            scale = 180;
                        } else if (scale < 60) {
                            scale = 60;
                        }
                        if (scale !== scope.scale) {
                            cNode.style.width = scope.size * scale / 100 + 'px';
                            cNode.style.height = scope.size * scale / 100 + 'px';
                            scope.$apply(function () {
                                scope.scale = scale;
                            });
                        }
                    }

                    pNode.addEventListener('mousedown', targetMousedownFunc, false);
                    pNode.addEventListener('mouseup', targetMouseupFunc, false);
                    document.addEventListener('mousedown', mousedownFunc, false);
                    document.addEventListener('mousemove', mousemoveFunc, false);
                    document.addEventListener('mouseup', mouseupFunc, false);

                    //chrome
                    pNode.addEventListener('mousewheel', mousewheelFunc, false);
                    //firefox
                    pNode.addEventListener('DOMMouseScroll', mouseScrollFunc, false);

                    //监控页面集合变化
                    var watcher = scope.$watch('scale', function (newScale) {
                        cNode.style.width = scope.size * newScale / 100 + 'px';
                        cNode.style.height = scope.size * newScale / 100 + 'px';
                        scope.scale = newScale;
                    });

                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        //firefox
                        pNode.removeEventListener('DOMMouseScroll', mouseScrollFunc, false);
                        //chrome
                        pNode.removeEventListener('mousewheel', mousewheelFunc, false);

                        document.removeEventListener('mouseup', mouseupFunc, false);
                        document.removeEventListener('mousemove', mousemoveFunc, false);
                        document.removeEventListener('mousedown', mousedownFunc, false);
                        pNode.removeEventListener('mouseup', targetMouseupFunc, false);
                        pNode.removeEventListener('mousedown', targetMousedownFunc, false);

                        watcher();//清除监视
                    });
                })();

            }
        };
    });

})(angular.module('qmedia.editor'));
