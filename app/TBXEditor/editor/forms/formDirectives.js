(function (app) {

    //获取当前脚本路径
    var currentScriptFolder = (function () {
        var scripts = document.getElementsByTagName("script");
        var currentPath = scripts[scripts.length - 1].getAttribute("src");
        var index = currentPath.lastIndexOf("/");
        return currentPath.substring(0, index + 1);
    })();

    //布局属性编辑
    app.directive('editorFormLayout', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormLayout.html',
            scope: {
                layout: '=',
                pixelHorizontal: '=',
                pixelVertical: '=',
                page: '=',//用于图层置顶/底
                commit: '&'
            },
            controller: ['$scope', function ($scope) {

                //$scope.pixelWidthBlur = function (pixelWidth, $event) {
                //    if (pixelWidth < 0 || pixelWidth > $scope.pixelHorizontal - $scope.rect.pixelLeft) {
                //        window.alert('取值范围有误!');
                //    }
                //};

                $scope.rect = {
                    pixelWidth: 0,
                    pixelHeight: 0,
                    pixelLeft: 0,
                    pixelTop: 0
                };

                var watcher = $scope.$watchGroup(['pixelHorizontal', 'pixelVertical'], function (args) {
                    var pixelHorizontal = args[0];
                    var pixelVertical = args[1];
                    var layout = $scope.layout;
                    var rect = $scope.rect;
                    rect.pixelWidth = Math.round(pixelHorizontal * layout.width / 100);
                    rect.pixelHeight = Math.round(pixelVertical * layout.height / 100);
                    rect.pixelLeft = Math.round(pixelHorizontal * layout.left / 100);
                    rect.pixelTop = Math.round(pixelVertical * layout.top / 100);
                });

                var watcher2 = $scope.$watch('layout', function (layout) {
                    var pixelHorizontal = $scope.pixelHorizontal;
                    var pixelVertical = $scope.pixelVertical;
                    var rect = $scope.rect;
                    rect.pixelWidth = Math.round(pixelHorizontal * layout.width / 100);
                    rect.pixelHeight = Math.round(pixelVertical * layout.height / 100);
                    rect.pixelLeft = Math.round(pixelHorizontal * layout.left / 100);
                    rect.pixelTop = Math.round(pixelVertical * layout.top / 100);
                }, true);

                var watcher3 = $scope.$watch('rect', function (rect) {
                    var pixelHorizontal = $scope.pixelHorizontal;
                    var pixelVertical = $scope.pixelVertical;
                    var layout = $scope.layout;
                    layout.width = rect.pixelWidth * 100 / pixelHorizontal;
                    layout.height = rect.pixelHeight * 100 / pixelVertical;
                    layout.left = rect.pixelLeft * 100 / pixelHorizontal;
                    layout.top = rect.pixelTop * 100 / pixelVertical;
                }, true);

                //var watcher4 = $scope.$watch('rect.pixelWidth', function (pixelWidth) {
                //    var pixelHorizontal = $scope.pixelHorizontal;
                //    var rect = $scope.rect;
                //    if (pixelWidth < 0) {
                //        rect.pixelWidth = 0;
                //    } else if (pixelWidth > pixelHorizontal - rect.pixelLeft) {
                //        rect.pixelWidth = pixelHorizontal - rect.pixelLeft;
                //    }
                //});

                //销毁时移除事件
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                    watcher2();
                    watcher3();
                    //watcher4();
                });

                //左对齐
                $scope.alignLeft = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.left;
                    if (oldVal !== 0) {
                        $scope.commit({
                            undo: function () {
                                layout.left = oldVal;
                            },
                            redo: function () {
                                layout.left = 0;
                            }
                        });
                    }
                };
                //水平居中对齐
                $scope.alignCenter = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.left;
                    if (oldVal !== (100 - layout.width) / 2) {
                        $scope.commit({
                            undo: function () {
                                layout.left = oldVal;
                            },
                            redo: function () {
                                layout.left = (100 - layout.width) / 2;
                            }
                        });
                    }
                };
                //右对齐
                $scope.alignRight = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.left;
                    if (oldVal !== 100 - layout.width) {
                        $scope.commit({
                            undo: function () {
                                layout.left = oldVal;
                            },
                            redo: function () {
                                layout.left = 100 - layout.width;
                            }
                        });
                    }
                };

                //上对齐
                $scope.alignTop = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.top;
                    if (oldVal !== 0) {
                        $scope.commit({
                            undo: function () {
                                layout.top = oldVal;
                            },
                            redo: function () {
                                layout.top = 0;
                            }
                        });
                    }
                };
                //垂直居中对齐
                $scope.alignMiddle = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.top;
                    if (oldVal !== (100 - layout.height) / 2) {
                        $scope.commit({
                            undo: function () {
                                layout.top = oldVal;
                            },
                            redo: function () {
                                layout.top = (100 - layout.height) / 2;
                            }
                        });
                    }
                };
                //下对齐
                $scope.alignBottom = function () {
                    var layout = $scope.layout;
                    var oldVal = layout.top;
                    if (oldVal !== 100 - layout.height) {
                        $scope.commit({
                            undo: function () {
                                layout.top = oldVal;
                            },
                            redo: function () {
                                layout.top = 100 - layout.height;
                            }
                        });
                    }
                };

                function getOtherLayouts(layout) {
                    var otherLayouts = $scope.page.elements.map(function (item) {
                        return item.layout;
                    });
                    otherLayouts.remove(layout);
                    return otherLayouts;
                }

                function getZIndex(layout) {
                    return layout.zIndex;
                }


                //置顶
                $scope.setFront = function () {
                    var layout = $scope.layout;
                    var otherLayouts = getOtherLayouts(layout);
                    var maxZIndexLayout = otherLayouts.max(getZIndex);

                    if (maxZIndexLayout !== null) {
                        var maxZIndex = maxZIndexLayout.zIndex;
                        var oldVal = layout.zIndex;
                        if (oldVal !== maxZIndex + 1) {
                            $scope.commit({
                                undo: function () {
                                    layout.zIndex = oldVal;
                                },
                                redo: function () {
                                    layout.zIndex = maxZIndex + 1;
                                }
                            });
                        }
                    }
                };

                //置底
                $scope.setBack = function () {
                    var layout = $scope.layout;
                    var otherLayouts = getOtherLayouts(layout);
                    var minZIndexLayout = otherLayouts.min(getZIndex);

                    if (minZIndexLayout !== null) {
                        var minZIndex = minZIndexLayout.zIndex;
                        var oldVal = layout.zIndex;
                        if (oldVal !== minZIndex - 1) {
                            $scope.commit({
                                undo: function () {
                                    layout.zIndex = oldVal;
                                },
                                redo: function () {
                                    layout.zIndex = minZIndex - 1;
                                }
                            });
                        }
                    }
                };

                //当旋转时
                $scope.rotateChange = function (newVal, oldVal) {
                    var layout = $scope.layout;
                    $scope.commit({
                        undo: function () {
                            layout.rotate = oldVal;
                        },
                        redo: function () {
                            layout.rotate = newVal;
                        }
                    });
                };
            }]
        };
    });


    //边框属性编辑
    app.directive('editorFormBorder', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormBorder.html',
            scope: {
                border: '=',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {
                //当样式变化时
                $scope.styleChange = function (newVal, oldVal) {
                    var border = $scope.border;
                    $scope.commit({
                        undo: function () {
                            border.style = oldVal;
                        },
                        redo: function () {
                            border.style = newVal;
                        }
                    });
                };

                //当颜色变化时
                $scope.colorChange = function (newVal, oldVal) {
                    var border = $scope.border;
                    $scope.commit({
                        undo: function () {
                            border.color.r = oldVal.r;
                            border.color.g = oldVal.g;
                            border.color.b = oldVal.b;
                        },
                        redo: function () {
                            border.color.r = newVal.r;
                            border.color.g = newVal.g;
                            border.color.b = newVal.b;
                        }
                    });
                };

                //当宽度变化时
                $scope.widthChange = function (newVal, oldVal) {
                    var border = $scope.border;
                    $scope.commit({
                        undo: function () {
                            border.width = oldVal;
                        },
                        redo: function () {
                            border.width = newVal;
                        }
                    });
                };

                //当内边距变化时
                $scope.paddingChange = function (newVal, oldVal) {
                    var border = $scope.border;
                    $scope.commit({
                        undo: function () {
                            border.padding = oldVal;
                        },
                        redo: function () {
                            border.padding = newVal;
                        }
                    });
                };

                //当圆角变化时
                $scope.radiusChange = function (newVal, oldVal) {
                    var border = $scope.border;
                    $scope.commit({
                        undo: function () {
                            border.radius = oldVal;
                        },
                        redo: function () {
                            border.radius = newVal;
                        }
                    });
                };

                //当不透明度变化时
                $scope.opacityChange = function (newVal, oldVal) {
                    var border = $scope.border;
                    $scope.commit({
                        undo: function () {
                            border.opacity = oldVal;
                        },
                        redo: function () {
                            border.opacity = newVal;
                        }
                    });
                };
            }]
        };
    });


    //滤镜属性编辑
    app.directive('editorFormFilter', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormFilter.html',
            scope: {
                filter: '=',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {
                //当不透明度变化时
                $scope.opacityChange = function (newVal, oldVal) {
                    var filter = $scope.filter;
                    $scope.commit({
                        undo: function () {
                            filter.opacity = oldVal;
                        },
                        redo: function () {
                            filter.opacity = newVal;
                        }
                    });
                };

                //当亮度变化时
                $scope.brightnessChange = function (newVal, oldVal) {
                    var filter = $scope.filter;
                    $scope.commit({
                        undo: function () {
                            filter.brightness = oldVal;
                        },
                        redo: function () {
                            filter.brightness = newVal;
                        }
                    });
                };

                //当对比度变化时
                $scope.contrastChange = function (newVal, oldVal) {
                    var filter = $scope.filter;
                    $scope.commit({
                        undo: function () {
                            filter.contrast = oldVal;
                        },
                        redo: function () {
                            filter.contrast = newVal;
                        }
                    });
                };

                //当饱和度变化时
                $scope.saturateChange = function (newVal, oldVal) {
                    var filter = $scope.filter;
                    $scope.commit({
                        undo: function () {
                            filter.saturate = oldVal;
                        },
                        redo: function () {
                            filter.saturate = newVal;
                        }
                    });
                };

                //当灰度变化时
                $scope.grayscaleChange = function (newVal, oldVal) {
                    var filter = $scope.filter;
                    $scope.commit({
                        undo: function () {
                            filter.grayscale = oldVal;
                        },
                        redo: function () {
                            filter.grayscale = newVal;
                        }
                    });
                };

                //当反色变化时
                $scope.invertChange = function (newVal, oldVal) {
                    var filter = $scope.filter;
                    $scope.commit({
                        undo: function () {
                            filter.invert = oldVal;
                        },
                        redo: function () {
                            filter.invert = newVal;
                        }
                    });
                };

                //当模糊度变化时
                $scope.blurChange = function (newVal, oldVal) {
                    var filter = $scope.filter;
                    $scope.commit({
                        undo: function () {
                            filter.blur = oldVal;
                        },
                        redo: function () {
                            filter.blur = newVal;
                        }
                    });
                };

                //当色相变化时
                $scope.hueRotateChange = function (newVal, oldVal) {
                    var filter = $scope.filter;
                    $scope.commit({
                        undo: function () {
                            filter.hueRotate = oldVal;
                        },
                        redo: function () {
                            filter.hueRotate = newVal;
                        }
                    });
                };
            }]
        };
    });


    //背景属性编辑
    app.directive('editorFormBackground', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormBackground.html',
            scope: {
                backGround: '=',
                onSelectSingleImage: '&',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {

                //背景类型变化时
                $scope.typeChange = function (newVal, oldVal) {
                    var data = $scope.backGround;
                    $scope.commit({
                        undo: function () {
                            data.type = oldVal;
                        },
                        redo: function () {
                            data.type = newVal;
                        }
                    });
                };

                //当图片变化时
                $scope.imageChange = function (newVal, oldVal) {
                    var data = $scope.backGround;
                    $scope.commit({
                        undo: function () {
                            data.image = oldVal;
                        },
                        redo: function () {
                            data.image = newVal;
                        }
                    });
                };

                //当颜色变化时
                $scope.colorChange = function (newVal, oldVal) {
                    var data = $scope.backGround;
                    $scope.commit({
                        undo: function () {
                            data.color.r = oldVal.r;
                            data.color.g = oldVal.g;
                            data.color.b = oldVal.b;
                        },
                        redo: function () {
                            data.color.r = newVal.r;
                            data.color.g = newVal.g;
                            data.color.b = newVal.b;
                        }
                    });
                };
            }]
        };
    });


    //页面属性编辑
    app.directive('editorFormPage', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormPage.html',
            scope: {
                page: '=',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {

                //当场景时长变化时
                $scope.stayChange = function (newVal, oldVal) {
                    var data = $scope.page;
                    $scope.commit({
                        undo: function () {
                            data.stay = oldVal;
                        },
                        redo: function () {
                            data.stay = newVal;
                        }
                    });
                };

            }]
        };
    });


    //文字属性编辑
    app.directive('editorFormText', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormText.html',
            scope: {
                data: '=',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {
                //单行/多行模式变化
                $scope.isMultipleChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.isMultiple = oldVal;
                        },
                        redo: function () {
                            data.isMultiple = newVal;
                        }
                    });
                };

                //文字部分变化
                (function () {
                    var nowVal = null;

                    $scope.valueFocus = function (val) {
                        nowVal = val;
                    };

                    $scope.valueBlur = function (newVal) {
                        var data = $scope.data;
                        var oldVal = nowVal;
                        if (oldVal !== newVal) {
                            $scope.commit({
                                undo: function () {
                                    data.value = oldVal;
                                },
                                redo: function () {
                                    data.value = newVal;
                                }
                            });
                        }
                    };
                })();

                //当字体变化时
                $scope.fontChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.font = oldVal;
                        },
                        redo: function () {
                            data.font = newVal;
                        }
                    });
                };

                //当颜色变化时
                $scope.colorChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.color.r = oldVal.r;
                            data.color.g = oldVal.g;
                            data.color.b = oldVal.b;
                        },
                        redo: function () {
                            data.color.r = newVal.r;
                            data.color.g = newVal.g;
                            data.color.b = newVal.b;
                        }
                    });
                };

                //当大小变化时
                $scope.sizeChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.size = oldVal;
                        },
                        redo: function () {
                            data.size = newVal;
                        }
                    });
                };

                //当水平对齐变化时
                $scope.horizontalAlignChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.horizontalAlign = oldVal;
                        },
                        redo: function () {
                            data.horizontalAlign = newVal;
                        }
                    });
                };

                //当垂直对齐变化时
                $scope.verticalAlignChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.verticalAlign = oldVal;
                        },
                        redo: function () {
                            data.verticalAlign = newVal;
                        }
                    });
                };
            }]
        };
    });


    //文字/走马灯混合体属性编辑
    app.directive('editorFormTextMarquee', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormTextMarquee.html',
            scope: {
                data: '=',
                backGround: '=',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {
                //单行/多行模式变化
                $scope.isScrollChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.isScroll = oldVal;
                        },
                        redo: function () {
                            data.isScroll = newVal;
                        }
                    });
                };

                //文字部分变化
                (function () {
                    var nowVal = null;

                    $scope.valueFocus = function (val) {
                        nowVal = val;
                    };

                    $scope.valueBlur = function (newVal) {
                        var data = $scope.data;
                        var oldVal = nowVal;
                        if (oldVal !== newVal) {
                            $scope.commit({
                                undo: function () {
                                    data.value = oldVal;
                                },
                                redo: function () {
                                    data.value = newVal;
                                }
                            });
                        }
                    };
                })();

                //当字体变化时
                $scope.fontChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.font = oldVal;
                        },
                        redo: function () {
                            data.font = newVal;
                        }
                    });
                };

                //当字体颜色变化时
                $scope.colorChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.color.r = oldVal.r;
                            data.color.g = oldVal.g;
                            data.color.b = oldVal.b;
                        },
                        redo: function () {
                            data.color.r = newVal.r;
                            data.color.g = newVal.g;
                            data.color.b = newVal.b;
                        }
                    });
                };

                //当背景颜色变化时
                $scope.backGroundColorChange = function (newVal, oldVal) {
                    var data = $scope.backGround;
                    var oldType = data.type;
                    $scope.commit({
                        undo: function () {
                            data.color.r = oldVal.r;
                            data.color.g = oldVal.g;
                            data.color.b = oldVal.b;
                            data['type'] = oldType;
                        },
                        redo: function () {
                            data.color.r = newVal.r;
                            data.color.g = newVal.g;
                            data.color.b = newVal.b;
                            data['type'] = 1;
                        }
                    });
                };

                $scope.backGroundTypeChange = function (newType) {
                    var data = $scope.backGround;
                    $scope.commit({
                        undo: function () {
                            data['type'] = 0;
                        },
                        redo: function () {
                            data['type'] = newType;
                        }
                    });
                };

                //当大小变化时
                $scope.sizeChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.size = oldVal;
                        },
                        redo: function () {
                            data.size = newVal;
                        }
                    });
                };

                //当速度变化时
                $scope.speedChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.speed = oldVal;
                        },
                        redo: function () {
                            data.speed = newVal;
                        }
                    });
                };

                //当水平对齐变化时
                $scope.horizontalAlignChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.horizontalAlign = oldVal;
                        },
                        redo: function () {
                            data.horizontalAlign = newVal;
                        }
                    });
                };

                //当垂直对齐变化时
                $scope.verticalAlignChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.verticalAlign = oldVal;
                        },
                        redo: function () {
                            data.verticalAlign = newVal;
                        }
                    });
                };
            }]
        };
    });


    //跑马灯属性编辑
    app.directive('editorFormMarquee', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormMarquee.html',
            scope: {
                data: '=',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {
                //文字部分变化
                (function () {
                    var nowVal = null;

                    $scope.valueFocus = function (val) {
                        nowVal = val;
                    };

                    $scope.valueBlur = function (newVal) {
                        var data = $scope.data;
                        var oldVal = nowVal;
                        if (oldVal !== newVal) {
                            $scope.commit({
                                undo: function () {
                                    data.value = oldVal;
                                },
                                redo: function () {
                                    data.value = newVal;
                                }
                            });
                        }
                    };
                })();

                //当字体变化时
                $scope.fontChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.font = oldVal;
                        },
                        redo: function () {
                            data.font = newVal;
                        }
                    });
                };

                //当颜色变化时
                $scope.colorChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.color.r = oldVal.r;
                            data.color.g = oldVal.g;
                            data.color.b = oldVal.b;
                        },
                        redo: function () {
                            data.color.r = newVal.r;
                            data.color.g = newVal.g;
                            data.color.b = newVal.b;
                        }
                    });
                };

                //当大小变化时
                $scope.sizeChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.size = oldVal;
                        },
                        redo: function () {
                            data.size = newVal;
                        }
                    });
                };

                //当速度变化时
                $scope.speedChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.speed = oldVal;
                        },
                        redo: function () {
                            data.speed = newVal;
                        }
                    });
                };

                //当垂直对齐变化时
                $scope.verticalAlignChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.verticalAlign = oldVal;
                        },
                        redo: function () {
                            data.verticalAlign = newVal;
                        }
                    });
                };

                //当方向变化时
                $scope.isLeftChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.isLeft = oldVal;
                        },
                        redo: function () {
                            data.isLeft = newVal;
                        }
                    });
                };
            }]
        };
    });


    //时间属性编辑
    app.directive('editorFormTime', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormTime.html',
            scope: {
                data: '=',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {
                //当日期格式变化时
                $scope.formatterChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.formatter = oldVal;
                        },
                        redo: function () {
                            data.formatter = newVal;
                        }
                    });
                };

                //当字体变化时
                $scope.fontChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.font = oldVal;
                        },
                        redo: function () {
                            data.font = newVal;
                        }
                    });
                };

                //当颜色变化时
                $scope.colorChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.color.r = oldVal.r;
                            data.color.g = oldVal.g;
                            data.color.b = oldVal.b;
                        },
                        redo: function () {
                            data.color.r = newVal.r;
                            data.color.g = newVal.g;
                            data.color.b = newVal.b;
                        }
                    });
                };

                //当大小变化时
                $scope.sizeChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.size = oldVal;
                        },
                        redo: function () {
                            data.size = newVal;
                        }
                    });
                };

                //当水平对齐变化时
                $scope.horizontalAlignChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.horizontalAlign = oldVal;
                        },
                        redo: function () {
                            data.horizontalAlign = newVal;
                        }
                    });
                };

                //当垂直对齐变化时
                $scope.verticalAlignChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.verticalAlign = oldVal;
                        },
                        redo: function () {
                            data.verticalAlign = newVal;
                        }
                    });
                };
            }]
        };
    });


    //图片属性编辑
    app.directive('editorFormImage', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormImage.html',
            scope: {
                data: '=',
                onSelectSingleImage: '&'
            }
        };
    });


    //轮播属性编辑
    app.directive('editorFormCarousel', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormCarousel.html',
            scope: {
                data: '=',
                commit: '&',
                onSelectMultipleImage: '&'
            },
            controller: ['$scope', function ($scope) {
                //弹框选择多张图片
                $scope.showDialogForSelectMultipleImage = function () {

                    var images = $scope.data.images;
                    $scope.onSelectMultipleImage({
                        images: images,
                        callback: function (newImages) {
                            var oldImages = images.slice(0);
                            $scope.commit({
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

                };

                //当动画变化时
                $scope.animationChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.animation.inId = oldVal.inId;
                            data.animation.outId = oldVal.outId;
                        },
                        redo: function () {
                            data.animation.inId = newVal.inId;
                            data.animation.outId = newVal.outId;
                        }
                    });
                };

                //当图片停留时间变化时
                $scope.stayChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.stay = oldVal;
                        },
                        redo: function () {
                            data.stay = newVal;
                        }
                    });
                };

                //当动画持续时间变化时
                $scope.durationChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.duration = oldVal;
                        },
                        redo: function () {
                            data.duration = newVal;
                        }
                    });
                };
            }]
        };
    });


    //视频属性编辑
    app.directive('editorFormVideo', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormVideo.html',
            scope: {
                data: '=',
                //当选取单个视频时
                onSelectSingleVideo: '&'
            }
        };
    });


    //多视频属性编辑
    app.directive('editorFormSerie', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormSerie.html',
            scope: {
                data: '=',
                commit: '&',
                onSelectMultipleVideo: '&'
            },
            controller: ['$scope', function ($scope) {
                //弹框选择多个视频
                $scope.showDialogForSelectMultipleVideo = function () {

                    var videos = $scope.data.videos;
                    $scope.onSelectMultipleVideo({
                        videos: videos,
                        callback: function (newVideos) {
                            var oldVideos = videos.slice(0);
                            $scope.commit({
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

                };

                //当静音开关变化时
                $scope.mutedChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.isMuted = !oldVal;
                        },
                        redo: function () {
                            data.isMuted = !newVal;
                        }
                    });
                };
            }]
        };
    });


    //网页属性编辑
    app.directive('editorFormWebview', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormWebview.html',
            scope: {
                data: '=',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {

                var watcher = $scope.$watch('data.url', function (newVal) {
                    $scope.url = newVal;
                });

                //销毁时移除事件
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.onBlur = function (url) {
                    var data = $scope.data;
                    var oldUrl = data.url;
                    $scope.commit({
                        undo: function () {
                            data.url = oldUrl;
                            $scope.url = oldUrl;
                        },
                        redo: function () {
                            data.url = url;
                            $scope.url = url;
                        }
                    });
                };

                //当自动刷新状态变化时
                $scope.autoRefreshChange = function (autoRefresh) {
                    var data = $scope.data;
                    var oldVal = !autoRefresh;
                    $scope.commit({
                        undo: function () {
                            data.autoRefresh = oldVal;
                        },
                        redo: function () {
                            data.autoRefresh = autoRefresh;
                        }
                    });
                };

                //当刷新间隔时间变化时
                $scope.refreshIntervalChange = function (newVal, oldVal) {
                    var data = $scope.data;
                    $scope.commit({
                        undo: function () {
                            data.refreshInterval = oldVal;
                        },
                        redo: function () {
                            data.refreshInterval = newVal;
                        }
                    });
                };
            }]
        };
    });


    //流媒体属性编辑
    app.directive('editorFormStreamMedia', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorFormStreamMedia.html',
            scope: {
                data: '=',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {

                var watcher = $scope.$watch('data.url', function (newVal) {
                    $scope.url = newVal;
                });

                //销毁时移除事件
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                });

                $scope.onBlur = function (url) {
                    var data = $scope.data;
                    var oldUrl = data.url;
                    $scope.commit({
                        undo: function () {
                            data.url = oldUrl;
                            $scope.url = oldUrl;
                        },
                        redo: function () {
                            data.url = url;
                            $scope.url = url;
                        }
                    });
                };


                (function () {

                    function isWin64() {
                        var agent = navigator.userAgent.toLowerCase();
                        return (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0)
                    }

                    function isWindows() {
                        var platform = navigator.platform;
                        return (platform === "Win32")
                            || (platform === "Windows");
                    }

                    function isMacOS() {
                        var platform = navigator.platform;
                        return (platform === "Mac68K")
                            || (platform === "MacPPC")
                            || (platform === "Macintosh")
                            || (platform === "MacIntel");
                    }

                    if (isWindows()) {
                        if (isWin64()) {
                            $scope.downloadurl = 'http://cdn-public.q-media.cn/vlc_x64.zip';
                        } else {
                            $scope.downloadurl = 'http://cdn-public.q-media.cn/vlc_x86.zip';
                        }
                    } else if (isMacOS()) {
                        $scope.downloadurl = 'http://cdn-public.q-media.cn/vlc.dmg';
                    } else {
                        $scope.downloadurl = '';
                    }

                })();

            }]
        };
    });

})(angular.module('qmedia.editor'));
