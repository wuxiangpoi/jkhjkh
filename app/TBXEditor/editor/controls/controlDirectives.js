//控件指令库
(function (app) {

    //获取当前脚本路径
    var currentScriptFolder = (function () {
        var scripts = document.getElementsByTagName("script");
        var currentPath = scripts[scripts.length - 1].getAttribute("src");
        var index = currentPath.lastIndexOf("/");
        return currentPath.substring(0, index + 1);
    })();


    //自定义事件
    app.directive('editorOnlyClick', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elements, attrs) {
                var editorOnlyClick = $parse(attrs['editorOnlyClick']);
                var onlyClick = function ($event) {
                    scope.$apply(function () {
                        editorOnlyClick(scope, {$event: $event});
                    });
                };

                var dom = elements[0];
                dom.addEventListener('onlyclick', onlyClick, false);
                //销毁时移除事件
                scope.$on('$destroy', function () {
                    dom.removeEventListener('onlyclick', onlyClick, false);
                });
            }
        };
    }]);


    ////自定义事件2
    //app.directive('editorElementLoaded', ['$parse', '$timeout', function ($parse, $timeout) {
    //    return {
    //        restrict: 'A',
    //        replace: false,
    //        link: function (scope, elements, attrs) {
    //            var editorElementLoaded = $parse(attrs['editorElementLoaded']);
    //            //$timeout(function () {
    //            //    editorElementLoaded(scope, {$dom: elements[0]});
    //            //}, 0);
    //            window.setTimeout(function () {
    //                scope.$apply(function () {
    //                    editorElementLoaded(scope, {});
    //                });
    //            }, 0);
    //
    //        }
    //    };
    //}]);


    //分辨率选择器
    app.directive('editorPixelSelector', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'pixelSelector.html',
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                onChange: '&',
                onCustom: '&'
            },
            controller: ['$scope', function ($scope) {

                function getCustomPixels() {
                    var pixels = [];
                    var str_customPixels = window.localStorage.getItem('customPixels');
                    if (str_customPixels) {
                        try {
                            var arr = JSON.parse(str_customPixels);
                            arr.forEach(function (value) {
                                pixels.push({h: value.h, v: value.v});
                            });
                        } catch (err) {

                        }
                    }
                    return pixels;
                }

                function addCustomPixel(ph, pv) {
                    var pixels = getCustomPixels();
                    pixels.push({h: ph, v: pv});
                    var str_customPixels = JSON.stringify(pixels);
                    try {
                        window.localStorage.setItem('customPixels', str_customPixels);
                    } catch (err) {

                    }
                }

                function delCustomPixel(ph, pv) {
                    var pixels = getCustomPixels();
                    var find = pixels.find(function (item) {
                        return item.h === ph && item.v === pv;
                    });
                    if (find) {
                        pixels.remove(find);
                    }
                    var str_customPixels = JSON.stringify(pixels);
                    try {
                        window.localStorage.setItem('customPixels', str_customPixels);
                    } catch (err) {

                    }
                }

                var internalPixels = [
                    {h: 1920, v: 1080},
                    {h: 1080, v: 1920},
                    {h: 1366, v: 768},
                    {h: 768, v: 1366},
                    {h: 1024, v: 768},
                    {h: 768, v: 1024}
                ];

                var customPixels = getCustomPixels();
                if (customPixels.every(function (value) {
                        return value.h !== $scope.pixelHorizontal || value.v !== $scope.pixelVertical;
                    })) {
                    customPixels.push({h: $scope.pixelHorizontal, v: $scope.pixelVertical});
                }

                var allPixels = [];
                internalPixels.forEach(function (value) {
                    allPixels.push({isCustom: false, h: value.h, v: value.v});
                });
                customPixels.forEach(function (value) {
                    if (internalPixels.every(function (item) {
                            return item.h !== value.h || item.v !== value.v;
                        })) {
                        allPixels.push({isCustom: true, h: value.h, v: value.v});
                    }
                });


                //控件展开状态
                $scope.isSpread = false;

                $scope.spreadChange = function ($event) {
                    $event.stopPropagation();
                    $scope.isSpread = !$scope.isSpread;
                };

                //可选的分辨率
                $scope.pixels = allPixels;

                //切换已有分辨率时
                $scope.changeItem = function (pixel) {
                    if ($scope.pixelHorizontal !== pixel.h || $scope.pixelVertical !== pixel.v) {
                        $scope.pixelHorizontal = pixel.h;
                        $scope.pixelVertical = pixel.v;
                        if ($scope.onChange) {
                            $scope.onChange({
                                ph: pixel.h,
                                pv: pixel.v
                            });
                        }
                    }
                };

                //删除自定义分辨率
                $scope.deleteItem = function (pixel, $event) {
                    $event.stopPropagation();

                    //持久化中移除
                    delCustomPixel(pixel.h, pixel.v);

                    //内存中移除
                    var find = allPixels.find(function (item) {
                        return item.h === pixel.h && item.v === pixel.v;
                    });
                    if (find) {
                        allPixels.remove(find);
                    }
                };

                $scope.onCustomClick = function () {
                    $scope.onCustom({
                        ph: $scope.pixelHorizontal,
                        pv: $scope.pixelVertical,
                        callback: function (ph, pv) {
                            $scope.pixelHorizontal = ph;
                            $scope.pixelVertical = pv;
                            if (allPixels.every(function (value) {
                                    return value.h !== ph || value.v !== pv;
                                })) {
                                //持久化中添加
                                addCustomPixel(ph, pv);
                                //内存中添加
                                allPixels.push({isCustom: true, h: ph, v: pv});
                            }
                        }
                    });
                };

                //关闭展开状态
                function closeSpread() {
                    $scope.$apply(function () {
                        $scope.isSpread = false;
                    });
                }

                document.addEventListener('click', closeSpread, false);
                //销毁时移除事件
                $scope.$on('$destroy', function () {
                    document.removeEventListener('click', closeSpread, false);
                });
            }]
        };
    });


    //字体选择
    app.directive('editorControlFont', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<select ng-model="font" ng-change="changeVal(font)" ng-options="font.id as font.name for font in fonts"></select>',
            scope: {
                font: '=',
                onChange: '&'
            },
            controller: ['$scope', 'editorFontFamilyConstant', function ($scope, fonts) {
                $scope.fonts = fonts;

                var nowVal = null;

                var watcher = $scope.$watch('font', function (val) {
                    nowVal = val;
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.changeVal = function (newVal) {
                    if ($scope.onChange) {
                        $scope.onChange({
                            oldVal: nowVal,
                            newVal: newVal
                        });
                    }
                    nowVal = newVal;
                };
            }]
        };
    });

    //RGB颜色选择
    app.directive('editorControlRgbColor', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<input type="color" ng-model="color" ng-change="changeColor(color)">',
            scope: {
                rgbColor: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {

                $scope.changeColor = function (color) {
                    var rgb = $scope.rgbColor;
                    var oldR = rgb.r;
                    var oldG = rgb.g;
                    var oldB = rgb.b;
                    var newR = parseInt(color.substr(1, 2), 16);
                    var newG = parseInt(color.substr(3, 2), 16);
                    var newB = parseInt(color.substr(5, 2), 16);
                    rgb.r = newR;
                    rgb.g = newG;
                    rgb.b = newB;

                    if ($scope.onChange) {
                        $scope.onChange({
                            newVal: {
                                r: newR,
                                g: newG,
                                b: newB
                            },
                            oldVal: {
                                r: oldR,
                                g: oldG,
                                b: oldB
                            }
                        });
                    }
                };

                var watcher = $scope.$watch('rgbColor', function (rgb) {
                    var hexStr = ((rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16);
                    hexStr = hexStr.length >= 6 ? hexStr : new Array(6 + 1 - hexStr.length).join('0') + hexStr;
                    $scope.color = '#' + hexStr;
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }]
        };
    });

    //边框样式选择
    app.directive('editorControlBorderStyle', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<select ng-model="borderStyle" ng-change="changeVal(borderStyle)" ng-options="style.value as style.name for style in styles"></select>',
            scope: {
                borderStyle: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                $scope.styles = [
                    {name: "实线", value: "solid"},
                    {name: "虚线", value: "dashed"},
                    {name: "点线", value: "dotted"},
                    {name: "双线", value: "double"},
                    {name: "凹槽", value: "groove"},
                    {name: "凸起", value: "ridge"}
                ];

                var nowVal = null;

                var watcher = $scope.$watch('borderStyle', function (val) {
                    nowVal = val;
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.changeVal = function (newVal) {
                    if ($scope.onChange) {
                        $scope.onChange({
                            oldVal: nowVal,
                            newVal: newVal
                        });
                    }
                    nowVal = newVal;
                };
            }]
        };
    });

    //日期格式选择
    app.directive('editorControlTimeFormatter', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<select ng-model="formatter" ng-change="changeVal(formatter)" ng-options="formatter.id as formatter.name for formatter in formatters"></select>',
            scope: {
                formatter: '=',
                onChange: '&'
            },
            controller: ['$scope', 'editorTimeFormatConstant', function ($scope, formatters) {
                $scope.formatters = formatters;

                var nowVal = null;

                var watcher = $scope.$watch('formatter', function (val) {
                    nowVal = val;
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.changeVal = function (newVal) {
                    if ($scope.onChange) {
                        $scope.onChange({
                            oldVal: nowVal,
                            newVal: newVal
                        });
                    }
                    nowVal = newVal;
                };
            }]
        };
    });

    //是否滚动选框
    app.directive('editorControlIsScroll', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<select ng-model="isScroll" ng-change="changeVal(isScroll)" ng-options="option.value as option.name for option in options"></select>',
            scope: {
                isScroll: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                $scope.options = [
                    {name: "静止显示", value: false},
                    {name: "向左连移", value: true}
                ];

                var nowVal = null;

                var watcher = $scope.$watch('isScroll', function (val) {
                    nowVal = val;
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.changeVal = function (newVal) {
                    if ($scope.onChange) {
                        $scope.onChange({
                            oldVal: nowVal,
                            newVal: newVal
                        });
                    }
                    nowVal = newVal;
                };
            }]
        };
    });

    //动画选择
    app.directive('editorControlAnimation', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<select ng-model="curAnim" ng-change="changeAnimation(curAnim)" ng-options="animation as animation.name for animation in animations"></select>',
            scope: {
                animation: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //动画
                $scope.animations = [
                    {name: "向左覆盖", inAnimId: 1, outAnimId: 1},
                    {name: "向右覆盖", inAnimId: 2, outAnimId: 2},
                    {name: "向下覆盖", inAnimId: 3, outAnimId: 3},
                    {name: "向上覆盖", inAnimId: 4, outAnimId: 4},
                    {name: "淡入淡出", inAnimId: 5, outAnimId: 5},
                    {name: "向左翻转", inAnimId: 6, outAnimId: 6}
                ];

                $scope.changeAnimation = function (anim) {
                    var animation = $scope.animation;

                    if (anim.inAnimId !== animation.inId || anim.outAnimId !== animation.outId) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: {
                                    inId: anim.inAnimId,
                                    outId: anim.outAnimId
                                },
                                oldVal: {
                                    inId: animation.inId,
                                    outId: animation.outId
                                }
                            });
                        }

                        animation.inId = anim.inAnimId;
                        animation.outId = anim.outAnimId;
                    }
                };

                var watcher = $scope.$watch('animation', function (animation) {
                    $scope.curAnim = $scope.animations.find(function (item) {
                        return item.inAnimId === animation.inId && item.outAnimId === animation.outId;
                    });
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

            }]
        };
    });

    //水平对齐
    app.directive('editorControlAlignHorizontal', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<span class="editor-control-align"><span class="iconfont {{a.icon}}" title="{{a.name}}" ng-repeat="a in aligns" ng-click="changeAlign(a)" ng-class="{\'selected\':a.value===align}"></span></span>',
            scope: {
                align: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //水平对齐
                $scope.aligns = [
                    {name: "居左", icon: 'icon-zuoduiqi', value: "left"},
                    {name: "居中", icon: 'icon-juzhongduiqi', value: "center"},
                    {name: "居右", icon: 'icon-zuo-youduiqi', value: "right"}
                ];

                $scope.changeAlign = function (align) {
                    if (align.value !== $scope.align) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: align.value,
                                oldVal: $scope.align
                            });
                        }
                        $scope.align = align.value;
                    }
                };
            }]
        };
    });

    //垂直对齐
    app.directive('editorControlAlignVertical', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<span class="editor-control-align"><span class="iconfont {{a.icon}}" title="{{a.name}}" ng-repeat="a in aligns" ng-click="changeAlign(a)" ng-class="{\'selected\':a.value===align}"></span></span>',
            scope: {
                align: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //垂直对齐
                $scope.aligns = [
                    {name: "居上", icon: 'icon-chuizhijushang', value: "top"},
                    {name: "居中", icon: 'icon-chuizhijuzhong', value: "middle"},
                    {name: "居下", icon: 'icon-chuizhijuxia', value: "bottom"}
                ];

                $scope.changeAlign = function (align) {
                    if (align.value !== $scope.align) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: align.value,
                                oldVal: $scope.align
                            });
                        }
                        $scope.align = align.value;
                    }
                };
            }]
        };
    });

    //水平方向
    app.directive('editorControlDirectionHorizontal', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<span class="editor-control-align"><span class="iconfont {{d.icon}}" title="{{d.name}}" ng-repeat="d in directions" ng-click="changeDirection(d)" ng-class="{\'selected\':d.value===direction}"></span></span>',
            scope: {
                direction: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //水平方向
                $scope.directions = [
                    {name: "向左", icon: 'icon-xiangzuo', value: true},
                    {name: "向右", icon: 'icon-xiangyou', value: false}
                ];

                $scope.changeDirection = function (direction) {
                    if (direction.value !== $scope.direction) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: direction.value,
                                oldVal: $scope.direction
                            });
                        }
                        $scope.direction = direction.value;
                    }
                };
            }]
        };
    });

    //单行/多行
    app.directive('editorControlIsMultiple', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<span class="editor-control-isMultiple"><span ng-repeat="i in items" ng-click="changeVal(i)" ng-class="{\'selected\':i.value===isMultiple}">{{i.name}}</span></span>',
            scope: {
                isMultiple: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //单行/多行
                $scope.items = [
                    {name: "单行", value: false},
                    {name: "多行", value: true}
                ];

                $scope.changeVal = function (i) {
                    if (i.value !== $scope.isMultiple) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: i.value,
                                oldVal: $scope.isMultiple
                            });
                        }
                        $scope.isMultiple = i.value;
                    }
                };
            }]
        };
    });

    //背景图片类型
    app.directive('editorControlBackgroundType', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<span class="editor-control-backgroundType"><span ng-repeat="i in items" ng-click="changeVal(i)" ng-class="{\'selected\':i.value===backGroundType}">{{i.name}}</span></span>',
            scope: {
                backGroundType: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {
                //背景图片类型
                $scope.items = [
                    {name: "无", value: 0},
                    {name: "颜色", value: 1},
                    {name: "图片", value: 2}
                ];

                $scope.changeVal = function (i) {
                    if (i.value !== $scope.backGroundType) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: i.value,
                                oldVal: $scope.backGroundType
                            });
                        }
                        $scope.backGroundType = i.value;
                    }
                };
            }]
        };
    });

    //范围拖动控件
    app.directive('editorControlRange', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'range.html',
            scope: {
                minVal: '=',
                maxVal: '=',
                step: '@',
                val: '=',
                onChange: '&'
            },
            link: function (scope, elements, attrs) {
                if (scope.step) {
                    elements[0].setAttribute('step', scope.step);
                }
                var watcher = scope.$watch('val', function (val) {
                    elements[0].value = val;
                });

                var func = function () {
                    var val = parseInt(this.value);
                    scope.$apply(function () {
                        scope.val = val;
                    });
                };

                var oldVal = null;
                var downFunc = function (e) {
                    e.stopPropagation();
                    oldVal = parseInt(this.value);
                };

                var changeFunc = function () {
                    if (scope.onChange) {
                        scope.onChange({
                            newVal: scope.val,
                            oldVal: oldVal
                        });
                    }
                };

                elements.bind('mousedown', downFunc);
                elements.bind('keydown', downFunc);
                elements.bind('change', changeFunc);
                elements.bind('input', func);
                //销毁时移除事件
                scope.$on('$destroy', function () {
                    elements.unbind('input', func);
                    elements.unbind('change', changeFunc);
                    elements.unbind('keydown', downFunc);
                    elements.unbind('mousedown', downFunc);
                    watcher();
                });
            }
        };
    });

    //双向绑定开关
    app.directive('editorControlSwitcher', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'switcher.html',
            scope: {
                isOn: '=',
                isOff: '=',
                onChange: '&'
            },
            link: function (scope, elements, attrs) {
                var func = function () {
                    if (typeof scope.isOn === 'boolean') {
                        //scope.isOn = !scope.isOn;
                        scope.$apply(function () {
                            scope.isOn = !scope.isOn;
                            if (scope.onChange) {
                                scope.onChange({
                                    newVal: scope.isOn,
                                    oldVal: !scope.isOn
                                });
                            }
                        });
                    } else if (typeof scope.isOff === 'boolean') {
                        //scope.isOff = !scope.isOff;
                        scope.$apply(function () {
                            scope.isOff = !scope.isOff;
                            if (scope.onChange) {
                                scope.onChange({
                                    newVal: !scope.isOff,
                                    oldVal: scope.isOff
                                });
                            }
                        });
                    }
                };
                elements.bind('click', func);
                //销毁时移除事件
                scope.$on('$destroy', function () {
                    elements.unbind('click', func);
                });
            }
        };
    });

    //单图片选择控件
    app.directive('editorControlImageSelector', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'imageSelector.html',
            scope: {
                image: '=',
                onSelectSingleImage: '&',
                onImageDeleted: '&',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {

                //添加图片
                $scope.insertImage = function () {
                    $scope.onSelectSingleImage({
                        image: null,
                        callback: function (image) {
                            if ($scope.onChange) {
                                $scope.onChange({
                                    newVal: image,
                                    oldVal: null
                                });
                            }
                            $scope.image = image;
                        }
                    });
                };

                //更换图片
                $scope.updateImage = function () {
                    $scope.onSelectSingleImage({
                        image: $scope.image,
                        callback: function (image) {
                            if ($scope.onChange) {
                                $scope.onChange({
                                    newVal: image,
                                    oldVal: $scope.image
                                });
                            }
                            $scope.image = image;
                        }
                    });
                };

                //删除图片
                $scope.deleteImage = function () {
                    if ($scope.onChange) {
                        $scope.onChange({
                            newVal: null,
                            oldVal: $scope.image
                        });
                    }
                    $scope.image = null;
                    $scope.onImageDeleted();
                };
            }]
        };
    });


    //多图片选择控件
    app.directive('editorControlMultipleImageViewer', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'multipleImageViewer.html',
            scope: {
                images: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watchCollection('images', function (images) {
                    $scope.curIndex = -1;
                    if (images.length !== 0) {
                        $scope.curIndex = 0;
                    }
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.prevImage = function () {
                    if ($scope.curIndex > 0) {
                        $scope.curIndex -= 1;
                    }
                };

                $scope.nextImage = function () {
                    var count = $scope.images.length;
                    if ($scope.curIndex < count - 1) {
                        $scope.curIndex += 1;
                    }
                };
            }]
        };
    });


    //多视频选择控件
    app.directive('editorControlMultipleVideoViewer', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'multipleVideoViewer.html',
            scope: {
                videos: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watchCollection('videos', function (videos) {
                    $scope.curIndex = -1;
                    if (videos.length !== 0) {
                        $scope.curIndex = 0;
                    }
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.prevVideo = function () {
                    if ($scope.curIndex > 0) {
                        $scope.curIndex -= 1;
                    }
                };

                $scope.nextVideo = function () {
                    var count = $scope.videos.length;
                    if ($scope.curIndex < count - 1) {
                        $scope.curIndex += 1;
                    }
                };
            }]
        };
    });


    //单视频选择控件
    app.directive('editorControlVideoSelector', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'videoSelector.html',
            scope: {
                video: '=',
                onSelectSingleVideo: '&',
                onVideoDeleted: '&'
            },
            controller: ['$scope', function ($scope) {

                //添加图片
                $scope.insertVideo = function () {
                    $scope.onSelectSingleVideo({
                        video: null,
                        callback: function (video) {
                            $scope.video = video;
                        }
                    });
                };

                //更换图片
                $scope.updateVideo = function () {
                    $scope.onSelectSingleVideo({
                        video: $scope.video,
                        callback: function (video) {
                            $scope.video = video;
                        }
                    });
                };

                //删除图片
                $scope.deleteVideo = function () {
                    $scope.video = null;
                    $scope.onVideoDeleted();
                };
            }]
        };
    });

    //视频封面图及点击播放（优化用）
    app.directive('editorControlVideoViewer', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'videoViewer.html',
            scope: {
                poster: '=',
                src: '='
            },
            link: function (scope, elements, attrs) {
                var endedHandler = function () {
                    scope.$apply(function () {
                        scope.isPlaying = false;
                    });
                };
                var videoDOM = elements.find('video')[0];
                videoDOM.addEventListener('ended', endedHandler);

                //销毁时移除事件
                scope.$on('$destroy', function () {
                    videoDOM.removeEventListener('ended', endedHandler);
                });

                videoDOM.poster = scope.poster;
                scope.isLoaded = false;//指示视频资源是否已加载
                scope.isPlaying = false;//指示是否正在播放

                scope.loadVideo = function () {
                    videoDOM.src = scope.src;

                    scope.isLoaded = true;
                    scope.isPlaying = true;
                };

                scope.playVideo = function () {
                    videoDOM.play();
                    scope.isPlaying = true;
                };

                scope.pauseVideo = function () {
                    videoDOM.pause();
                    scope.isPlaying = false;
                };
            }
        };
    });

})(angular.module('qmedia.editor'));
