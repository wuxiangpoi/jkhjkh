//过滤器
(function (app) {

    //获取当前脚本路径
    var currentScriptFolder = (function () {
        var scripts = document.getElementsByTagName("script");
        var currentPath = scripts[scripts.length - 1].getAttribute("src");
        var index = currentPath.lastIndexOf("/");
        return currentPath.substring(0, index + 1);
    })();

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

    app.directive('dmbdPager', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'dmbdPager.html',
            scope: {
                pageSize: '=',
                pageIndex: '=',
                recordCount: '=',
                onPaging: '&',
                onPaged: '&'
            },
            controller: ['$scope', function ($scope) {
                function getParams(index) {
                    return {
                        $index: index
                    }
                }

                //点击首页
                $scope.goFirstPage = function () {
                    $scope.onPaging(getParams(0));
                };
                //点击末页
                $scope.goLastPage = function () {
                    var pageCount = Math.ceil($scope.recordCount / $scope.pageSize);
                    $scope.onPaging(getParams(pageCount - 1));
                };
                //点击上一页
                $scope.goPrevPage = function () {
                    $scope.onPaging(getParams($scope.pageIndex - 1));
                };
                //点击下一页
                $scope.goNextPage = function () {
                    $scope.onPaging(getParams($scope.pageIndex + 1));
                };
                //点击具体页码
                $scope.goPageIndex = function (pageIndex) {
                    if (pageIndex !== $scope.pageIndex) {
                        $scope.onPaging(getParams(pageIndex));
                    }
                };

                var watcher = $scope.$watchGroup(['recordCount', 'pageIndex'], function (args) {
                    var recordCount = $scope.recordCount = args[0];
                    var pageIndex = args[1];
                    if (recordCount === 0) {//无数据
                        $scope.pageCount = 0;
                        $scope.pageIndex = -1;
                    } else {//有数据
                        $scope.pageCount = Math.ceil(recordCount / $scope.pageSize);
                        $scope.pageIndex = pageIndex;
                    }

                    if (typeof $scope.onPaged === 'function') {
                        $scope.onPaged({
                            recordCount: recordCount,
                            pageCount: $scope.pageCount,
                            pageIndex: $scope.pageIndex
                        });
                    }
                });

                var watcher2 = $scope.$watchGroup(['pageCount', 'pageIndex'], function (args) {
                    var pageCount = args[0];
                    var pageIndex = args[1];
                    var pagerDataList = $scope.pagerDataList = [];
                    if (pageCount < 8) {
                        (function () {
                            for (var i = 0; i < pageCount; i++) {
                                pagerDataList.push({
                                    isLink: true,
                                    linkIndex: i
                                });
                            }
                        })();
                    } else {
                        if (pageIndex < 4) {
                            (function () {
                                for (var i = 0; i < 5; i++) {
                                    pagerDataList.push({
                                        isLink: true,
                                        linkIndex: i
                                    });
                                }
                                pagerDataList.push({
                                    isLink: false,
                                    linkIndex: 0
                                });
                                pagerDataList.push({
                                    isLink: true,
                                    linkIndex: pageCount - 1
                                });
                            })();
                        } else if (pageIndex > pageCount - 5) {
                            (function () {
                                pagerDataList.push({
                                    isLink: true,
                                    linkIndex: 0
                                });
                                pagerDataList.push({
                                    isLink: false,
                                    linkIndex: 0
                                });
                                for (var i = 0; i < 5; i++) {
                                    pagerDataList.push({
                                        isLink: true,
                                        linkIndex: pageCount - 5 + i
                                    });
                                }
                            })();
                        } else {
                            (function () {
                                pagerDataList.push({
                                    isLink: true,
                                    linkIndex: 0
                                });
                                pagerDataList.push({
                                    isLink: false,
                                    linkIndex: 0
                                });
                                for (var i = 0; i < 3; i++) {
                                    pagerDataList.push({
                                        isLink: true,
                                        linkIndex: pageIndex - 1 + i
                                    });
                                }
                                pagerDataList.push({
                                    isLink: false,
                                    linkIndex: 0
                                });
                                pagerDataList.push({
                                    isLink: true,
                                    linkIndex: pageCount - 1
                                });
                            })();
                        }
                    }
                });

                //销毁时清除
                $scope.$on('$destroy', function () {
                    watcher();//清除监视
                    watcher2();
                });
            }]
        };
    });


    //节目预览组件2
    app.directive('dmbdProgramPreview2', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'dmbdProgramPreview2.html',
            scope: {
                programPixelHorizontal: '=',//节目像素宽度
                programPixelVertical: '=',//节目像素高度
                programPages: '=',//节目内容
                size: '='//预览区域尺寸（正方形）
            },
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                $scope.size = $scope.size || 500;
                var cycle = new CycleQueue($scope.programPages);
                var timer = null;

                allPlaying();

                function allPlaying() {
                    $scope.isPreviewAll = true;
                    cycle.setIndex(0);
                    var firstPage = angular.copy(cycle.current());
                    $scope.currentPage = firstPage;
                    timer = $timeout(function () {
                        var nextPage = cycle.next();
                        $scope.currentPage = nextPage;
                        timer = $timeout(arguments.callee, nextPage.stay * 1000);
                    }, firstPage.stay * 1000);
                }

                $scope.previewAll = function () {
                    if (timer === null) {
                        allPlaying();
                    }
                };

                $scope.curPageIndex = 0;

                $scope.previewPage = function (page) {
                    if (timer !== null) {
                        $timeout.cancel(timer);
                        timer = null;
                    }
                    $scope.currentPage = page;
                    $scope.isPreviewAll = false;
                    $scope.curPageIndex = $scope.programPages.indexOf(page);
                };

                //销毁时清除
                $scope.$on('$destroy', function () {
                    if (timer !== null) {
                        $timeout.cancel(timer);
                        timer = null;
                    }
                });
            }]
        };
    });


    //图片选择（加强版）
    app.directive('dmbdImageViewer2', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'imageViewer2.html',
            scope: {
                data: '=',
                buttonText: '@',
                onButtonClick: '&'
            },
            link: function (scope, elements, attrs) {

                scope.selectImage = function ($event) {
                    $event.stopPropagation();
                    scope.onButtonClick();
                };

                //更多
                (function () {
                    scope.isMoreDown = false;//更多按钮是否被按下
                    scope.isShowMore = false;//显示更多开关

                    scope.mouseClick = function ($event) {
                        $event.stopPropagation();
                        scope.isMoreDown = !scope.isMoreDown;
                        scope.isShowMore = scope.isMoreDown;
                    };

                    scope.mouseEnter = function ($event) {
                        $event.stopPropagation();
                        if (!scope.isMoreDown) {
                            scope.isShowMore = true;
                        }
                    };

                    scope.mouseLeave = function ($event) {
                        $event.stopPropagation();
                        if (!scope.isMoreDown) {
                            scope.isShowMore = false;
                        }
                    };
                })();
            }
        };
    });

    //视频封面图及点击播放（加强版）
    app.directive('dmbdVideoViewer2', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: currentScriptFolder + 'videoViewer2.html',
            scope: {
                data: '=',
                buttonText: '@',
                onButtonClick: '&'
            },
            link: function (scope, elements, attrs) {
                //播放控制
                (function () {
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

                    videoDOM.poster = scope.data.snapshot;
                    scope.isLoaded = false;//指示视频资源是否已加载
                    scope.isPlaying = false;//指示是否正在播放

                    scope.loadVideo = function ($event) {
                        $event.stopPropagation();
                        videoDOM.src = scope.data.url;

                        scope.isLoaded = true;
                        scope.isPlaying = true;
                    };

                    scope.playVideo = function ($event) {
                        $event.stopPropagation();
                        videoDOM.play();
                        scope.isPlaying = true;
                    };

                    scope.pauseVideo = function ($event) {
                        $event.stopPropagation();
                        videoDOM.pause();
                        scope.isPlaying = false;
                    };

                    scope.selectVideo = function ($event) {
                        $event.stopPropagation();
                        scope.onButtonClick();
                    };
                })();

                //更多
                (function () {
                    scope.isMoreDown = false;//更多按钮是否被按下
                    scope.isShowMore = false;//显示更多开关

                    scope.mouseClick = function ($event) {
                        $event.stopPropagation();
                        scope.isMoreDown = !scope.isMoreDown;
                        scope.isShowMore = scope.isMoreDown;
                    };

                    scope.mouseEnter = function ($event) {
                        $event.stopPropagation();
                        if (!scope.isMoreDown) {
                            scope.isShowMore = true;
                        }
                    };

                    scope.mouseLeave = function ($event) {
                        $event.stopPropagation();
                        if (!scope.isMoreDown) {
                            scope.isShowMore = false;
                        }
                    };
                })();
            }
        };
    });

})(app);