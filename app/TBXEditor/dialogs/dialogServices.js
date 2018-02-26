(function (app) {

    //获取当前脚本路径
    var currentScriptFolder = (function () {
        var scripts = document.getElementsByTagName("script");
        var currentPath = scripts[scripts.length - 1].getAttribute("src");
        var index = currentPath.lastIndexOf("/");
        return currentPath.substring(0, index + 1);
    })();

    app.service('dialogService', ['ngDialog', 'programService', function (ngDialog, programService) {

        function bindScope($scope, pixelHorizontal, pixelVertical, pages) {
            //屏幕比例
            (function () {

                ////可选的分辨率
                //$scope.pixels = [
                //    {h: 1920, v: 1080},
                //    {h: 1080, v: 1920},
                //    {h: 1366, v: 768},
                //    {h: 768, v: 1366},
                //    {h: 1024, v: 768},
                //    {h: 768, v: 1024}
                //];
                //
                //$scope.selectedPixel = (function () {
                //    var find = $scope.pixels.find(function (item) {
                //        return item.h === pixelHorizontal && item.v === pixelVertical;
                //    });
                //    return find ? find : $scope.pixels[0];
                //})();
                //
                ////下拉框切换比例
                //$scope.changeSelectedPixel = function (pixel) {
                //    $scope.selectedPixel = pixel;
                //};

                $scope.pixelHorizontal = pixelHorizontal;
                $scope.pixelVertical = pixelVertical;
                $scope.pages = pages;

            })();

            //关闭弹窗
            $scope.close_dialog = function () {
                $scope.closeThisDialog(); //关闭弹窗
            };
        }

        //列表页面中打开节目预览对话框
        this.openProgramPreviewDialogById = function (pid) {
            ngDialog.open({
                template: currentScriptFolder + 'programPreview.html',
                className: 'ngdialog-theme-default',
                width: '560px',
                controller: ['$scope', 'programService', function ($scope, programService) {
                    programService.getProgramById(pid, function (program) {
                        bindScope($scope,
                            program.pixelHorizontal,
                            program.pixelVertical,
                            program.pages);
                    });
                }]
            });
        };

        //编辑时打开节目预览对话框
        this.openProgramPreviewDialog = function (pixelHorizontal, pixelVertical, pages) {
            if (pages.length === 0) {
                layer.alert('不能预览空节目！');
                return;
            }

            var sensitiveWord = programService.getFirstSensitiveWord(pages);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            //先计算场景停留时间属性
            (function () {
                pages.forEach(function (page) {
                    var elementsSeconds = [];
                    page.elements.forEach(function (ele) {
                        if (ele.type === 250) {//多图片轮播
                            if (ele.data.images.length > 1) {
                                var sec1 = (ele.data.duration / 1000 + ele.data.stay) * ele.data.images.length;
                                if (sec1 !== 0) {
                                    elementsSeconds.push(Math.round(sec1));
                                }
                            }
                        } else if (ele.type === 350) {//多视频
                            var sec2 = 0;
                            ele.data.videos.forEach(function (video) {
                                sec2 += video.duration;
                            });
                            if (sec2 !== 0) {
                                elementsSeconds.push(Math.round(sec2));
                            }
                        } else if (ele.type === 150) {
                            var sec3 = (ele.layout.width / 100 + ele.data.value.length * ele.data.size / 1000) * 400 / ele.data.speed;
                            if (sec3 !== 0) {
                                elementsSeconds.push(Math.round(sec3));
                            }
                        }
                    });

                    var maxSecond = 60;
                    if (elementsSeconds.length !== 0) {
                        maxSecond = elementsSeconds.max();
                    }
                    //pagesSeconds.push(maxSecond);
                    page.stay = maxSecond;
                });
            })();

            ngDialog.open({
                template: currentScriptFolder + 'programPreview.html',
                className: 'ngdialog-theme-default',
                width: '560px',
                controller: ['$scope', function ($scope) {
                    bindScope($scope,
                        pixelHorizontal,
                        pixelVertical,
                        pages);
                }]
            });
        };

        //打开自定义分辨率选择框
        this.openPixelSelectorDialog = function (ph, pv, callback) {
            ngDialog.open({
                template: currentScriptFolder + 'pixelSelector.html',
                className: 'ngdialog-theme-default',
                width: '560px',
                controller: ['$scope', function ($scope) {
                    $scope.pixelHorizontal = ph;
                    $scope.pixelVertical = pv;
                    $scope.okClick = function () {
                        if ($scope.pixelHorizontal !== ph || $scope.pixelVertical !== pv) {
                            callback($scope.pixelHorizontal, $scope.pixelVertical);
                        }
                        $scope.closeThisDialog();
                    };
                    $scope.cancelClick = function () {
                        $scope.closeThisDialog();
                    };
                }],
                preCloseCallback: function (value) {
                    //callback(value);
                    return true;
                }
            });
        };

        //打开节目保存对话框
        this.openProgramSaveDialog = function (args, callback) {
            ngDialog.open({
                template: currentScriptFolder + 'programSave.html',
                className: 'ngdialog-theme-default',
                width: '600px',
                controller: ['$scope', 'programService', '$rootScope', '$http', function ($scope, programService, $rootScope, $http) {

                    $scope.name = args.name || '';
                    $scope.pages = args.pages;
                    $scope.oid = args.oid;
                    (function () {
                        //动态获取总时长
                        $scope.getTotalTimes = function () {
                            var total_time = 0;
                            args.pages.forEach(function (page) {
                                total_time += page.stay;
                            });
                            return total_time;
                        };

                        //获取资源总数及大小
                        var resources = [];
                        programService.handleResourcesFromPages(args.pages, function (image) {
                            switch (image.ver) {
                                case 1:
                                    resources.push({
                                        path: image.path,
                                        size: image.size
                                    });
                                    break;
                                default :
                                    break;
                            }
                        }, function (video) {
                            switch (video.ver) {
                                case 1:
                                    resources.push({
                                        path: video.path,
                                        size: video.size
                                    });
                                    break;
                                default :
                                    break;
                            }
                        });
                        //去重复
                        resources = resources.unique(function (item) {
                            return item.path;
                        });
                        $scope.resourceCount = resources.length;
                        $scope.resourceSize = (function () {
                            var totalSize = 0;
                            resources.forEach(function (item) {
                                totalSize += item.size;
                            });
                            return totalSize;
                        })();
                    })();
                    (function () {
                        //console.log(args.pages);
                        var pagesSeconds = [];
                        args.pages.forEach(function (page) {

                            var elementsSeconds = [];
                            page.elements.forEach(function (ele) {
                                if (ele.type === 250) {//多图片轮播
                                    if (ele.data.images.length > 1) {
                                        var sec1 = (ele.data.duration / 1000 + ele.data.stay) * ele.data.images.length;
                                        if (sec1 !== 0) {
                                            elementsSeconds.push(Math.round(sec1));
                                        }
                                    }
                                } else if (ele.type === 350) {//多视频
                                    var sec2 = 0;
                                    ele.data.videos.forEach(function (video) {
                                        sec2 += video.duration;
                                    });
                                    if (sec2 !== 0) {
                                        elementsSeconds.push(Math.round(sec2));
                                    }
                                } else if (ele.type === 150) {
                                    var sec3 = (ele.layout.width / 100 + ele.data.value.length * ele.data.size / 1000) * 400 / ele.data.speed;
                                    if (sec3 !== 0) {
                                        elementsSeconds.push(Math.round(sec3));
                                    }
                                }
                            });

                            var maxSecond = 60;
                            if (elementsSeconds.length !== 0) {
                                maxSecond = elementsSeconds.max();
                            }
                            pagesSeconds.push(maxSecond);
                            //page.stay = maxSecond;
                        });

                        $scope.pagesSeconds = pagesSeconds;
                    })();

                    $scope.pixelHorizontal = args.pixelHorizontal;
                    $scope.pixelVertical = args.pixelVertical;

                    //群组
                    $scope.$on('emitGroupLeaf', function (e, data) {
                        //$scope.currentGroup = data;
                        $scope.oid = data.id;
                    });

                    //确定按钮
                    $scope.ensureClick = function () {
                        var name = $scope.name;
                        if (!name) {
                            layer.alert('请填写节目名称！');
                            return;
                        }
                        // if (!$scope.oid) {
                        //     layer.alert('请选择所属群组！');
                        //     return;
                        // }
                        callback(name, $scope.oid || '');
                        $scope.closeThisDialog();
                    };

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

        //打开模板保存对话框
        this.openTemplateSaveDialog = function (args, callback) {
            ngDialog.open({
                template: currentScriptFolder + 'templateSave.html',
                className: 'ngdialog-theme-default',
                width: '600px',
                controller: ['$scope', 'programService', function ($scope, programService) {

                    $scope.name = args.name || '';
                    $scope.page = args.page;
                    $scope.pixelHorizontal = args.pixelHorizontal;
                    $scope.pixelVertical = args.pixelVertical;

                    (function () {
                        //获取资源总数及大小
                        var resources = [];
                        programService.handleResourcesFromPages([args.page], function (image) {
                            switch (image.ver) {
                                case 1:
                                    resources.push({
                                        path: image.path,
                                        size: image.size
                                    });
                                    break;
                                default :
                                    break;
                            }
                        }, function (video) {
                            switch (video.ver) {
                                case 1:
                                    resources.push({
                                        path: video.path,
                                        size: video.size
                                    });
                                    break;
                                default :
                                    break;
                            }
                        });
                        //去重复
                        resources = resources.unique(function (item) {
                            return item.path;
                        });
                        $scope.resourceCount = resources.length;
                        $scope.resourceSize = (function () {
                            var totalSize = 0;
                            resources.forEach(function (item) {
                                totalSize += item.size;
                            });
                            return totalSize;
                        })();
                    })();

                    (function () {
                        var elementsSeconds = [];
                        args.page.elements.forEach(function (ele) {
                            if (ele.type === 250) {//多图片轮播
                                if (ele.data.images.length > 1) {
                                    var sec1 = (ele.data.duration / 1000 + ele.data.stay) * ele.data.images.length;
                                    if (sec1 !== 0) {
                                        elementsSeconds.push(Math.round(sec1));
                                    }
                                }
                            } else if (ele.type === 350) {//多视频
                                var sec2 = 0;
                                ele.data.videos.forEach(function (video) {
                                    sec2 += video.duration;
                                });
                                if (sec2 !== 0) {
                                    elementsSeconds.push(Math.round(sec2));
                                }
                            } else if (ele.type === 150) {
                                var sec3 = (ele.layout.width / 100 + ele.data.value.length * ele.data.size / 1000) * 400 / ele.data.speed;
                                if (sec3 !== 0) {
                                    elementsSeconds.push(Math.round(sec3));
                                }
                            }
                        });

                        var maxSecond = 60;
                        if (elementsSeconds.length !== 0) {
                            maxSecond = elementsSeconds.max();
                        }
                        args.page.stay = maxSecond;
                    })();

                    //确定按钮
                    $scope.ensureClick = function () {
                        var name = $scope.name;
                        if (!name) {
                            layer.alert('请填写模板名称！');
                            return;
                        }
                        callback(name);
                        $scope.closeThisDialog();
                    };

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

        //打开模板选择对话框
        this.openSingleTemplateSelectDialog = function (emptyRates, callback) {

            ngDialog.open({
                template: currentScriptFolder + 'singleTemplateSelect.html',
                className: 'ngdialog-theme-default',
                width: '980px',
                controller: ['$scope', 'templateService', function ($scope, templateService) {
                    $scope.tabIndex = 1;
                    $scope.selectTab = function (index) {
                        $scope.tabIndex = index;
                    };

                    //空白模板
                    (function () {
                        $scope.emptyRates = emptyRates;
                    })();

                    //公用模板翻页部分
                    (function () {
                        $scope.pageSize1 = 10;
                        $scope.pageIndex1 = 0;
                        $scope.recordCount1 = 0;
                        $scope.doPaging1 = doPaging;

                        doPaging(0);//默认打开第一页

                        //执行翻页动作
                        function doPaging(pageIndex) {
                            var data = {
                                pageSize: $scope.pageSize1,
                                pageIndex: pageIndex
                            };
                            //获取数据
                            templateService.getCommonTemplateList(data, function (data, recordCount) {
                                $scope.recordCount1 = recordCount;
                                $scope.pageIndex1 = pageIndex;
                                $scope.common_templates = data;
                            });
                        }
                    })();

                    //私有模板翻页部分
                    (function () {
                        $scope.pageSize2 = 10;
                        $scope.pageIndex2 = 0;
                        $scope.recordCount2 = 0;
                        $scope.doPaging2 = doPaging;

                        doPaging(0);//默认打开第一页

                        //执行翻页动作
                        function doPaging(pageIndex) {
                            var data = {
                                pageSize: $scope.pageSize2,
                                pageIndex: pageIndex
                            };
                            //获取数据
                            templateService.getTemplateList(data, function (data, recordCount) {
                                $scope.recordCount2 = recordCount;
                                $scope.pageIndex2 = pageIndex;
                                $scope.templates = data;
                            });
                        }
                    })();

                    //选取空白模板
                    $scope.chooseEmptyTemplate = function (rate) {
                        callback({
                            "pixelHorizontal": rate.pixelHorizontal,
                            "pixelVertical": rate.pixelVertical,
                            "page": {
                                "ver": 1,
                                "stay": 60,
                                "background": {
                                    "ver": 1,
                                    "type": 0,
                                    "image": null,
                                    "color": {
                                        "r": 0,
                                        "g": 0,
                                        "b": 0
                                    },
                                    "opacity": 100
                                },
                                "elements": []
                            }
                        });
                        $scope.closeThisDialog();
                    };

                    //选取模板
                    $scope.chooseTemplate = function (template) {
                        callback(template);
                        $scope.closeThisDialog();
                    };

                    //删除模板
                    $scope.deleteTemplate = function (template, $event) {
                        $event.stopPropagation();

                        layer.confirm('确定删除该模板吗？', {
                            btn: ['确定', '取消']
                        }, function () {
                            templateService.deleteTemplate(template.id, function () {
                                $scope.templates.remove(template);
                                layer.msg('已删除该模板！');
                            });
                        });

                    };

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

        //打开图片单选对话框
        this.openSingleImageSelectDialog = function (image, callback) {

            ngDialog.open({
                template: currentScriptFolder + 'singleImageSelect.html',
                className: 'ngdialog-theme-default',
                width: '980px',
                controller: ['$scope', 'imageService', function ($scope, imageService) {

                    //翻页部分
                    (function () {
                        $scope.search = '';
                        $scope.pageSize = 10;
                        $scope.pageIndex = 0;
                        $scope.recordCount = 0;
                        $scope.doPaging = doPaging;

                        $scope.doQuery = function () {
                            doPaging(0);
                        };

                        doPaging(0);//默认打开第一页

                        //执行翻页动作
                        function doPaging(pageIndex) {
                            var data = {
                                search: $scope.search.trim(),
                                pageSize: $scope.pageSize,
                                pageIndex: pageIndex
                            };
                            //获取数据
                            imageService.getImageList(data, function (data, recordCount) {
                                $scope.recordCount = recordCount;
                                $scope.pageIndex = pageIndex;
                                $scope.images = data;
                            });
                        }
                    })();

                    //选取图片
                    $scope.chooseImage = function (image) {
                        callback(angular.copy(image));
                        $scope.closeThisDialog();
                    };

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

        //打开图片多选对话框
        this.openMultipleImageSelectDialog = function (images, callback) {

            ngDialog.open({
                template: currentScriptFolder + 'multipleImageSelect.html',
                className: 'ngdialog-theme-default',
                width: '1200px',
                controller: ['$scope', 'imageService', function ($scope, imageService) {

                    //右侧拖拽效果参数
                    (function () {
                        $scope.sortableOptions = {
                            axis: 'y'
                        };
                    })();

                    //翻页部分
                    (function () {
                        $scope.search = '';
                        $scope.pageSize = 10;
                        $scope.pageIndex = 0;
                        $scope.recordCount = 0;
                        $scope.doPaging = doPaging;

                        $scope.doQuery = function () {
                            doPaging(0);
                        };

                        doPaging(0);//默认打开第一页

                        //执行翻页动作
                        function doPaging(pageIndex) {
                            var data = {
                                search: $scope.search.trim(),
                                pageSize: $scope.pageSize,
                                pageIndex: pageIndex
                            };
                            //获取数据
                            imageService.getImageList(data, function (data, recordCount) {
                                $scope.recordCount = recordCount;
                                $scope.pageIndex = pageIndex;
                                $scope.images = data;
                            });
                        }
                    })();

                    //初始化已选图片
                    $scope.selectedImages = [];
                    for (var i = 0; i < images.length; i++) {
                        $scope.selectedImages.push(images[i]);
                    }

                    $scope.testCheck = function (image) {
                        return $scope.selectedImages.some(function (item) {
                            return item.path === image.path;
                        });
                    };

                    //选取图片
                    $scope.selectImage = function (image) {
                        if ($scope.selectedImages.some(function (item) {
                                return item.path === image.path;
                            })) {
                            layer.confirm('已选取该图片，是否再次选取？', {
                                btn: ['是', '否']
                            }, function () {
                                layer.closeAll('dialog');
                                $scope.$apply(function () {
                                    $scope.selectedImages.push(angular.copy(image));
                                });
                            });
                        } else {
                            $scope.selectedImages.push(angular.copy(image));
                        }
                    };

                    //反选图片
                    $scope.unSelectImage = function (image) {
                        $scope.selectedImages.remove(image);
                    };

                    //确定按钮
                    $scope.ensureClick = function () {
                        callback($scope.selectedImages);
                        $scope.closeThisDialog();
                    };

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

        //打开单视频选择对话框
        this.openSingleVideoSelectDialog = function (video, callback) {

            ngDialog.open({
                template: currentScriptFolder + 'singleVideoSelect.html',
                className: 'ngdialog-theme-default',
                width: '980px',
                controller: ['$scope', 'videoService', function ($scope, videoService) {

                    //翻页部分
                    (function () {
                        $scope.search = '';
                        $scope.pageSize = 10;
                        $scope.pageIndex = 0;
                        $scope.recordCount = 0;
                        $scope.doPaging = doPaging;

                        $scope.doQuery = function () {
                            doPaging(0);
                        };

                        doPaging(0);//默认打开第一页

                        //执行翻页动作
                        function doPaging(pageIndex) {
                            var data = {
                                search: $scope.search.trim(),
                                pageSize: $scope.pageSize,
                                pageIndex: pageIndex
                            };
                            //获取数据
                            videoService.getVideoList(data, function (data, recordCount) {
                                $scope.recordCount = recordCount;
                                $scope.pageIndex = pageIndex;
                                $scope.videos = data;
                            });
                        }
                    })();

                    //选取视频
                    $scope.chooseVideo = function (video) {
                        callback(angular.copy(video));
                        $scope.closeThisDialog();
                    };

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

        //打开多视频选择对话框
        this.openMultipleVideoSelectDialog = function (videos, callback) {
            ngDialog.open({
                template: currentScriptFolder + 'multipleVideoSelect.html',
                className: 'ngdialog-theme-default',
                width: '1200px',
                controller: ['$scope', 'videoService', function ($scope, videoService) {

                    //右侧拖拽效果参数
                    (function () {
                        $scope.sortableOptions = {
                            axis: 'y'
                        };
                    })();

                    //查询翻页部分
                    (function () {
                        $scope.search = '';
                        $scope.pageSize = 10;
                        $scope.pageIndex = 0;
                        $scope.recordCount = 0;
                        $scope.doPaging = doPaging;

                        $scope.doQuery = function () {
                            doPaging(0);
                        };

                        doPaging(0);//默认打开第一页

                        //执行翻页动作
                        function doPaging(pageIndex) {
                            var data = {
                                search: $scope.search.trim(),
                                pageSize: $scope.pageSize,
                                pageIndex: pageIndex
                            };
                            //获取数据
                            videoService.getVideoList(data, function (data, recordCount) {
                                $scope.recordCount = recordCount;
                                $scope.pageIndex = pageIndex;
                                $scope.videos = data;
                            });
                        }
                    })();

                    //初始化已选视频
                    $scope.selectedVideos = [];
                    for (var i = 0; i < videos.length; i++) {
                        $scope.selectedVideos.push(videos[i]);
                    }

                    $scope.testCheck = function (video) {
                        return $scope.selectedVideos.some(function (item) {
                            return item.path === video.path;
                        });
                    };

                    //选取视频
                    $scope.selectVideo = function (video) {
                        if ($scope.selectedVideos.some(function (item) {
                                return item.path === video.path;
                            })) {
                            layer.confirm('已选取该视频，是否再次选取？', {
                                btn: ['是', '否']
                            }, function () {
                                layer.closeAll('dialog');
                                $scope.$apply(function () {
                                    $scope.selectedVideos.push(angular.copy(video));
                                });
                            });
                        } else {
                            $scope.selectedVideos.push(angular.copy(video));
                        }
                    };

                    //反选视频
                    $scope.unSelectVideo = function (video) {
                        $scope.selectedVideos.remove(video);
                    };

                    //确定按钮
                    $scope.ensureClick = function () {
                        callback($scope.selectedVideos);
                        $scope.closeThisDialog();
                    };

                    //关闭弹窗
                    $scope.close_dialog = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }]
            });
        };

    }]);

})(app);
