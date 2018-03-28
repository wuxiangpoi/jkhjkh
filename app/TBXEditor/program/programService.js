(function (app) {

    app.service('programService', ['dmbdRest', 'editorResourceService', function (dmbdRest, editorResourceService) {

        //获取已有节目列表
        this.getProgramList = function (data, success) {
            var apiUrl = '../api/program/getProgramList';
            return dmbdRest.get(apiUrl, {
                start: data.pageSize * data.pageIndex,
                length: data.pageSize
            }, function (content) {
                var programs = [];
                var allPaths = [];
                content.data.forEach(function (item) {
                    var program = angular.fromJson(item.content);
                    program.id = item.id;
                    program.name = item.name;
                    program.oid = item.oid;
                    program.size = item.size;
                    program.duration = item.duration;
                    program.createTime = item.createTime;

                    var paths = editorResourceService.getResourcePathsFromPages(program.pages);//提炼出资源标识符

                    programs.push(program);
                    paths.forEach(function (path) {
                        allPaths.push(path);
                    });
                });

                allPaths = allPaths.unique();//去重复

                if (allPaths.length === 0) {
                    programs.forEach(function (program) {
                        if (!program.pixelHorizontal || !program.pixelVertical) {
                            var pixel = getPixel(program.rateHorizontal, program.rateVertical);
                            program.pixelHorizontal = pixel.h;
                            program.pixelVertical = pixel.v;
                        }
                    });

                    success(programs, content.recordsTotal);
                } else {
                    dmbdRest.post('../api/material/getMaterialMapByPaths', {
                        paths: angular.toJson(allPaths)
                    }, function (pathMaps) {
                        programs.forEach(function (program) {
                            editorResourceService.setResourcePropertyWithoutPathToPages(program.pages, pathMaps);

                            if (!program.pixelHorizontal || !program.pixelVertical) {
                                var pixel = getPixel(program.rateHorizontal, program.rateVertical);
                                program.pixelHorizontal = pixel.h;
                                program.pixelVertical = pixel.v;
                            }
                        });

                        success(programs, content.recordsTotal);
                    });
                }
            });
        };

        //根据ID获取节目
        this.getProgramById = function (pid, success) {
            var apiUrl = '../api/program/getProgramById';
            return dmbdRest.get(apiUrl, {
                id: pid
            }, function (content) {
                var program = angular.fromJson(content.content);
                program.id = content.id;
                program.name = content.name;
                program.oid = content.oid;
                program.size = content.size;
                program.duration = content.duration;
                program.createTime = content.createTime;

                var paths = editorResourceService.getResourcePathsFromPages(program.pages);//提炼出资源标识符

                if (paths.length === 0) {
                    if (!program.pixelHorizontal || !program.pixelVertical) {
                        var pixel = getPixel(program.rateHorizontal, program.rateVertical);
                        program.pixelHorizontal = pixel.h;
                        program.pixelVertical = pixel.v;
                    }

                    success(program);
                } else {
                    //测新接口
                    dmbdRest.post('../api/material/getMaterialMapByPaths', {
                        paths: angular.toJson(paths)
                    }, function (pathMaps) {
                        editorResourceService.setResourcePropertyWithoutPathToPages(program.pages, pathMaps);

                        if (!program.pixelHorizontal || !program.pixelVertical) {
                            var pixel = getPixel(program.rateHorizontal, program.rateVertical);
                            program.pixelHorizontal = pixel.h;
                            program.pixelVertical = pixel.v;
                        }

                        success(program);
                    });
                }
            });
        };


        function getPixel(rateHorizontal, rateVertical) {
            var list = [
                {h: 1920, v: 1080, rh: 16, rv: 9},
                {h: 1080, v: 1920, rh: 9, rv: 16},
                {h: 1366, v: 768, rh: 16, rv: 9},
                {h: 768, v: 1366, rh: 9, rv: 16},
                {h: 1024, v: 768, rh: 4, rv: 3},
                {h: 768, v: 1024, rh: 3, rv: 4}
            ];
            var find = list.find(function (item) {
                return item.rh === rateHorizontal && item.rv === rateVertical;
            });
            return find ? {
                h: find.h,
                v: find.v
            } : {
                h: 1920,
                v: 1080
            };
        }


        function getRate(pixelHorizontal, pixelVertical) {
            var list = [
                {h: 1920, v: 1080, rh: 16, rv: 9},
                {h: 1080, v: 1920, rh: 9, rv: 16},
                {h: 1366, v: 768, rh: 16, rv: 9},
                {h: 768, v: 1366, rh: 9, rv: 16},
                {h: 1024, v: 768, rh: 4, rv: 3},
                {h: 768, v: 1024, rh: 3, rv: 4}
            ];
            var find = list.find(function (item) {
                return item.h === pixelHorizontal && item.v === pixelVertical;
            });
            return find ? {
                rh: find.rh,
                rv: find.rv
            } : {
                rh: pixelHorizontal,
                rv: pixelVertical
            };
        }

        //添加节目
        this.addProgram = function (data, success) {
            data = angular.copy(data);//深度克隆对象，防止原始数据被更改
            var apiUrl = '../api/program/saveProgram';
            editorResourceService.deleteResourcePropertyWithoutPathFromPages(data.pages);
            var paths = editorResourceService.getResourcePathsFromPages(data.pages);//提炼出资源标识符
            var duration = 0;//节目时长
            data.pages.forEach(function (page) {
                duration += page.stay;
            });
            var rate = getRate(data.pixelHorizontal, data.pixelVertical);//获取比例
            return dmbdRest.post(apiUrl, {
                oid: data.oid,
                name: data.name,
                pixelHorizontal: data.pixelHorizontal,
                pixelVertical: data.pixelVertical,
                rateHorizontal: rate.rh,//应客户端要求设置比例字段
                rateVertical: rate.rv,//应客户端要求设置比例字段
                content: angular.toJson({
                    pixelHorizontal: data.pixelHorizontal,
                    pixelVertical: data.pixelVertical,
                    rateHorizontal: rate.rh,//应客户端要求设置比例字段
                    rateVertical: rate.rv,//应客户端要求设置比例字段
                    pages: data.pages
                }),
                materials: angular.toJson(paths),
                duration: duration
            }, function (content) {
                success(content);
            });
        };

        //更新节目
        this.updateProgram = function (data, success) {
            data = angular.copy(data);//深度克隆对象，防止原始数据被更改
            var apiUrl = '../api/program/saveProgram';
            editorResourceService.deleteResourcePropertyWithoutPathFromPages(data.pages);
            var paths = editorResourceService.getResourcePathsFromPages(data.pages);//提炼出资源标识符
            var duration = 0;//节目时长
            data.pages.forEach(function (page) {
                duration += page.stay;
            });
            var rate = getRate(data.pixelHorizontal, data.pixelVertical);//获取比例
            return dmbdRest.post(apiUrl, {
                id: data.id,
                oid: data.oid,
                name: data.name,
                pixelHorizontal: data.pixelHorizontal,
                pixelVertical: data.pixelVertical,
                rateHorizontal: rate.rh,//应客户端要求设置比例字段
                rateVertical: rate.rv,//应客户端要求设置比例字段
                content: angular.toJson({
                    pixelHorizontal: data.pixelHorizontal,
                    pixelVertical: data.pixelVertical,
                    rateHorizontal: rate.rh,//应客户端要求设置比例字段
                    rateVertical: rate.rv,//应客户端要求设置比例字段
                    pages: data.pages
                }),
                materials: angular.toJson(paths),
                duration: duration
            }, function (content) {
                success(content);
            });
        };

        //删除节目
        this.deleteProgramById = function (id, success) {
            var apiUrl = '../api/program/deleteProgram';
            return dmbdRest.post(apiUrl, {
                id: id
            }, function (content) {
                success(content);
            });
        };

    }]);

})(app);
