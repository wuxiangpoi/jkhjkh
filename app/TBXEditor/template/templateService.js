(function (app) {

    app.service('templateService', ['dmbdRest', 'programService', 'dmbdOSSImageUrlResizeFilterFilter', '$q', function (dmbdRest, programService, dmbdOSSImageUrlResizeFilter, $q) {

        //获取公共模板列表
        this.getCommonTemplateList = function (data, success) {
            var apiUrl = 'mock/template_list2.json';
            return dmbdRest.get(apiUrl, {
                pageSize: data.pageSize,
                pageIndex: data.pageIndex
            }, function (content) {
                var templates = [];

                var allPaths = [];
                content.data.forEach(function (item) {
                    var template = item;
                    templates.push(template);

                    var paths = programService.getResourcePathsFromPages([template.page]);//提炼出资源标识符
                    paths.forEach(function (path) {
                        allPaths.push(path);
                    });
                });

                allPaths = allPaths.unique();//去重复
                
                if (allPaths.length === 0) {
                    success(templates, content.recordsTotal);
                } else {
                    dmbdRest.post('../api/material/getMaterialMapByPaths', {
                        paths: angular.toJson(allPaths)
                    }, function (pathMaps) {
                        templates.forEach(function (template) {
                            programService.setResourceInfoToPages([template.page], allPaths, pathMaps, dmbdOSSImageUrlResizeFilter);

                            template.pixelHorizontal = template.pixelHorizontal || 1920;
                            template.pixelVertical = template.pixelVertical || 1080;
                        });

                        success(templates, content.recordsTotal);
                    });
                }

            });
        };

        //获取模板列表(私有)
        this.getTemplateList = function (data, success) {
            var apiUrl = '../api/template/getTemplateListPage';
            return dmbdRest.get(apiUrl, {
                start: data.pageSize * data.pageIndex,
                length: data.pageSize
            }, function (content) {
                var templates = [];

                var allPaths = [];
                content.data.forEach(function (item) {
                    var template = {
                        id: item.id,
                        name: item.name,
                        pixelHorizontal: item.pixelHorizontal,
                        pixelVertical: item.pixelVertical,
                        page: angular.fromJson(item.content)
                    };
                    templates.push(template);

                    var paths = programService.getResourcePathsFromPages([template.page]);//提炼出资源标识符
                    paths.forEach(function (path) {
                        allPaths.push(path);
                    });
                });

                allPaths = allPaths.unique();//去重复

                if (allPaths.length === 0) {
                    success(templates, content.recordsTotal);
                } else {
                    dmbdRest.post('../api/material/getMaterialMapByPaths', {
                        paths: angular.toJson(allPaths)
                    }, function (pathMaps) {
                        templates.forEach(function (template) {
                            programService.setResourceInfoToPages([template.page], allPaths, pathMaps, dmbdOSSImageUrlResizeFilter);

                            template.pixelHorizontal = template.pixelHorizontal || 1920;
                            template.pixelVertical = template.pixelVertical || 1080;
                        });

                        success(templates, content.recordsTotal);
                    });
                }

            });
        };


        //添加模板
        this.addTemplate = function (data, success) {
            data = angular.copy(data);//深度克隆对象，防止原始数据被更改
            var apiUrl = '../api/template/saveTemplate';
            programService.deleteResourceUrlsFromPages([data.page]);
            return dmbdRest.post(apiUrl, {
                name: data.name,
                pixelHorizontal: data.pixelHorizontal,
                pixelVertical: data.pixelVertical,
                content: angular.toJson(data.page)
            }, function (content) {
                success(content);
            });
        };

        //删除模板
        this.deleteTemplate = function (id, success) {
            var apiUrl = '../api/template/deleteTemplate';
            return dmbdRest.post(apiUrl, {
                id: id
            }, function (content) {
                success(content);
            });
        };

    }]);

})(app);
