(function (app) {

    //循环队列
    var CycleQueue = (function () {
        function CycleQueue(arr, isClone) {
            if (isClone === true) {
                var newArr = [];
                for (var i = 0, len = arr.length; i < len; i++) {
                    newArr.push(arr[i]);
                }
                this._arr = newArr;
            } else {
                this._arr = arr;
            }
            this._index = 0;
        }

        CycleQueue.prototype = {
            getIndex: function () {//获取指针位置
                return this._index;
            },
            setIndex: function (index) {//设置指针位置
                var len = this._arr.length;
                this._index = (index % len + len) % len;
            },
            prev: function () {//取前一个，并将指针前移
                return this.skipPrev(1);
            },
            skipPrev: function (step) {//向前跳几步
                return this.skipNext(-step);
            },
            next: function () {//取后一个，并将指针后移
                return this.skipNext(1);
            },
            skipNext: function (step) {//向后跳几步
                var arr = this._arr;
                var len = arr.length;
                var index = this._index = ((this._index + step) % len + len) % len;
                return arr[index];
            },
            current: function () {//取当前位置，指针不变
                return this._arr[this._index];
            }
        };

        CycleQueue.prototype.constructor = CycleQueue;

        return CycleQueue;
    })();

    //获取当前脚本路径
    var currentScriptFolder = (function () {
        var scripts = document.getElementsByTagName("script");
        var currentPath = scripts[scripts.length - 1].getAttribute("src");
        var index = currentPath.lastIndexOf("/");
        return currentPath.substring(0, index + 1);
    })();

    //布局视图
    app.directive('editorElementLayout', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementLayout.html',
            transclude: true,
            scope: {
                layout: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watch('layout', function (layout) {
                    switch (layout.ver) {
                        case 1:
                            var layoutStyle = {
                                'left': layout.left + '%',
                                'top': layout.top + '%',
                                'width': layout.width + '%',
                                'height': layout.height + '%',
                                'z-index': layout.zIndex
                            };
                            if (layout.rotate % 360 !== 0) {//小优化
                                layoutStyle['-webkit-transform']
                                    = layoutStyle['-webkit-transform']
                                    = layoutStyle['-moz-transform']
                                    = layoutStyle['-ms-transform']
                                    = layoutStyle['-o-transform']
                                    = layoutStyle['transform']
                                    = 'rotate(' + layout.rotate + 'deg)';
                            }
                            $scope.layoutStyle = layoutStyle;
                            break;
                        default :
                            $scope.layoutStyle = {
                                'left': '0',
                                'top': '0',
                                'width': '100%',
                                'height': '100%',
                                'z-index': '0'
                            };
                            break;
                    }
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }]
        };
    });

    //布局视图
    app.directive('editorElementLayoutThumb', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementLayoutThumb.html',
            transclude: true,
            scope: {
                layout: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watch('layout', function (layout) {
                    switch (layout.ver) {
                        case 1:
                            var layoutStyle = {
                                'left': layout.left + '%',
                                'top': layout.top + '%',
                                'width': layout.width + '%',
                                'height': layout.height + '%',
                                'z-index': layout.zIndex,
                                'border': 'solid 0.5em #e2e3e6'
                            };
                            if (layout.rotate % 360 !== 0) {//小优化
                                layoutStyle['-webkit-transform']
                                    = layoutStyle['-webkit-transform']
                                    = layoutStyle['-moz-transform']
                                    = layoutStyle['-ms-transform']
                                    = layoutStyle['-o-transform']
                                    = layoutStyle['transform']
                                    = 'rotate(' + layout.rotate + 'deg)';
                            }
                            $scope.layoutStyle = layoutStyle;
                            break;
                        default :
                            $scope.layoutStyle = {
                                'left': '0',
                                'top': '0',
                                'width': '100%',
                                'height': '100%',
                                'z-index': '0',
                                'border': 'solid 0.5em #e2e3e6'
                            };
                            break;
                    }
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }]
        };
    });

    //3D变换视图
    app.directive('editorElementTransform', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementTransform.html',
            transclude: true,
            scope: {
                transform: '='
            },
            controller: ['$scope', function ($scope) {

            }]
        };
    });

    //尺寸标记
    app.directive('editorElementMark', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementMark.html',
            transclude: true,
            scope: {
                layout: '=',
                type: '=',
                data: '=',
                fontSize: '=',
                pixelHorizontal: '=',
                pixelVertical: '='
            },
            controller: ['$scope', function ($scope) {

            }]
        };
    });

    //背景视图
    app.directive('editorElementBackground', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementBackground.html',
            scope: {
                backGround: '=',
                border: '='
            }
        };
    });


    //边框视图
    app.directive('editorElementBorder', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementBorder.html',
            transclude: true,
            scope: {
                border: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watch('border', function (border) {
                    switch (border.ver) {
                        case 1:
                            $scope.borderStyle = {
                                'padding': border.padding / 10 + 'em',
                                'border': border.style + ' ' + border.width / 10 + 'em rgba(' + border.color.r + ',' + border.color.g + ',' + border.color.b + ',' + border.opacity / 100 + ')',
                                'border-radius': border.radius / 10 + 'em'
                            };
                            break;
                    }
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }]
        };
    });


    //滤镜视图
    app.directive('editorElementFilter', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementFilter.html',
            transclude: true,
            scope: {
                filter: '='
            },
            controller: ['$scope', function ($scope) {
                var watcher = $scope.$watch('filter', function (filter) {
                    switch (filter.ver) {
                        case 1:
                            (function () {
                                var filter_strs = [];
                                if (filter.opacity !== 100) {//不透明
                                    filter_strs.push('opacity(' + filter.opacity + '%)');
                                }
                                if (filter.brightness !== 100) {//亮度
                                    filter_strs.push('brightness(' + filter.brightness + '%)');
                                }
                                if (filter.contrast !== 100) {//对比度
                                    filter_strs.push('contrast(' + filter.contrast + '%)');
                                }
                                if (filter.saturate !== 100) {//饱和度
                                    filter_strs.push('saturate(' + filter.saturate + '%)');
                                }
                                if (filter.grayscale !== 0) {//灰度
                                    filter_strs.push('grayscale(' + filter.grayscale + '%)');
                                }
                                if (filter.invert !== 0) {//反色
                                    filter_strs.push('invert(' + filter.invert + '%)');
                                }
                                if (filter.blur !== 0) {//模糊
                                    filter_strs.push('blur(' + filter.blur * 16 / 10 + 'px)');
                                }
                                if (filter.hueRotate % 360 !== 0) {//色相旋转
                                    filter_strs.push('hue-rotate(' + filter.hueRotate + 'deg)');
                                }
                                //不要判断数组为空，否则非空变空不生效，掉坑
                                $scope.filterStyle = {
                                    'filter': filter_strs.join(' ')
                                };
                            })();
                            break;
                    }
                }, true);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }]
        };
    });


    //网格视图
    app.directive('editorElementGridding', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementGridding.html',
            scope: {
                cache: '=',//用于自动吸附对齐
                pixelHorizontal: '=',
                pixelVertical: '=',
                originalPixel: '=',
                isShowGridding: '=',
                autoAnchor: '='//自动停靠开关
            },
            link: function (scope, element, attrs) {

                var watcher4 = scope.$watch('autoAnchor', function (isAutoAnchor) {
                    scope.autoAnchor = isAutoAnchor;
                    redraw();
                });

                var watcher3 = scope.$watch('isShowGridding', function (isShow) {
                    redraw();
                });

                var layoutHorizontalLinePercents = [];
                var layoutVerticalLinePercents = [];
                var watcher = scope.$watch('cache.currentElement', function (currentElement) {
                    layoutHorizontalLinePercents.splice(0, layoutHorizontalLinePercents.length);
                    layoutVerticalLinePercents.splice(0, layoutVerticalLinePercents.length);
                    if (currentElement !== null) {
                        var allLayouts = scope.cache.currentPage.elements.map(function (ele) {
                            return ele.layout;
                        });
                        allLayouts.remove(currentElement.layout);

                        layoutHorizontalLinePercents.push(0);
                        layoutHorizontalLinePercents.push(50);
                        layoutHorizontalLinePercents.push(100);
                        layoutVerticalLinePercents.push(0);
                        layoutVerticalLinePercents.push(50);
                        layoutVerticalLinePercents.push(100);

                        allLayouts.forEach(function (layout) {
                            layoutHorizontalLinePercents.push(layout.top);
                            layoutHorizontalLinePercents.push(layout.top + layout.height / 2);
                            layoutHorizontalLinePercents.push(layout.top + layout.height);
                            layoutVerticalLinePercents.push(layout.left);
                            layoutVerticalLinePercents.push(layout.left + layout.width / 2);
                            layoutVerticalLinePercents.push(layout.left + layout.width);
                        });
                    }
                });

                var pixelWidthInCanvas = 0;
                var pixelHeightInCanvas = 0;
                var horizontalDistancePercent = 0;
                var verticalDistancePercent = 0;
                var watcher2 = scope.$watchGroup(['pixelHorizontal', 'pixelVertical'], function (args) {
                    var pixelHorizontal = args[0];
                    var pixelVertical = args[1];
                    if (pixelHorizontal > pixelVertical) {
                        pixelWidthInCanvas = 1000;
                        pixelHeightInCanvas = (pixelVertical / pixelHorizontal) * 1000;
                    } else {
                        pixelWidthInCanvas = (pixelHorizontal / pixelVertical) * 1000;
                        pixelHeightInCanvas = 1000;
                    }
                    horizontalDistancePercent = 20 * 100 / pixelHorizontal;
                    verticalDistancePercent = 20 * 100 / pixelVertical;
                });

                //销毁时清除
                scope.$on('$destroy', function () {
                    watcher();//清除监视
                    watcher2();
                    watcher3();
                    watcher4();
                });

                var ctx = element.find('canvas')[0].getContext("2d");
                var horizontalLinePercents = [];
                var verticalLinePercents = [];
                var horizontalCanvasLine = null;
                var verticalCanvasLine = null;
                var horizontalPercent = null;
                var verticalPercent = null;

                function getNearest(arr, distance, val) {
                    var nearest = arr.min(function (item) {
                        return Math.abs(item - val);
                    });
                    if (nearest !== null && Math.abs(nearest - val) > distance) {
                        return null;
                    }
                    return nearest;
                }

                function redraw() {
                    ctx.clearRect(0, 0, 1000, 1000);

                    if (scope.isShowGridding) {
                        ctx.beginPath();
                        ctx.save();
                        ctx.translate(500, 500);

                        ctx.lineWidth = 1;
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';

                        for (var i = 0; i < 20; i++) {
                            var ins = i * 25;
                            //画横向线
                            ctx.moveTo(-500, ins);
                            ctx.lineTo(500, ins);
                            ctx.moveTo(-500, -ins);
                            ctx.lineTo(500, -ins);

                            //画纵向线
                            ctx.moveTo(-ins, -500);
                            ctx.lineTo(-ins, 500);
                            ctx.moveTo(ins, -500);
                            ctx.lineTo(ins, 500);
                        }

                        ctx.stroke();
                        ctx.restore();
                    }


                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#00a0e9';

                    if (scope.autoAnchor) {
                        if (horizontalCanvasLine !== null) {
                            var pixelTopInCanvas = (1000 - pixelHeightInCanvas) / 2 + horizontalCanvasLine * pixelHeightInCanvas / 100;
                            //画虚线
                            (function () {
                                for (var i = 0; i < 50; i++) {
                                    ctx.moveTo(20 * i + 4, pixelTopInCanvas);
                                    ctx.lineTo(20 * i + 16, pixelTopInCanvas);
                                }
                            })();
                        }

                        if (verticalCanvasLine != null) {
                            var pixelLeftInCanvas = (1000 - pixelWidthInCanvas) / 2 + verticalCanvasLine * pixelWidthInCanvas / 100;
                            //画虚线
                            (function () {
                                for (var i = 0; i < 50; i++) {
                                    ctx.moveTo(pixelLeftInCanvas, 20 * i + 4);
                                    ctx.lineTo(pixelLeftInCanvas, 20 * i + 16);
                                }
                            })();
                        }
                    }

                    ctx.stroke();
                }

                scope.$on('drag-start-x', function (event, data) {
                    verticalLinePercents = layoutVerticalLinePercents.slice(0);
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-x', function (event) {
                    var layout = scope.cache.currentElement.layout;
                    var nearestHorizontalLeft = getNearest(verticalLinePercents, horizontalDistancePercent, layout.left);
                    var nearestHorizontalCenter = getNearest(verticalLinePercents, horizontalDistancePercent, layout.left + layout.width / 2);
                    var nearestHorizontalRight = getNearest(verticalLinePercents, horizontalDistancePercent, layout.left + layout.width);
                    //console.log(nearestHorizontalLeft);
                    //console.log(nearestHorizontalCenter);
                    //console.log(nearestHorizontalRight);

                    var distances = [];
                    if (nearestHorizontalLeft !== null) {
                        distances.push({
                            type: 1,//左边
                            value: Math.abs(nearestHorizontalLeft - layout.left)
                        });
                    }
                    if (nearestHorizontalCenter !== null) {
                        distances.push({
                            type: 2,//中间
                            value: Math.abs(nearestHorizontalCenter - layout.left - layout.width / 2)
                        });
                    }
                    if (nearestHorizontalRight !== null) {
                        distances.push({
                            type: 3,//右边
                            value: Math.abs(nearestHorizontalRight - layout.left - layout.width)
                        });
                    }

                    if (distances.length !== 0) {
                        var minDistance = distances.min(function (item) {
                            return item.value;
                        });
                        if (minDistance.type === 1) {//左边对齐
                            if (nearestHorizontalLeft + layout.width <= 100) {
                                if (nearestHorizontalLeft !== verticalCanvasLine) {
                                    verticalPercent = verticalCanvasLine = nearestHorizontalLeft;
                                    redraw();
                                }
                            }
                        } else if (minDistance.type === 2) {//中间对齐
                            if (nearestHorizontalCenter >= layout.width / 2 && nearestHorizontalCenter <= 100 - layout.width / 2) {
                                if (nearestHorizontalCenter !== verticalCanvasLine) {
                                    verticalCanvasLine = nearestHorizontalCenter;
                                    verticalPercent = nearestHorizontalCenter - layout.width / 2;
                                    redraw();
                                }
                            }
                        } else if (minDistance.type === 3) {//右边对齐
                            if (nearestHorizontalRight >= layout.width) {
                                if (nearestHorizontalRight !== verticalCanvasLine) {
                                    verticalCanvasLine = nearestHorizontalRight;
                                    verticalPercent = nearestHorizontalRight - layout.width;
                                    redraw();
                                }
                            }
                        }
                    } else {
                        if (verticalCanvasLine !== null) {
                            verticalPercent = verticalCanvasLine = null;
                            redraw();
                        }
                    }
                });

                scope.$on('drag-start-y', function (event, data) {
                    horizontalLinePercents = layoutHorizontalLinePercents.slice(0);
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-y', function (event) {
                    var layout = scope.cache.currentElement.layout;
                    var nearestHorizontalTop = getNearest(horizontalLinePercents, verticalDistancePercent, layout.top);
                    var nearestHorizontalMiddle = getNearest(horizontalLinePercents, verticalDistancePercent, layout.top + layout.height / 2);
                    var nearestHorizontalBottom = getNearest(horizontalLinePercents, verticalDistancePercent, layout.top + layout.height);
                    //console.log(nearestHorizontalTop);
                    //console.log(nearestHorizontalMiddle);
                    //console.log(nearestHorizontalBottom);

                    var distances = [];
                    if (nearestHorizontalTop !== null) {
                        distances.push({
                            type: 1,//顶部
                            value: Math.abs(nearestHorizontalTop - layout.top)
                        });
                    }
                    if (nearestHorizontalMiddle !== null) {
                        distances.push({
                            type: 2,//中间
                            value: Math.abs(nearestHorizontalMiddle - layout.top - layout.height / 2)
                        });
                    }
                    if (nearestHorizontalBottom !== null) {
                        distances.push({
                            type: 3,//底部
                            value: Math.abs(nearestHorizontalBottom - layout.top - layout.height)
                        });
                    }

                    if (distances.length !== 0) {
                        var minDistance = distances.min(function (item) {
                            return item.value;
                        });
                        if (minDistance.type === 1) {//顶部对齐
                            if (nearestHorizontalTop + layout.height <= 100) {
                                if (nearestHorizontalTop !== horizontalCanvasLine) {
                                    horizontalPercent = horizontalCanvasLine = nearestHorizontalTop;
                                    redraw();
                                }
                            }
                        } else if (minDistance.type === 2) {//中间对齐
                            if (nearestHorizontalMiddle >= layout.height / 2 && nearestHorizontalMiddle <= 100 - layout.height / 2) {
                                if (nearestHorizontalMiddle !== horizontalCanvasLine) {
                                    horizontalCanvasLine = nearestHorizontalMiddle;
                                    horizontalPercent = nearestHorizontalMiddle - layout.height / 2;
                                    redraw();
                                }
                            }
                        } else if (minDistance.type === 3) {//底部对齐
                            if (nearestHorizontalBottom >= layout.height) {
                                if (nearestHorizontalBottom !== horizontalCanvasLine) {
                                    horizontalCanvasLine = nearestHorizontalBottom;
                                    horizontalPercent = nearestHorizontalBottom - layout.height;
                                    redraw();
                                }
                            }
                        }
                    } else {
                        if (horizontalCanvasLine !== null) {
                            horizontalPercent = horizontalCanvasLine = null;
                            redraw();
                        }
                    }
                });

                scope.$on('drag-start-n', function (event, data) {
                    horizontalLinePercents = layoutHorizontalLinePercents.filter(function (p) {
                        return p < data.startTop + data.startHeight;
                    });
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-n', function (event) {
                    var nearestHorizontal = getNearest(horizontalLinePercents, verticalDistancePercent, scope.cache.currentElement.layout.top);
                    if (nearestHorizontal !== horizontalCanvasLine) {
                        horizontalPercent = horizontalCanvasLine = nearestHorizontal;
                        redraw();
                    }
                });

                scope.$on('drag-start-s', function (event, data) {
                    horizontalLinePercents = layoutHorizontalLinePercents.filter(function (p) {
                        return p > data.startTop;
                    });
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-s', function (event) {
                    var nearestHorizontal = getNearest(horizontalLinePercents, verticalDistancePercent, scope.cache.currentElement.layout.top + scope.cache.currentElement.layout.height);
                    if (nearestHorizontal !== horizontalCanvasLine) {
                        horizontalPercent = horizontalCanvasLine = nearestHorizontal;
                        redraw();
                    }
                });

                scope.$on('drag-start-w', function (event, data) {
                    verticalLinePercents = layoutVerticalLinePercents.filter(function (p) {
                        return p < data.startLeft + data.startWidth;
                    });
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-w', function (event) {
                    var nearestVertical = getNearest(verticalLinePercents, horizontalDistancePercent, scope.cache.currentElement.layout.left);
                    if (nearestVertical !== verticalCanvasLine) {
                        verticalPercent = verticalCanvasLine = nearestVertical;
                        redraw();
                    }
                });

                scope.$on('drag-start-e', function (event, data) {
                    verticalLinePercents = layoutVerticalLinePercents.filter(function (p) {
                        return p > data.startLeft;
                    });
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                });

                scope.$on('drag-move-e', function (event) {
                    var nearestVertical = getNearest(verticalLinePercents, horizontalDistancePercent, scope.cache.currentElement.layout.left + scope.cache.currentElement.layout.width);
                    if (nearestVertical !== verticalCanvasLine) {
                        verticalPercent = verticalCanvasLine = nearestVertical;
                        redraw();
                    }
                });

                scope.$on('drag-end', function (event, callback) {
                    if (scope.autoAnchor) {
                        callback(horizontalPercent, verticalPercent);
                    } else {
                        callback(null, null);
                    }
                    horizontalCanvasLine = null;
                    verticalCanvasLine = null;
                    horizontalPercent = null;
                    verticalPercent = null;
                    redraw();
                });

            }
        };
    });


    //文字视图
    app.directive('editorElementText', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementText.html',
            scope: {
                data: '='
            }
        };
    });

    //文字/走马灯混合体
    app.directive('editorElementTextMarquee', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementTextMarquee.html',
            scope: {
                data: '=',
                backGround: '=',
                originalPixel: '='
            },
            link: function (scope, elements, attrs) {
                var watcher = scope.$watchGroup(['data.speed', 'data.value', 'data.size', 'data.font'], function (args) {
                    var speed = args[0], value = args[1], size = args[2], font = args[3];
                    var outerAnimName = 'marquee-left-container';
                    var innerAnimName = 'marquee-left-text';
                    //marqueeDOM.clientWidth
                    window.setTimeout(function () {
                        var outerWidth = elements[0].clientWidth;
                        var innerWidth = elements.find('span')[0].clientWidth;
                        //console.log(outerWidth, innerWidth);
                        scope.$apply(function () {
                            var seconds = (outerWidth + innerWidth) * 400 / speed / scope.originalPixel;
                            scope.outerAnimationStyle = outerAnimName + ' ' + seconds + 's linear infinite';
                            scope.innerAnimationStyle = innerAnimName + ' ' + seconds + 's linear infinite';
                        });
                    }, 0);
                });

                //销毁时清除
                scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }
        };
    });


    //文字/走马灯混合体
    app.directive('editorElementTextMarqueeThumb', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementTextMarqueeThumb.html',
            scope: {
                data: '=',
                originalPixel: '='
            },
            link: function (scope, elements, attrs) {

            }
        };
    });


    //跑马灯视图
    app.directive('editorElementMarquee', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementMarquee.html',
            scope: {
                data: '=',
                originalPixel: '='
            },
            link: function (scope, elements, attrs) {
                var watcher = scope.$watchGroup(['data.isLeft', 'data.speed', 'data.value', 'data.size', 'data.font'], function (args) {
                    var isLeft = args[0], speed = args[1], value = args[2], size = args[3], font = args[4];
                    var outerAnimName = isLeft ? 'marquee-left-container' : 'marquee-right-container';
                    var innerAnimName = isLeft ? 'marquee-left-text' : 'marquee-right-text';
                    //marqueeDOM.clientWidth
                    window.setTimeout(function () {
                        var outerWidth = elements[0].clientWidth;
                        var innerWidth = elements.find('span')[0].clientWidth;
                        //console.log(outerWidth, innerWidth);
                        scope.$apply(function () {
                            var seconds = (outerWidth + innerWidth) * 400 / speed / scope.originalPixel;
                            scope.outerAnimationStyle = outerAnimName + ' ' + seconds + 's linear infinite';
                            scope.innerAnimationStyle = innerAnimName + ' ' + seconds + 's linear infinite';
                        });
                    }, 0);
                });

                //销毁时清除
                scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }
        };
    });


    //图片视图
    app.directive('editorElementImage', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementImage.html',
            scope: {
                data: '='
            }
        };
    });


    //轮播图指令
    app.directive('editorElementCarousel', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementCarousel.html',
            scope: {
                data: '=',
                originalPixel: '='
            },
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var inAnims = [
                    {id: 1, name: "右入", value: "right-slide-in"},
                    {id: 2, name: "左入", value: "left-slide-in"},
                    {id: 3, name: "上入", value: "top-slide-in"},
                    {id: 4, name: "下入", value: "bottom-slide-in"},
                    {id: 5, name: "淡入", value: "fade-in"},
                    {id: 6, name: "旋入", value: "rotateY-in"}
                ];
                var outAnims = [
                    {id: 1, name: "左出", value: "left-slide-out"},
                    {id: 2, name: "右出", value: "right-slide-out"},
                    {id: 3, name: "下出", value: "bottom-slide-out"},
                    {id: 4, name: "上出", value: "top-slide-out"},
                    {id: 5, name: "淡出", value: "fade-out"},
                    {id: 6, name: "旋出", value: "rotateY-out"}
                ];

                function doSomething() {
                    var inAnim = inAnims.find(function (item) {
                        return item.id === $scope.data.animation.inId;
                    });

                    var outAnim = outAnims.find(function (item) {
                        return item.id === $scope.data.animation.outId;
                    });

                    $scope.inAnimation = inAnim ? inAnim.value : inAnims[0].value;//进场动画
                    $scope.outAnimation = outAnim ? outAnim.value : outAnims[0].value;//出场动画


                    //计算展示的画面
                    var count = $scope.data.images.length;//长度可能会变化，因此每次使用前获取
                    if (count === 0) {
                        $scope.prevIndex = -1;
                        $scope.nextIndex = 0;
                    } else {
                        $scope.prevIndex = $scope.nextIndex;
                        $scope.nextIndex = ($scope.nextIndex + 1) % count;
                    }
                    //if ($scope.data.images.length !== 0) {
                    //    $scope.prevIndex = $scope.data.images.length - 1;
                    //    $scope.nextIndex = 0;
                    //}
                }

                doSomething();

                $scope.prevIndex = $scope.data.images.length - 1;
                $scope.nextIndex = 0;

                var timer = $timeout(function () {

                    doSomething();

                    timer = $timeout(arguments.callee, $scope.data.stay * 1000 + $scope.data.duration);

                }, $scope.data.stay * 1000 + $scope.data.duration);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    $timeout.cancel(timer);
                    timer = null;
                });
            }]
        };
    });


    //轮播图指令（预览）
    app.directive('editorElementCarouselView', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementCarouselView.html',
            scope: {
                data: '=',
                originalPixel: '='
            },
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                var inAnims = [
                    {id: 1, name: "右入", value: "right-slide-in"},
                    {id: 2, name: "左入", value: "left-slide-in"},
                    {id: 3, name: "上入", value: "top-slide-in"},
                    {id: 4, name: "下入", value: "bottom-slide-in"},
                    {id: 5, name: "淡入", value: "fade-in"},
                    {id: 6, name: "旋入", value: "rotateY-in"}
                ];
                var outAnims = [
                    {id: 1, name: "左出", value: "left-slide-out"},
                    {id: 2, name: "右出", value: "right-slide-out"},
                    {id: 3, name: "下出", value: "bottom-slide-out"},
                    {id: 4, name: "上出", value: "top-slide-out"},
                    {id: 5, name: "淡出", value: "fade-out"},
                    {id: 6, name: "旋出", value: "rotateY-out"}
                ];

                function doSomething() {
                    var inAnim = inAnims.find(function (item) {
                        return item.id === $scope.data.animation.inId;
                    });

                    var outAnim = outAnims.find(function (item) {
                        return item.id === $scope.data.animation.outId;
                    });

                    $scope.inAnimation = inAnim ? inAnim.value : inAnims[0].value;//进场动画
                    $scope.outAnimation = outAnim ? outAnim.value : outAnims[0].value;//出场动画


                    //计算展示的画面
                    var count = $scope.data.images.length;//长度可能会变化，因此每次使用前获取
                    if (count === 0) {
                        $scope.prevIndex = -1;
                        $scope.nextIndex = 0;
                    } else {
                        $scope.prevIndex = $scope.nextIndex;
                        $scope.nextIndex = ($scope.nextIndex + 1) % count;
                    }
                    //if ($scope.data.images.length !== 0) {
                    //    $scope.prevIndex = $scope.data.images.length - 1;
                    //    $scope.nextIndex = 0;
                    //}
                }

                doSomething();

                $scope.prevIndex = $scope.data.images.length - 1;
                $scope.nextIndex = 0;

                var timer = $timeout(function () {

                    doSomething();

                    timer = $timeout(arguments.callee, $scope.data.stay * 1000 + $scope.data.duration);

                }, $scope.data.stay * 1000 + $scope.data.duration);

                //销毁时清除
                $scope.$on('$destroy', function () {
                    $timeout.cancel(timer);
                    timer = null;
                });
            }]
        };
    });


    //视频视图
    app.directive('editorElementVideo', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementVideo.html',
            scope: {
                data: '='
            }
        };
    });


    //多视频指令
    app.directive('editorElementSerie', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementSerie.html',
            scope: {
                data: '='
            }
        };
    });


    //多视频指令（预览）
    app.directive('editorElementSerieView', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementSerieView.html',
            scope: {
                data: '='
            },
            link: function (scope, elements, attrs) {

                function createVideoDOM() {
                    var videoDOM = document.createElement('video');
                    videoDOM.classList.add('editor-element-full');
                    videoDOM.classList.add('editor-element-video-fill');
                    videoDOM.setAttribute('preload', 'auto');
                    videoDOM.muted = scope.data.isMuted;
                    return videoDOM;
                }

                var lastVideoDOM = null;
                var videoQueue = null;

                function onVideoEnded() {
                    var that = this;
                    that.src = videoQueue.next().url;
                    that.load();
                    that.play();
                }

                var watcher = scope.$watchCollection('data.videos', function (videos) {
                    if (lastVideoDOM) {
                        lastVideoDOM.removeEventListener('ended', onVideoEnded);
                        lastVideoDOM = null;
                    }

                    elements.empty();

                    if (videos.length !== 0) {
                        videoQueue = new CycleQueue(videos, false);
                        var videoDOM = lastVideoDOM = createVideoDOM();
                        elements[0].appendChild(videoDOM);
                        videoDOM.addEventListener('ended', onVideoEnded);
                        videoDOM.src = videoQueue.current().url;
                        videoDOM.load();
                        videoDOM.play();
                    }
                });

                //销毁时清除
                scope.$on('$destroy', function () {
                    watcher();//清除监视

                    if (lastVideoDOM) {
                        lastVideoDOM.removeEventListener('ended', onVideoEnded);
                        lastVideoDOM = null;
                    }
                });
            }
        };
    });


    //时间视图
    app.directive('editorElementTime', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementTime.html',
            scope: {
                data: '='
            },
            controller: ['$scope', '$interval', function ($scope, $interval) {
                $scope.nowTime = new Date();
                var timer = $interval(function () {
                    $scope.nowTime = new Date();
                }, 997);
                //销毁时清除
                $scope.$on('$destroy', function () {
                    $interval.cancel(timer);
                    timer = null;
                });
            }]
        };
    });

    //时间视图
    app.directive('editorElementTimeThumb', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementTimeThumb.html',
            scope: {
                data: '='
            }
        };
    });


    //网页视图
    app.directive('editorElementWebview', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementWebview.html',
            scope: {
                data: '='
            }
        };
    });


    //拖拽元素
    app.directive('editorElementDragger', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementDragger.html',
            scope: {
                //当选取单图片时
                onSelectSingleImage: '&',
                //当选取多图片时
                onSelectMultipleImage: '&',
                //当选取单个视频时
                onSelectSingleVideo: '&',
                //当选取多个视频时
                onSelectMultipleVideo: '&',
                pixelHorizontal: '=',
                pixelVertical: '=',
                horizontalSize: '=',
                verticalSize: '=',
                fontSize: '=',
                cache: '=',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {
                ////删除
                //$scope.deleteElement = function ($event) {
                //    $event.stopPropagation();
                //    $scope.cache.currentPage.elements.remove($scope.cache.currentElement);
                //    $scope.cache.currentElement = null;
                //};

                //快捷键
                (function () {
                    var xPercentPerPixel = 100 / $scope.pixelHorizontal;
                    var yPercentPerPixel = 100 / $scope.pixelVertical;

                    function onKeyDown(e) {
                        if (!e.ctrlKey && !e.altKey && e.which !== 46) {//ctrl和alt键都没有被按下，也不是delete键
                            $scope.$apply(function () {
                                var layout = $scope.cache.currentElement.layout;
                                var oldLeft = layout.left;
                                var oldTop = layout.top;
                                switch (e.which) {
                                    case 37://left
                                        e.preventDefault();
                                        if (layout.left > 0) {
                                            $scope.commit({
                                                undo: function () {
                                                    layout.left = oldLeft;
                                                },
                                                redo: function () {
                                                    var nowLeft = layout.left - xPercentPerPixel;
                                                    if (nowLeft < 0) {
                                                        layout.left = 0;
                                                    } else {
                                                        layout.left = nowLeft;
                                                    }
                                                }
                                            });
                                        }
                                        break;
                                    case 38://top
                                        e.preventDefault();
                                        if (layout.top > 0) {
                                            $scope.commit({
                                                undo: function () {
                                                    layout.top = oldTop;
                                                },
                                                redo: function () {
                                                    var nowTop = layout.top - yPercentPerPixel;
                                                    if (nowTop < 0) {
                                                        layout.top = 0;
                                                    } else {
                                                        layout.top = nowTop;
                                                    }
                                                }
                                            });
                                        }
                                        break;
                                    case 39://right
                                        e.preventDefault();
                                        if (layout.left + layout.width < 100) {
                                            $scope.commit({
                                                undo: function () {
                                                    layout.left = oldLeft;
                                                },
                                                redo: function () {
                                                    var nowLeft = layout.left + xPercentPerPixel;
                                                    if (nowLeft > 100 - layout.width) {
                                                        layout.left = 100 - layout.width;
                                                    } else {
                                                        layout.left = nowLeft;
                                                    }
                                                }
                                            });
                                        }
                                        break;
                                    case 40://bottom
                                        e.preventDefault();
                                        if (layout.top + layout.height < 100) {
                                            $scope.commit({
                                                undo: function () {
                                                    layout.top = oldTop;
                                                },
                                                redo: function () {
                                                    var nowTop = layout.top + yPercentPerPixel;
                                                    if (nowTop > 100 - layout.height) {
                                                        layout.top = 100 - layout.height;
                                                    } else {
                                                        layout.top = nowTop;
                                                    }
                                                }
                                            });
                                        }
                                        break;
                                    default :
                                        break;
                                }
                            });
                        }
                    }

                    document.addEventListener('keydown', onKeyDown, false);

                    //销毁时清除
                    $scope.$on('$destroy', function () {
                        document.removeEventListener('keydown', onKeyDown, false);
                    });
                })();

                // $scope.draggerLayoutStyle = {
                //     'left': '0',
                //     'top': '0',
                //     'width': '100%',
                //     'height': '100%'
                // };
                //
                // var watcher2 = $scope.$watch('fontSize', function (fontSize) {
                //     $scope.draggerLayoutStyle['font-size'] = fontSize + 'px';
                // });
                //
                // //监控布局变化
                // var watcher = $scope.$watch('cache.currentElement.layout', function (layout) {
                //     switch (layout.ver) {
                //         case 1:
                //             var layoutStyle = $scope.draggerLayoutStyle;
                //             layoutStyle['left'] = layout.left + '%';
                //             layoutStyle['top'] = layout.top + '%';
                //             layoutStyle['width'] = layout.width + '%';
                //             layoutStyle['height'] = layout.height + '%';
                //
                //             if (layout.rotate % 360 !== 0) {//小优化
                //                 layoutStyle['-webkit-transform']
                //                     = layoutStyle['-webkit-transform']
                //                     = layoutStyle['-moz-transform']
                //                     = layoutStyle['-ms-transform']
                //                     = layoutStyle['-o-transform']
                //                     = layoutStyle['transform']
                //                     = 'rotate(' + layout.rotate + 'deg)';
                //             }
                //             break;
                //         default :
                //             break;
                //     }
                // }, true);
                //
                // //销毁时清除
                // $scope.$on('$destroy', function () {
                //     watcher();//清除监视
                //     watcher2();
                // });

            }],
            link: function (scope, elements, attrs) {
                var dotts = elements.find('span');
                var this_dom = elements[0];
                var dot_nw = dotts[0];//左上
                var dot_n = dotts[1];//中上
                var dot_ne = dotts[2];//右上
                var dot_w = dotts[3];//左中
                var dot_e = dotts[4];//右中
                var dot_sw = dotts[5];//左下
                var dot_s = dotts[6];//中下
                var dot_se = dotts[7];//右下
                var btn_close = elements.find('button')[0];

                (function () {

                    function deleteCurrentElement() {
                        var cache = scope.cache;
                        var oldPage = cache.currentPage;
                        var elements = oldPage.elements;
                        var oldEle = cache.currentElement;
                        var index = elements.indexOf(oldEle);

                        scope.commit({
                            undo: function () {
                                elements.splice(index, 0, oldEle);
                                if (cache.currentPage === oldPage) {
                                    cache.currentElement = oldEle;
                                }
                            },
                            redo: function () {
                                elements.splice(index, 1);
                                cache.currentElement = null;
                            }
                        });
                    }

                    function closeClick(e) {
                        e.stopPropagation();
                        scope.$apply(deleteCurrentElement);
                    }

                    btn_close.addEventListener('click', closeClick, false);
                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        btn_close.removeEventListener('click', closeClick, false);
                    });

                    scope.$on('editor-ele-deleted', deleteCurrentElement);
                })();

                //右键菜单
                (function () {

                    function onContextmenu(e) {
                        e.preventDefault();
                        //console.log(e);
                    }

                    this_dom.addEventListener('contextmenu', onContextmenu, false);

                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        this_dom.removeEventListener('contextmenu', onContextmenu, false);
                    });
                })();

                //双击事件
                (function () {
                    function dbClick(e) {
                        e.stopPropagation();
                        var curEle = scope.cache.currentElement;
                        if (curEle.type === 200) {
                            var data = curEle.data;
                            scope.onSelectSingleImage({
                                image: data.image,
                                callback: function (newImage) {
                                    var oldImage = data.image;
                                    scope.commit({
                                        undo: function () {
                                            data.image = oldImage;
                                        },
                                        redo: function () {
                                            data.image = newImage;
                                        }
                                    });
                                }
                            });
                        } else if (curEle.type === 250) {
                            var images = curEle.data.images;
                            scope.onSelectMultipleImage({
                                images: images,
                                callback: function (newImages) {
                                    var oldImages = images.slice(0);
                                    scope.commit({
                                        undo: function () {
                                            images.clear();//清空
                                            oldImages.forEach(function (image) {
                                                images.push(image);
                                            });
                                        },
                                        redo: function () {
                                            images.clear();//清空
                                            newImages.forEach(function (image) {
                                                images.push(image);
                                            });
                                        }
                                    });
                                }
                            });
                        } else if (curEle.type === 300) {
                            var data = curEle.data;
                            scope.onSelectSingleVideo({
                                video: data.video,
                                callback: function (newVideo) {
                                    var oldVideo = data.video;
                                    scope.commit({
                                        undo: function () {
                                            data.video = oldVideo;
                                        },
                                        redo: function () {
                                            data.video = newVideo;
                                        }
                                    });
                                }
                            });
                        } else if (curEle.type === 350) {
                            var videos = curEle.data.videos;
                            scope.onSelectMultipleVideo({
                                videos: videos,
                                callback: function (newVideos) {
                                    var oldVideos = videos.slice(0);
                                    scope.commit({
                                        undo: function () {
                                            videos.clear();//清空
                                            oldVideos.forEach(function (video) {
                                                videos.push(video);
                                            });
                                        },
                                        redo: function () {
                                            videos.clear();//清空
                                            newVideos.forEach(function (video) {
                                                videos.push(video);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }

                    this_dom.addEventListener('dblclick', dbClick, false);
                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        this_dom.removeEventListener('dblclick', dbClick, false);
                    });
                })();

                //防止点击冒泡
                (function () {
                    var func = function (e) {
                        e.stopPropagation();
                    };
                    this_dom.addEventListener('click', func, false);
                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        this_dom.removeEventListener('click', func, false);
                    });
                })();


                //位置拖拽
                (function () {
                    var isStart = false;
                    var startX = 0, startY = 0;
                    var startLeft = 0, startTop = 0;
                    var startWidth = 0, startHeight = 0;
                    var cur_dot = null;

                    function move(percentX, percentY) {
                        var layout = scope.cache.currentElement.layout;

                        var nowLeft = startLeft + percentX;
                        var nowTop = startTop + percentY;

                        if (nowLeft < 0) {
                            layout.left = 0;
                        } else if (nowLeft > 100 - startWidth) {
                            layout.left = 100 - startWidth;
                        } else {
                            layout.left = nowLeft;
                            if (percentX !== 0) {
                                scope.$emit('dragMoveX');
                            }
                        }

                        if (nowTop < 0) {
                            layout.top = 0;
                        } else if (nowTop > 100 - startHeight) {
                            layout.top = 100 - startHeight;
                        } else {
                            layout.top = nowTop;
                            if (percentY !== 0) {
                                scope.$emit('dragMoveY');
                            }
                        }

                        //layout.left = startLeft + percentX;
                        //layout.top = startTop + percentY;
                    }

                    function drag_n(percentY) {
                        if (percentY === 0) {
                            return;
                        }
                        var layout = scope.cache.currentElement.layout;
                        var mHeight = startHeight - percentY;
                        if (mHeight > 0) {
                            var nowTop = startTop + percentY;
                            if (nowTop < 0) {
                                layout.top = 0;
                                layout.height = startHeight + startTop;
                            } else {
                                layout.top = nowTop;
                                layout.height = mHeight;
                                scope.$emit('dragMoveN');
                            }

                            //layout.top = startTop + percentY;
                            //layout.height = mHeight;
                        } else {
                            layout.top = startTop + startHeight;
                            layout.height = 0;
                        }
                    }

                    function drag_s(percentY) {
                        if (percentY === 0) {
                            return;
                        }
                        var layout = scope.cache.currentElement.layout;
                        var mHeight = startHeight + percentY;
                        if (mHeight > 0) {
                            if (mHeight > 100 - startTop) {
                                layout.height = 100 - startTop;
                            } else {
                                layout.height = mHeight;
                                scope.$emit('dragMoveS');
                            }
                        } else {
                            layout.height = 0;
                        }

                        //layout.height = mHeight > 0 ? mHeight : 0;
                    }

                    function drag_w(percentX) {
                        if (percentX === 0) {
                            return;
                        }
                        var layout = scope.cache.currentElement.layout;
                        var mWidth = startWidth - percentX;
                        if (mWidth > 0) {
                            var nowLeft = startLeft + percentX;
                            if (nowLeft < 0) {
                                layout.left = 0;
                                layout.width = startWidth + startLeft;
                            } else {
                                layout.left = nowLeft;
                                layout.width = mWidth;
                                scope.$emit('dragMoveW');
                            }

                            //layout.left = startLeft + percentX;
                            //layout.width = mWidth;
                        } else {
                            layout.left = startLeft + startWidth;
                            layout.width = 0;
                        }
                    }

                    function drag_e(percentX) {
                        if (percentX === 0) {
                            return;
                        }
                        var layout = scope.cache.currentElement.layout;
                        var mWidth = startWidth + percentX;
                        if (mWidth > 0) {
                            if (mWidth > 100 - startLeft) {
                                layout.width = 100 - startLeft;
                            } else {
                                layout.width = mWidth;
                                scope.$emit('dragMoveE');
                            }
                        } else {
                            layout.width = 0;
                        }

                        //layout.width = mWidth > 0 ? mWidth : 0;
                    }

                    function isFromDragger(e) {
                        var target = e.target;
                        return (target === this_dom
                            || target === dot_nw
                            || target === dot_n
                            || target === dot_ne
                            || target === dot_w
                            || target === dot_e
                            || target === dot_sw
                            || target === dot_s
                            || target === dot_se
                            || target === btn_close);
                    }

                    var mousedownFunc = function (e) {
                        if (isFromDragger(e)) {
                            e.stopPropagation();
                            var layout = scope.cache.currentElement.layout;
                            if (e.button === 0 || e.which === 1) {//鼠标左键
                                isStart = true;
                                startX = e.pageX;
                                startY = e.pageY;
                                startLeft = layout.left;
                                startTop = layout.top;
                                startWidth = layout.width;
                                startHeight = layout.height;
                                cur_dot = e.target;

                                var startData = {
                                    startLeft: startLeft,
                                    startTop: startTop,
                                    startWidth: startWidth,
                                    startHeight: startHeight
                                };

                                if (cur_dot === this_dom) {//移动
                                    scope.$emit('dragStartX', startData);
                                    scope.$emit('dragStartY', startData);
                                } else if (cur_dot === dot_nw) {//左上
                                    scope.$emit('dragStartN', startData);
                                    scope.$emit('dragStartW', startData);
                                } else if (cur_dot === dot_n) {//上
                                    scope.$emit('dragStartN', startData);
                                } else if (cur_dot === dot_ne) {//右上
                                    scope.$emit('dragStartN', startData);
                                    scope.$emit('dragStartE', startData);
                                } else if (cur_dot === dot_w) {//左
                                    scope.$emit('dragStartW', startData);
                                } else if (cur_dot === dot_e) {//右
                                    scope.$emit('dragStartE', startData);
                                } else if (cur_dot === dot_sw) {//左下
                                    scope.$emit('dragStartW', startData);
                                    scope.$emit('dragStartS', startData);
                                } else if (cur_dot === dot_s) {//下
                                    scope.$emit('dragStartS', startData);
                                } else if (cur_dot === dot_se) {//右下
                                    scope.$emit('dragStartE', startData);
                                    scope.$emit('dragStartS', startData);
                                }
                            }
                        }
                    };

                    document.body.addEventListener('mousedown', mousedownFunc, false);

                    var mousemoveFunc = function (e) {
                        if (isFromDragger(e)) {
                            e.stopPropagation();
                        }
                        if (isStart && ((e.button === 0 || e.which === 1))) {
                            scope.$apply(function () {
                                var percentX = (e.pageX - startX) * 100 / scope.horizontalSize;
                                var percentY = (e.pageY - startY) * 100 / scope.verticalSize;

                                if (cur_dot === this_dom) {//移动
                                    move(percentX, percentY);
                                } else if (cur_dot === dot_nw) {//左上
                                    drag_w(percentX);
                                    drag_n(percentY);
                                } else if (cur_dot === dot_n) {//上
                                    drag_n(percentY);
                                } else if (cur_dot === dot_ne) {//右上
                                    drag_e(percentX);
                                    drag_n(percentY);
                                } else if (cur_dot === dot_w) {//左
                                    drag_w(percentX);
                                } else if (cur_dot === dot_e) {//右
                                    drag_e(percentX);
                                } else if (cur_dot === dot_sw) {//左下
                                    drag_w(percentX);
                                    drag_s(percentY);
                                } else if (cur_dot === dot_s) {//下
                                    drag_s(percentY);
                                } else if (cur_dot === dot_se) {//右下
                                    drag_e(percentX);
                                    drag_s(percentY);
                                }
                            });
                        }
                    };

                    document.body.addEventListener('mousemove', mousemoveFunc, false);

                    var mouseupFunc = function (e) {
                        if (isFromDragger(e)) {
                            e.stopPropagation();
                        }

                        if (isStart && ((e.button === 0 || e.which === 1))) {
                            var layout = scope.cache.currentElement.layout;
                            var nowLeft = layout.left;
                            var nowTop = layout.top;
                            var nowWidth = layout.width;
                            var nowHeight = layout.height;

                            scope.$emit('dragEnd', function (horizontalPercent, verticalPercent) {
                                if (cur_dot === this_dom) {//移动
                                    if (horizontalPercent !== null) {
                                        nowTop = horizontalPercent;
                                    }
                                    if (verticalPercent !== null) {
                                        nowLeft = verticalPercent;
                                    }
                                } else if (cur_dot === dot_nw) {//左上
                                    if (horizontalPercent !== null) {
                                        nowTop = horizontalPercent;
                                        nowHeight = startTop + startHeight - horizontalPercent;
                                    }
                                    if (verticalPercent !== null) {
                                        nowLeft = verticalPercent;
                                        nowWidth = startLeft + startWidth - verticalPercent;
                                    }
                                } else if (cur_dot === dot_n) {//上
                                    if (horizontalPercent !== null) {
                                        nowTop = horizontalPercent;
                                        nowHeight = startTop + startHeight - horizontalPercent;
                                    }
                                } else if (cur_dot === dot_ne) {//右上
                                    if (horizontalPercent !== null) {
                                        nowTop = horizontalPercent;
                                        nowHeight = startTop + startHeight - horizontalPercent;
                                    }
                                    if (verticalPercent !== null) {
                                        nowWidth = verticalPercent - startLeft;
                                    }
                                } else if (cur_dot === dot_w) {//左
                                    if (verticalPercent !== null) {
                                        nowLeft = verticalPercent;
                                        nowWidth = startLeft + startWidth - verticalPercent;
                                    }
                                } else if (cur_dot === dot_e) {//右
                                    if (verticalPercent !== null) {
                                        nowWidth = verticalPercent - startLeft;
                                    }
                                } else if (cur_dot === dot_sw) {//左下
                                    if (verticalPercent !== null) {
                                        nowLeft = verticalPercent;
                                        nowWidth = startLeft + startWidth - verticalPercent;
                                    }
                                    if (horizontalPercent !== null) {
                                        nowHeight = horizontalPercent - startTop;
                                    }
                                } else if (cur_dot === dot_s) {//下
                                    if (horizontalPercent !== null) {
                                        nowHeight = horizontalPercent - startTop;
                                    }
                                } else if (cur_dot === dot_se) {//右下
                                    if (verticalPercent !== null) {
                                        nowWidth = verticalPercent - startLeft;
                                    }
                                    if (horizontalPercent !== null) {
                                        nowHeight = horizontalPercent - startTop;
                                    }
                                }

                                if (nowLeft !== startLeft
                                    || nowTop !== startTop
                                    || nowWidth !== startWidth
                                    || nowHeight !== startHeight) {

                                    var oldLeft = startLeft;
                                    var oldTop = startTop;
                                    var oldWidth = startWidth;
                                    var oldHeight = startHeight;
                                    scope.$apply(function () {
                                        scope.commit({
                                            undo: function () {
                                                layout.left = oldLeft;
                                                layout.top = oldTop;
                                                layout.width = oldWidth;
                                                layout.height = oldHeight;
                                            },
                                            redo: function () {
                                                layout.left = nowLeft;
                                                layout.top = nowTop;
                                                layout.width = nowWidth;
                                                layout.height = nowHeight;
                                            }
                                        });
                                    });
                                } else {//之前本身就与线对齐的情况下需要重置
                                    scope.$apply(function () {
                                        layout.left = nowLeft;
                                        layout.top = nowTop;
                                        layout.width = nowWidth;
                                        layout.height = nowHeight;
                                    });
                                }
                            });
                        }

                        isStart = false;
                        cur_dot = null;
                    };

                    document.body.addEventListener('mouseup', mouseupFunc, false);

                    //销毁时移除事件
                    scope.$on('$destroy', function () {
                        document.body.removeEventListener('mouseup', mouseupFunc, false);
                        document.body.removeEventListener('mousemove', mousemoveFunc, false);
                        document.body.removeEventListener('mousedown', mousedownFunc, false);
                    });
                })();

            }
        };
    });

})(angular.module('qmedia.editor'));
