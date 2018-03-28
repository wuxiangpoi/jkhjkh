(function (app) {

    function uniqueAdd(pixels, ph, pv) {
        var now_str = ph + '*' + pv;
        if (pixels.every(function (value) {
                return value !== now_str;
            })) {
            pixels.push(now_str);
        }
    }

    //节目列表控制器
    app.controller('programListController', ['$scope', '$state', 'dialogService', 'programService', function ($scope, $state, dialogService, programService) {

        //根据ID预览节目
        $scope.programPreviewById = dialogService.openProgramPreviewDialogById;

        //programService.getProgramList(function (data) {
        //    $scope.programs = data;
        //});

        $scope.pageSize = 12;
        $scope.pageIndex = 0;
        $scope.recordCount = 0;
        $scope.doPaging = doPaging;

        doPaging(0);//默认打开第一页

        //执行翻页动作
        function doPaging(pageIndex) {
            var data = {
                pageSize: $scope.pageSize,
                pageIndex: pageIndex
            };
            programService.getProgramList(data, function (data, recordCount) {
                $scope.recordCount = recordCount;
                $scope.pageIndex = pageIndex;
                $scope.programs = data;
            });
        }

        //删除节目
        $scope.deleteProgram = function (program) {
            layer.confirm('确定删除该节目吗？', {
                btn: ['确定', '取消']
            }, function () {
                programService.deleteProgramById(program.id, function (result) {
                    $scope.programs.remove(program);
                    layer.msg('已删除该节目！');
                });
            });
        };

    }]);

    //新增节目控制器
    app.controller('programAddController', ['$scope', '$rootScope', '$state', '$stateParams', 'dialogService', 'programService', 'templateService', 'editorTestService', function ($scope, $rootScope, $state, $stateParams, dialogService, programService, templateService, editorTestService) {

        $scope.program = {
            pixelHorizontal: 1920,
            pixelVertical: 1080,
            pages: []
        };

        //可选的空白模板比例
        var emptyRates = [
            {"pixelHorizontal": 1920, "pixelVertical": 1080},
            {"pixelHorizontal": 1080, "pixelVertical": 1920},
            {"pixelHorizontal": 1366, "pixelVertical": 768},
            {"pixelHorizontal": 768, "pixelVertical": 1366}
        ];

        //进入新增节目界面时，自动弹窗选择模板
        dialogService.openSingleTemplateSelectDialog(emptyRates, function (template) {
            $scope.program.pixelHorizontal = template.pixelHorizontal;
            $scope.program.pixelVertical = template.pixelVertical;
            $scope.program.pages.push(template.page);

            $scope.$broadcast('auto-selected-template', template);
        });

        //选取单个模板
        $scope.$on('on-select-single-page', function (e, callback) {
            var emptyRates = [{
                pixelHorizontal: $scope.program.pixelHorizontal,
                pixelVertical: $scope.program.pixelVertical
            }];
            dialogService.openSingleTemplateSelectDialog(emptyRates, callback);
        });

        $scope.selectPixel = dialogService.openPixelSelectorDialog;

        //选取单个图片
        $scope.$on('on-select-single-image', function (e, image, callback) {
            dialogService.openSingleImageSelectDialog(image, callback);
        });

        //选取多个图片
        $scope.$on('on-select-multiple-image', function (e, images, callback) {
            dialogService.openMultipleImageSelectDialog(images, callback);
        });

        //选取单个视频
        $scope.$on('on-select-single-video', function (e, video, callback) {
            dialogService.openSingleVideoSelectDialog(video, callback);
        });

        //选取多个视频
        $scope.$on('on-select-multiple-video', function (e, videos, callback) {
            dialogService.openMultipleVideoSelectDialog(videos, callback);
        });

        //预览
        $scope.goPreview = dialogService.openProgramPreviewDialog;

        //返回
        $scope.goBack = function () {
            //window.history.back();
            $state.go("dashboard.program");
        };

        //提交保存节目
        $scope.submitAddProgram = function (pixelHorizontal, pixelVertical, pages) {
            if (pages.length === 0) {
                layer.alert('不能保存空节目！');
                return;
            }

            var sensitiveWord = editorTestService.getFirstSensitiveWord(pages);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            if (editorTestService.testAnyElementIsEmpty(pages)) {//有任何一个元素内容为空
                layer.confirm('当前节目存在无内容控件，是否继续保存？', {
                    btn: ['保存', '取消']
                }, function () {
                    layer.closeAll('dialog');
                    saveData();
                });
            } else {
                saveData();
            }

            function saveData() {
                dialogService.openProgramSaveDialog({
                    pixelHorizontal: pixelHorizontal,
                    pixelVertical: pixelVertical,
                    name: '',
                    pages: pages,
                    oid: null//组织机构ID
                }, function (name, oid) {
                    programService.addProgram({
                        oid: oid,
                        name: name,
                        pixelHorizontal: pixelHorizontal,
                        pixelVertical: pixelVertical,
                        pages: pages
                    }, function (data) {
                        uniqueAdd($rootScope.root_programReslotions, pixelHorizontal, pixelVertical);
                        $scope.goBack();
                    });
                });
            }
        };

        //保存模板
        $scope.saveTemplate = function (pixelHorizontal, pixelVertical, page) {

            if (page === null) {
                layer.alert('当前未选中场景！');
                return;
            }

            if (page.elements.length === 0) {
                layer.alert('不能保存空白模板！');
                return;
            }

            var sensitiveWord = editorTestService.getFirstSensitiveWord([page]);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            dialogService.openTemplateSaveDialog({
                pixelHorizontal: pixelHorizontal,
                pixelVertical: pixelVertical,
                page: page
            }, function (name) {
                templateService.addTemplate({
                    name: name,
                    pixelHorizontal: pixelHorizontal,
                    pixelVertical: pixelVertical,
                    page: page
                }, function (data) {
                    layer.msg('已保存模板！');
                    //console.log('已保存模板！');
                });
            });
        };

    }]);

    //修改节目控制器
    app.controller('programEditController', ['$scope', '$rootScope', '$state', '$stateParams', 'dialogService', 'programService', 'templateService', 'editorTestService', function ($scope, $rootScope, $state, $stateParams, dialogService, programService, templateService, editorTestService) {

        var pid = $stateParams.id;//节目ID

        programService.getProgramById(pid, function (program) {
            $scope.program = program;
        });

        //选取单个模板
        $scope.$on('on-select-single-page', function (e, callback) {
            var emptyRates = [{
                pixelHorizontal: $scope.program.pixelHorizontal,
                pixelVertical: $scope.program.pixelVertical
            }];
            dialogService.openSingleTemplateSelectDialog(emptyRates, callback);
        });

        $scope.selectPixel = dialogService.openPixelSelectorDialog;

        //选取单个图片
        $scope.$on('on-select-single-image', function (e, image, callback) {
            dialogService.openSingleImageSelectDialog(image, callback);
        });

        //选取多个图片
        $scope.$on('on-select-multiple-image', function (e, images, callback) {
            dialogService.openMultipleImageSelectDialog(images, callback);
        });

        //选取单个视频
        $scope.$on('on-select-single-video', function (e, video, callback) {
            dialogService.openSingleVideoSelectDialog(video, callback);
        });

        //选取多个视频
        $scope.$on('on-select-multiple-video', function (e, videos, callback) {
            dialogService.openMultipleVideoSelectDialog(videos, callback);
        });

        //预览
        $scope.goPreview = dialogService.openProgramPreviewDialog;

        //返回
        $scope.goBack = function () {
            //window.history.back();
            $state.go("dashboard.program");
        };

        //提交修改节目
        $scope.submitEditProgram = function (pixelHorizontal, pixelVertical, pages) {
            if (pages.length === 0) {
                layer.alert('不能保存空节目！');
                return;
            }

            var sensitiveWord = editorTestService.getFirstSensitiveWord(pages);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            if (editorTestService.testAnyElementIsEmpty(pages)) {//有任何一个元素内容为空
                layer.confirm('当前节目存在无内容控件，是否继续保存？', {
                    btn: ['保存', '取消']
                }, function () {
                    layer.closeAll('dialog');
                    saveData();
                });
            } else {
                saveData();
            }

            function saveData() {
                dialogService.openProgramSaveDialog({
                    pixelHorizontal: pixelHorizontal,
                    pixelVertical: pixelVertical,
                    name: $scope.program.name,
                    pages: pages,
                    oid: $scope.program.oid//组织机构ID
                }, function (name, oid) {
                    programService.updateProgram({
                        id: pid,
                        oid: oid,
                        name: name,
                        pixelHorizontal: pixelHorizontal,
                        pixelVertical: pixelVertical,
                        pages: pages
                    }, function (data) {
                        uniqueAdd($rootScope.root_programReslotions, pixelHorizontal, pixelVertical);
                        $scope.goBack();
                    });
                });
            }
        };

        //保存模板
        $scope.saveTemplate = function (pixelHorizontal, pixelVertical, page) {

            if (page === null) {
                layer.alert('当前未选中场景！');
                return;
            }

            if (page.elements.length === 0) {
                layer.alert('不能保存空白模板！');
                return;
            }

            var sensitiveWord = editorTestService.getFirstSensitiveWord([page]);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            dialogService.openTemplateSaveDialog({
                pixelHorizontal: pixelHorizontal,
                pixelVertical: pixelVertical,
                page: page
            }, function (name) {
                templateService.addTemplate({
                    name: name,
                    pixelHorizontal: pixelHorizontal,
                    pixelVertical: pixelVertical,
                    page: page
                }, function (data) {
                    layer.msg('已保存模板！');
                    //console.log('已保存模板！');
                });
            });
        };

    }]);


    //复制节目控制器
    app.controller('programCopyController', ['$scope', '$rootScope', '$state', '$stateParams', 'dialogService', 'programService', 'templateService', 'editorTestService', function ($scope, $rootScope, $state, $stateParams, dialogService, programService, templateService, editorTestService) {

        var pid = $stateParams.id;//节目ID

        programService.getProgramById(pid, function (program) {
            $scope.program = program;
        });

        //选取单个模板
        $scope.$on('on-select-single-page', function (e, callback) {
            var emptyRates = [{
                pixelHorizontal: $scope.program.pixelHorizontal,
                pixelVertical: $scope.program.pixelVertical
            }];
            dialogService.openSingleTemplateSelectDialog(emptyRates, callback);
        });

        $scope.selectPixel = dialogService.openPixelSelectorDialog;

        //选取单个图片
        $scope.$on('on-select-single-image', function (e, image, callback) {
            dialogService.openSingleImageSelectDialog(image, callback);
        });

        //选取多个图片
        $scope.$on('on-select-multiple-image', function (e, images, callback) {
            dialogService.openMultipleImageSelectDialog(images, callback);
        });

        //选取单个视频
        $scope.$on('on-select-single-video', function (e, video, callback) {
            dialogService.openSingleVideoSelectDialog(video, callback);
        });

        //选取多个视频
        $scope.$on('on-select-multiple-video', function (e, videos, callback) {
            dialogService.openMultipleVideoSelectDialog(videos, callback);
        });

        //预览
        $scope.goPreview = dialogService.openProgramPreviewDialog;

        //返回
        $scope.goBack = function () {
            //window.history.back();
            $state.go("dashboard.program");
        };

        //提交保存节目
        $scope.submitAddProgram = function (pixelHorizontal, pixelVertical, pages) {
            if (pages.length === 0) {
                layer.alert('不能保存空节目！');
                return;
            }

            var sensitiveWord = editorTestService.getFirstSensitiveWord(pages);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            if (editorTestService.testAnyElementIsEmpty(pages)) {//有任何一个元素内容为空
                layer.confirm('当前节目存在无内容控件，是否继续保存？', {
                    btn: ['保存', '取消']
                }, function () {
                    layer.closeAll('dialog');
                    saveData();
                });
            } else {
                saveData();
            }

            function saveData() {
                dialogService.openProgramSaveDialog({
                    pixelHorizontal: pixelHorizontal,
                    pixelVertical: pixelVertical,
                    name: '',
                    pages: pages,
                    oid: null//组织机构ID
                }, function (name, oid) {
                    programService.addProgram({
                        oid: oid,
                        name: name,
                        pixelHorizontal: pixelHorizontal,
                        pixelVertical: pixelVertical,
                        pages: pages
                    }, function (data) {
                        uniqueAdd($rootScope.root_programReslotions, pixelHorizontal, pixelVertical);
                        $scope.goBack();
                    });
                });
            }
        };

        //保存模板
        $scope.saveTemplate = function (pixelHorizontal, pixelVertical, page) {

            if (page === null) {
                layer.alert('当前未选中场景！');
                return;
            }

            if (page.elements.length === 0) {
                layer.alert('不能保存空白模板！');
                return;
            }

            var sensitiveWord = editorTestService.getFirstSensitiveWord([page]);
            if (sensitiveWord !== null) {//存在敏感词
                layer.alert('抱歉，你的文字中包含有被禁止的词汇（' + sensitiveWord + '），建议你修改相关内容');
                return;
            }

            dialogService.openTemplateSaveDialog({
                pixelHorizontal: pixelHorizontal,
                pixelVertical: pixelVertical,
                page: page
            }, function (name) {
                templateService.addTemplate({
                    name: name,
                    pixelHorizontal: pixelHorizontal,
                    pixelVertical: pixelVertical,
                    page: page
                }, function (data) {
                    layer.msg('已保存模板！');
                    //console.log('已保存模板！');
                });
            });
        };

    }]);

})(app);
