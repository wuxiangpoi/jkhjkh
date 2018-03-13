(function () {
    var isStart = false;
    var isMove = false;
    document.addEventListener('mousedown', function (e) {
        if (e.button === 0 || e.which === 1) {//鼠标左键
            isStart = true;
            isMove = false;
        }
    }, true);
    document.addEventListener('mousemove', function (e) {
        if (isStart && ((e.button === 0 || e.which === 1))) {
            isMove = true;
        }
    }, true);
    document.addEventListener('mouseup', function (e) {
        if (isStart && !isMove && ((e.button === 0 || e.which === 1))) {
            var event = document.createEvent('HTMLEvents');
            event.initEvent("onlyclick", true, true);
            event.eventType = 'onlyclick';

//                var event = new MouseEvent('onlyclick', {
//                    cancelable: true,
//                    bubble: true,
//                    view: window
//                });
            e.target.dispatchEvent(event);
        }
        isStart = false;
        isMove = false;
    }, true);
})();


(function () {

    function isSameArray(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    //获取当前脚本路径
    var currentScriptFolder = (function () {
        var scripts = document.getElementsByTagName("script");
        var currentPath = scripts[scripts.length - 1].getAttribute("src");
        var index = currentPath.lastIndexOf("/");
        return currentPath.substring(0, index + 1);
    })();

    //创建编辑器模块
    var app = angular.module('qmedia.editor', []);

    //定义字体常量
    app.constant('editorFontFamilyConstant', [
        {id: 0, name: "系统默认", value: "inherit"},
        {id: 1, name: "宋体", value: "SimSun"},
        {id: 2, name: "黑体", value: "SimHei"},
        {id: 3, name: "微软雅黑", value: "Microsoft YaHei"},
        {id: 4, name: "楷体", value: "KaiTi"},
        {id: 5, name: "隶书", value: "LiSu"},
        {id: 6, name: "幼圆", value: "YouYuan"}
    ]);

    //时间格式化参数
    app.constant('editorTimeFormatConstant', [
        {id: 1, name: "日期和时间"},
        {id: 4, name: "日期和星期"},
        {id: 2, name: "仅日期"},
        {id: 3, name: "仅时间"}
    ]);

    //视频URL安全处理
    app.filter('editorVideoURLSCEFilter', ['$sce', function ($sce) {
        return function (videoURL) {
            return $sce.trustAsResourceUrl(videoURL);
        };
    }]);

    //背景图片平铺
    app.filter('editorContainBackgroundFilter', function () {
        return function (imgUrl) {
            return "url('" + imgUrl + "') no-repeat scroll center center / contain border-box border-box";
        };
    });

    //背景图片铺满
    app.filter('editorFullBackgroundFilter', function () {
        return function (imgUrl) {
            return "url('" + imgUrl + "') no-repeat scroll center center / 100% 100% border-box border-box";
        };
    });

    //字体过滤器
    app.filter('editorFontFamilyFilter', ['editorFontFamilyConstant', function (fonts) {
        return function (fontID) {
            var find = fonts.find(function (font) {
                return font.id === fontID;
            });
            return find ? find.value : fonts[0].value;
        };
    }]);

    //日期格式过滤器
    app.filter('editorDateTimeFormatterFilter', ['$filter', function ($filter) {
        var dateFilter = $filter('date');
        return function (time, formatterID) {
            switch (formatterID) {
                case 1:
                    return dateFilter(time, "yyyy年MM月dd日 HH:mm:ss");
                case 2:
                    return dateFilter(time, "yyyy年MM月dd日");
                case 3:
                    return dateFilter(time, "HH:mm:ss");
                case 4:
                    return dateFilter(time, "yyyy年MM月dd日") + " 星期" + "日一二三四五六".substr(time.getDay() % 7, 1);
                default:
                    return dateFilter(time, "yyyy年MM月dd日 HH:mm:ss");
            }
        };
    }]);

    //跨域安全路径过滤器
    app.filter('editorTrustAsResourceUrl', ['$sce', function ($sce) {
        return function (val) {
            return $sce.trustAsResourceUrl(val);
        };
    }]);

    //四舍五入过滤器
    app.filter('editorMathRoundFilter', function () {
        return function (num, fix) {
            if (fix === 0 || !fix) {
                return Math.round(num);
            }
            return num.toFixed(fix);
        };
    });

    //自定义编辑器指令
    app.directive('editor', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editor.html',
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                pages: '=',
                onPreview: '&',
                onSaveProgram: '&',
                onSaveTemplate: '&',
                onBack: '&',
                //切换分辨率时
                onCheckPixel: '&',
                //添加场景时
                onAddSingleTemplate: '&',
                //当选取单图片时
                onSelectSingleImage: '&',
                //当选取多图片时
                onSelectMultipleImage: '&',
                //当选取单视频时
                onSelectSingleVideo: '&',
                //当选取多视频时
                onSelectMultipleVideo: '&'
            },
            controller: ['$scope', '$state', function ($scope, $state) {

                //$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                //    if ($scope.undos.length !== 0) {
                //        if (!window.confirm('有修改尚未保存，确定要离开吗？')) {
                //            event.preventDefault();
                //        }
                //    }
                //});

                //窗口大小重置
                (function () {

                    function onResize(e) {
                        $scope.$broadcast('resize', e);
                    }

                    window.addEventListener('resize', onResize, false);

                    //销毁时清除
                    $scope.$on('$destroy', function () {
                        window.removeEventListener('resize', onResize, false);
                    });
                })();

                //自动吸附对齐效果事件中转处理
                (function () {
                    $scope.$on('dragStartX', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-x', data);
                    });

                    $scope.$on('dragMoveX', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-x');
                    });

                    $scope.$on('dragStartY', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-y', data);
                    });

                    $scope.$on('dragMoveY', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-y');
                    });

                    $scope.$on('dragStartN', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-n', data);
                    });

                    $scope.$on('dragMoveN', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-n');
                    });

                    $scope.$on('dragStartS', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-s', data);
                    });

                    $scope.$on('dragMoveS', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-s');
                    });

                    $scope.$on('dragStartE', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-e', data);
                    });

                    $scope.$on('dragMoveE', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-e');
                    });

                    $scope.$on('dragStartW', function (event, data) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-start-w', data);
                    });

                    $scope.$on('dragMoveW', function (event) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-move-w');
                    });

                    $scope.$on('dragEnd', function (event, callback) {
                        event.stopPropagation();
                        $scope.$broadcast('drag-end', callback);
                    });
                })();

                //快捷键
                (function () {
                    function onKeyDown(e) {
                        //console.log(e.which, e);
                        if (e.which === 46) {//delete键
                            $scope.$apply(function () {
                                e.preventDefault();
                                $scope.$broadcast('editor-ele-deleted');
                            });
                        } else {
                            if (e.ctrlKey && !e.altKey) {//ctrl被按下且alt没被按下
                                $scope.$apply(function () {
                                    switch (e.which) {
                                        case 66://ctrl+b启停自动停靠
                                            e.preventDefault();
                                            $scope.changeAutoAnchor();
                                            break;
                                        case 90://ctrl+z撤销
                                            e.preventDefault();
                                            $scope.undo();
                                            break;
                                        case 89://ctrl+y重做
                                            e.preventDefault();
                                            $scope.redo();
                                            break;
                                        case 67://ctrl+c复制
                                            e.preventDefault();
                                            (function () {
                                                var curEle = $scope.cache.currentElement;
                                                if (curEle) {
                                                    var sData = angular.toJson(curEle);
                                                    window.sessionStorage.setItem('editorr-copy', sData);
                                                    layer.msg('已复制');
                                                }
                                            })();
                                            break;
                                        case 88://ctrl+x剪切
                                            e.preventDefault();
                                            (function () {
                                                var curEle = $scope.cache.currentElement;
                                                if (curEle) {
                                                    var sData = angular.toJson(curEle);
                                                    window.sessionStorage.setItem('editorr-copy', sData);
                                                    $scope.$broadcast('editor-ele-deleted');
                                                    layer.msg('已剪切');
                                                }
                                            })();
                                            break;
                                        case 86://ctrl+v粘贴
                                            e.preventDefault();
                                            (function () {
                                                var sData = window.sessionStorage.getItem('editorr-copy');
                                                if (sData) {
                                                    try {
                                                        var data = angular.fromJson(sData);
                                                        addElement(data);
                                                        layer.msg('已粘贴');
                                                    } catch (err) {
                                                        console.log('粘贴失败：', err);
                                                    }
                                                }
                                            })();
                                            break;
                                        case 71://ctrl+g网格开关
                                            e.preventDefault();
                                            $scope.changeGriddingState();
                                            break;
                                        case 83://ctrl+s保存
                                            e.preventDefault();
                                            $scope.saveProgram();
                                            break;
                                        case 79://ctrl+o保存模板
                                            e.preventDefault();
                                            $scope.saveTemplate();
                                            break;
                                        case 80://ctrl+p预览
                                            e.preventDefault();
                                            $scope.goPreview();
                                            break;
                                        case 73://ctrl+i添加场景
                                            e.preventDefault();
                                            $scope.showDialogForSelectTemplate();
                                            break;
                                        case 68://ctrl+d删除
                                            e.preventDefault();
                                            $scope.$broadcast('editor-ele-deleted');
                                            break;
                                        default :
                                            break;
                                    }
                                });
                            }
                        }
                    }

                    document.addEventListener('keydown', onKeyDown, false);

                    //销毁时清除
                    $scope.$on('$destroy', function () {
                        document.removeEventListener('keydown', onKeyDown, false);
                    });
                })();

                //左侧拖拽效果参数
                (function () {
                    var cachePages = [];
                    $scope.sortableOptions = {
                        axis: 'y',
                        start: function () {
                            cachePages.splice(0, cachePages.length);
                            $scope.pages.forEach(function (page) {
                                cachePages.push(page);
                            });
                        },
                        stop: function () {
                            //console.log('stop:此事件发生时数组顺序已调整过来');
                            var scopePages = $scope.pages;
                            if (!isSameArray(cachePages, scopePages)) {//顺序有改变
                                var oldPages = cachePages.map(function (page) {
                                    return page;
                                });
                                var newPages = scopePages.map(function (page) {
                                    return page;
                                });

                                $scope.commit(function () {
                                    scopePages.splice(0, scopePages.length);
                                    oldPages.forEach(function (page) {
                                        scopePages.push(page);
                                    });
                                }, function () {
                                    scopePages.splice(0, scopePages.length);
                                    newPages.forEach(function (page) {
                                        scopePages.push(page);
                                    });
                                });
                            }
                            cachePages.splice(0, cachePages.length);
                        },
                        update: function (event, ui) {
                            //console.log('update:此事件发生时数组顺序尚未调整过来');
                        }
                    };
                })();

                //撤销/重做
                (function () {
                    var undos = $scope.undos = [];
                    var redos = $scope.redos = [];
                    var temp = null;

                    //撤销
                    $scope.undo = function () {
                        if (undos.length !== 0) {
                            var action = undos.pop();
                            action.undo();
                            redos.push(action);
                            //console.log('undo:', undos.length, redos.length);
                        }
                    };

                    //重做
                    $scope.redo = function () {
                        if (redos.length !== 0) {
                            var action = redos.pop();
                            action.redo();
                            undos.push(action);
                            //console.log('redo:', undos.length, redos.length);
                        }
                    };

                    //提交操作
                    $scope.commit = function (undo, redo) {
                        redos.splice(0, redos.length);
                        if (temp) {
                            undos.push(temp);
                            temp = null;
                        }
                        undos.push({
                            undo: undo,
                            redo: redo
                        });
                        redo();
                        //console.log('commit:', undos.length, redos.length);
                    };

                })();

                $scope.cache = {
                    currentPage: null,
                    currentElement: null
                };

                $scope.$on('editor-ele-selected', function (evt, ele) {
                    evt.stopPropagation();
                    $scope.cache.currentElement = ele;
                });

                function addElement(ele) {
                    var cache = $scope.cache;
                    var oldPage = cache.currentPage;
                    var elements = oldPage.elements;
                    var oldEle = cache.currentElement;

                    $scope.commit(function () {
                        elements.pop();
                        if (cache.currentPage === oldPage) {
                            cache.currentElement = oldEle;
                        }
                    }, function () {
                        elements.push(ele);
                        if (cache.currentPage === oldPage) {
                            cache.currentElement = ele;
                        }
                    });
                }

                $scope.$on('editor-ele-created', function (evt, ele) {
                    evt.stopPropagation();
                    addElement(ele);
                });

                //屏幕比例
                (function () {

                    $scope.pixelChange = function (ph, pv) {
                        $scope.pixelHorizontal = ph;
                        $scope.pixelVertical = pv;
                    };

                    $scope.$on('auto-selected-template', function (evt, template) {
                        $scope.pixelHorizontal = template.pixelHorizontal;
                        $scope.pixelVertical = template.pixelVertical;
                        $scope.cache.currentElement = null;
                        $scope.cache.currentPage = template.page;
                    });

                })();

                //默认缩放百分比
                $scope.selectedScale = 100;

                //启用/停用自动停靠
                (function () {
                    $scope.autoAnchor = true;//默认启用

                    $scope.changeAutoAnchor = function () {
                        $scope.autoAnchor = !$scope.autoAnchor;
                        layer.msg($scope.autoAnchor ? '已启用自动吸附' : '已关闭自动吸附');
                    };
                })();

                //显示/隐藏网格
                (function () {

                    $scope.isShowGridding = false;//默认不显示

                    $scope.changeGriddingState = function () {
                        $scope.isShowGridding = !$scope.isShowGridding;
                    };

                })();

                //预览本页
                $scope.goCurrentPreview = function () {
                    var curPage = $scope.cache.currentPage;
                    $scope.onPreview({
                        pixelHorizontal: $scope.pixelHorizontal,
                        pixelVertical: $scope.pixelVertical,
                        pages: curPage ? [curPage] : []
                    });
                };

                //保存模板
                $scope.saveTemplate = function () {
                    $scope.onSaveTemplate({
                        pixelHorizontal: $scope.pixelHorizontal,
                        pixelVertical: $scope.pixelVertical,
                        page: $scope.cache.currentPage
                    });
                };

                //预览
                $scope.goPreview = function () {
                    $scope.onPreview({
                        pixelHorizontal: $scope.pixelHorizontal,
                        pixelVertical: $scope.pixelVertical,
                        pages: $scope.pages
                    });
                };

                //保存节目
                $scope.saveProgram = function () {
                    $scope.onSaveProgram({
                        pixelHorizontal: $scope.pixelHorizontal,
                        pixelVertical: $scope.pixelVertical,
                        pages: $scope.pages
                    });
                };

                //返回
                $scope.goBack = function () {
                    $scope.onBack();
                };

                //页面被选中
                $scope.selectPage = function (page, $event) {
                    var cache = $scope.cache;
                    cache.currentElement = null;
                    cache.currentPage = page;
                };

                //页面被点击(未点到元素上)
                $scope.editAreaClick = function () {
                    $scope.cache.currentElement = null;
                };

                var programPageThumbList = document.getElementById('programPageThumbList');
                //弹框选择模板
                $scope.showDialogForSelectTemplate = function () {
                    $scope.onAddSingleTemplate({
                        callback: function (template) {
                            var page = template.page;

                            var pages = $scope.pages;
                            var cache = $scope.cache;
                            var oldPage = cache.currentPage;
                            var oldEle = cache.currentElement;

                            $scope.commit(function () {
                                cache.currentPage = oldPage;
                                cache.currentElement = oldEle;
                                pages.pop();
                            }, function () {
                                pages.push(page);
                                cache.currentElement = null;
                                cache.currentPage = page;
                            });

                            window.setTimeout(function () {
                                programPageThumbList.scrollTop = programPageThumbList.scrollHeight - programPageThumbList.clientHeight;
                            }, 50);

                        }
                    });
                };

                //页面被删除
                $scope.deletePage = function (page, $event) {
                    $event.stopPropagation();

                    var pages = $scope.pages;
                    var cache = $scope.cache;
                    var oldPage = cache.currentPage;
                    var oldEle = cache.currentElement;
                    var index = pages.indexOf(page);

                    $scope.commit(function () {
                        if (page === oldPage) {
                            cache.currentPage = oldPage;
                            cache.currentElement = oldEle;
                        }

                        pages.splice(index, 0, page);
                    }, function () {
                        pages.splice(index, 1);//删除该页

                        if (page === oldPage) {//如果是当前选中页
                            cache.currentElement = null;

                            if (index === 0) {//如果是第一页
                                cache.currentPage = pages.length === 0 ? null : pages[0];//选中下一页
                            } else {//不是第一页
                                cache.currentPage = pages[index - 1];//选中上一页
                            }
                        }
                    });
                };

                //如果页数不为0，默认选中第一页
                if ($scope.pages.length !== 0) {
                    $scope.cache.currentPage = $scope.pages[0];
                }

            }]
        };
    });


    //工具模块
    app.directive('editorTools', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorTools.html',
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                currentPage: '='
            },
            controller: ['$scope', function ($scope) {

                function doSomething(ele) {
                    var ext = {
                        "background": {
                            "ver": 1,
                            "type": 0,
                            "image": null,
                            "color": {
                                "r": 255,
                                "g": 255,
                                "b": 255
                            },
                            "opacity": 100
                        },
                        "border": {
                            "ver": 1,
                            "color": {
                                "r": 0,
                                "g": 160,
                                "b": 233
                            },
                            "width": 0,
                            "style": "solid",
                            "radius": 0,
                            "padding": 0,
                            "opacity": 100
                        },
                        "filter": {
                            "ver": 1,
                            "opacity": 100,
                            "brightness": 100,
                            "saturate": 100,
                            "contrast": 100,
                            "grayscale": 0,
                            "blur": 0,
                            "invert": 0,
                            "hueRotate": 0
                        }
                    };
                    angular.extend(ele, ext);
                    $scope.$emit('editor-ele-created', ele);
                }

                function computeZIndex() {
                    var allLayouts = $scope.currentPage.elements.map(function (ele) {
                        return ele.layout;
                    });
                    if (allLayouts.length === 0) {
                        return 0;
                    }
                    var maxLayout = allLayouts.max(function (layout) {
                        return layout.zIndex;
                    });
                    return maxLayout.zIndex + 1;
                }

                //设为文本类型
                $scope.setTextElement = function () {
                    var width = 80;
                    var height = 8 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 100,
                        "data": {
                            "ver": 1,
                            "isMultiple": false,
                            "value": "快媒数字",
                            "font": 0,
                            "size": 25,
                            "color": {
                                "r": 0,
                                "g": 160,
                                "b": 233
                            },
                            "horizontalAlign": "center",
                            "verticalAlign": "middle"
                        },
                        "layout": {
                            "ver": 1,
                            "left": 10,
                            "top": 50,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为文本走马灯
                $scope.setTextMarqueeElement = function () {
                    var width = 80;
                    var height = 8 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 160,
                        "data": {
                            "ver": 1,
                            "isScroll": true,
                            "speed": 10,
                            "value": "快媒数字，引领媒体新潮流",
                            "font": 0,
                            "size": 30,
                            "color": {
                                "r": 51,
                                "g": 51,
                                "b": 51
                            },
                            "horizontalAlign": "center",
                            "verticalAlign": "middle"
                        },
                        "layout": {
                            "ver": 1,
                            "left": 10,
                            "top": 50,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为跑马灯类型
                $scope.setMarqueeElement = function () {
                    var width = 80;
                    var height = 8 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 150,
                        "data": {
                            "ver": 1,
                            "value": "快媒数字，引领媒体新潮流",
                            "font": 0,
                            "size": 25,
                            "color": {
                                "r": 0,
                                "g": 160,
                                "b": 233
                            },
                            "verticalAlign": "middle",
                            "speed": 10,
                            "isLeft": true
                        },
                        "layout": {
                            "ver": 1,
                            "left": 10,
                            "top": 50,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为图片类型
                $scope.setImageElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 200,
                        "data": {
                            "ver": 1,
                            "image": null
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为轮播类型
                $scope.setImagesElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 250,
                        "data": {
                            "ver": 1,
                            "images": [],
                            "animation": {
                                "inId": 1,
                                "outId": 1
                            },
                            "stay": 5,
                            "duration": 2000
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为单视频类型
                $scope.setVideoElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 300,
                        "data": {
                            "ver": 1,
                            "video": null,
                            "isMuted": false
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为多视频类型
                $scope.setVideosElement = function () {
                    if ($scope.currentPage.elements.filter(function (item) {
                            return item.type === 350;
                        }).length >= 5) {
                        layer.msg('视频数量不能超过 5 个！');
                        return;
                    }

                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 350,
                        "data": {
                            "ver": 1,
                            "videos": [],
                            "isMuted": false
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为单音乐类型
                $scope.setMusicElement = function () {

                };

                //设为多音乐类型
                $scope.setMusicsElement = function () {

                };

                //设为时间类型
                $scope.setTimeElement = function () {
                    var width = 80;
                    var height = 8 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 500,
                        "data": {
                            "ver": 1,
                            "formatter": 4,
                            "font": 0,
                            "size": 30,
                            "color": {
                                "r": 51,
                                "g": 51,
                                "b": 51
                            },
                            "horizontalAlign": "right",
                            "verticalAlign": "middle"
                        },
                        "layout": {
                            "ver": 1,
                            "left": 10,
                            "top": 50,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //设为天气类型
                $scope.setWeatherElement = function () {

                };

                //设为地图类型
                $scope.setMapElement = function () {

                };

                //设为RSS类型
                $scope.setRSSElement = function () {

                };

                //设为网页类型
                $scope.setWebviewElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 900,
                        "data": {
                            "ver": 1,
                            "url": "",
                            "autoRefresh": false,
                            "refreshInterval": 60
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };

                //添加流媒体
                $scope.setStreamMediaElement = function () {
                    var width = 40;
                    var height = 30 * $scope.pixelHorizontal / $scope.pixelVertical;
                    doSomething({
                        "ver": 1,
                        "type": 1000,
                        "data": {
                            "ver": 1,
                            "url": ""
                        },
                        "layout": {
                            "ver": 1,
                            "left": 30,
                            "top": 35,
                            "width": width,
                            "height": height,
                            "zIndex": computeZIndex(),
                            "rotate": 0
                        }
                    });
                };
                
            }]
        };
    });


    //元素属性编辑模块
    app.directive('editorElementProperty', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorElementProperty.html',
            scope: {
                ele: '=',
                page: '=',//用于图层置顶/底
                pixelHorizontal: '=',
                pixelVertical: '=',
                commit: '&',
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
                $scope.tabIndex = 0;
                $scope.setTabIndex = function (tabIndex) {
                    $scope.tabIndex = tabIndex;
                };
            }]
        };
    });


    //页面属性编辑模块
    app.directive('editorPageProperty', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'editorPageProperty.html',
            scope: {
                page: '=',
                //当选取单图片时
                onSelectSingleImage: '&',
                commit: '&'
            },
            controller: ['$scope', function ($scope) {
                $scope.tabIndex = 1;
                $scope.setTabIndex = function (tabIndex) {
                    $scope.tabIndex = tabIndex;
                };
            }]
        };
    });

})();
