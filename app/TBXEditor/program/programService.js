(function (app) {

    //获取第一个匹配到的敏感词，如全局未获取，则返回null
    function getFirstSensitiveWord(pages) {
        var word = null;
        pages.forEach(function (page) {
            page.elements.forEach(function (ele) {
                if (ele.type === 160) {
                    var text = ele.data.value;
                    for (var i = 0, len = sensitivities.length; i < len; i++) {
                        if (text.indexOf(sensitivities[i]) !== -1) {
                            word = sensitivities[i];
                            break;
                        }
                    }
                }
            });
        });
        return word;
    }

    function testAnyElementIsEmpty(pages) {
        for (var i = 0; i < pages.length; i++) {
            var elements = pages[i].elements;
            for (var j = 0; j < elements.length; j++) {
                var ele = elements[j];
                switch (ele.type) {
                    case 160:
                        if (!ele.data.value) {
                            return true;
                        }
                        break;
                    case 250:
                        if (ele.data.images.length === 0) {
                            return true;
                        }
                        break;
                    case 350:
                        if (ele.data.videos.length === 0) {
                            return true;
                        }
                        break;
                    case 900:
                        if (!ele.data.url) {
                            return true;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return false;
    }

    //处理节目中的资源
    var handleResourcesFromPages = (function () {
        return function (pages, imageHandler, videoHandler) {
            pages.forEach(function (page) {
                switch (page.ver) {
                    case 1:
                        handleImageFromBackground(page.background, imageHandler);
                        page.elements.forEach(function (ele) {
                            switch (ele.ver) {
                                case 1:
                                    handleImageFromBackground(ele.background, imageHandler);
                                    handleResourceFromElement(ele.type, ele.data, imageHandler, videoHandler);
                                    break;
                                default :
                                    break;
                            }
                        });
                        break;
                    default :
                        break;
                }
            });
        };

        function handleImageFromBackground(background, handler) {
            switch (background.ver) {
                case 1:
                    if (background.type === 2 && background.image) {
                        handler(background.image);
                    }
                    break;
                default :
                    break;
            }
        }

        function handleResourceFromElement(type, data, imageHandler, videoHandler) {
            switch (type) {
                case 200:
                    handleImageFromImage(data, imageHandler);
                    break;
                case 250:
                    handleImageFromCarousel(data, imageHandler);
                    break;
                case 300:
                    handleVideoFromVideo(data, videoHandler);
                    break;
                case 350:
                    handleVideoFromSerie(data, videoHandler);
                    break;
                default :
                    break;
            }
        }

        function handleImageFromImage(data, handler) {
            switch (data.ver) {
                case 1:
                    if (data.image) {
                        handler(data.image);
                    }
                    break;
                default :
                    break;
            }
        }

        function handleImageFromCarousel(data, handler) {
            switch (data.ver) {
                case 1:
                    data.images.forEach(handler);
                    break;
                default :
                    break;
            }
        }

        function handleVideoFromVideo(data, handler) {
            switch (data.ver) {
                case 1:
                    if (data.video) {
                        handler(data.video);
                    }
                    break;
                default :
                    break;
            }
        }

        function handleVideoFromSerie(data, handler) {
            switch (data.ver) {
                case 1:
                    data.videos.forEach(handler);
                    break;
                default :
                    break;
            }
        }
    })();

    //从节目页面（场景）集合中获取资源列表，并去除重复
    var getResourcePathsFromPages = (function () {
        return function (pages) {
            var paths = [];

            handleResourcesFromPages(pages, function (image) {
                switch (image.ver) {
                    case 1:
                        paths.push(image.path);
                        break;
                    default :
                        paths.push(image);
                        break;
                }
            }, function (video) {
                switch (video.ver) {
                    case 1:
                        paths.push(video.path);
                        break;
                    default :
                        paths.push(video);
                        break;
                }
            });

            return paths.unique();
        };
    })();

    //从节目页面（场景）集合中获取资源列表（包含快照），并去除重复
    var getResourcePathsWithSnapshotFromPages = (function () {
        return function (pages) {
            var paths = [];

            handleResourcesFromPages(pages, function (image) {
                switch (image.ver) {
                    case 1:
                        paths.push(image.path);
                        break;
                    default :
                        paths.push(image);
                        break;
                }
            }, function (video) {
                switch (video.ver) {
                    case 1:
                        paths.push(video.path);
                        paths.push(video.path + '.jpg');//快照
                        break;
                    default :
                        paths.push(video);
                        break;
                }
            });

            return paths.unique();
        };
    })();

    //为每个资源添加授权的URL属性2
    var setResourceUrlsToPages2 = (function () {
        return function (pages, dmbdOSSImageUrlResizeFilter) {
            handleResourcesFromPages(pages, function (image) {
                switch (image.ver) {
                    case 1:
                        image.url = dmbdOSSImageUrlResizeFilter(image.path, 400);
                        break;
                    default :
                        break;
                }
            }, function (video) {
                switch (video.ver) {
                    case 1:
                        video.url = video.path;
                        var poster = video.path.substring(0, video.path.lastIndexOf('.')) + '.BMP';
                        video.snapshot = dmbdOSSImageUrlResizeFilter(poster, 400);
                        break;
                    default :
                        break;
                }
            });
        };
    })();

    //为每个资源添加授权的URL属性
    var setResourceUrlsToPages = (function () {
        return function (pages, paths, urls, dmbdOSSImageUrlResizeFilter) {
            handleResourcesFromPages(pages, function (image) {
                switch (image.ver) {
                    case 1:
                        var index = paths.indexOf(image.path);
                        image.url = dmbdOSSImageUrlResizeFilter(urls[index], 400);
                        break;
                    default :
                        break;
                }
            }, function (video) {
                switch (video.ver) {
                    case 1:
                        var index = paths.indexOf(video.path);
                        video.url = urls[index];
                        var sIndex = paths.indexOf(video.path + '.jpg');
                        video.snapshot = dmbdOSSImageUrlResizeFilter(urls[sIndex], 400);
                        break;
                    default :
                        break;
                }
            });
        };
    })();


    //转换播放时长
    function transformDuration(durationStr) {
        var arr = durationStr.split(':');
        var arr2 = arr.map(function (item) {
            return window.parseInt(item, 10);
        });
        return arr2[0] * 3600 + arr2[1] * 60 + arr2[2];
    }


    //为每个资源添加授权的URL及其它相关属性，此接口用于节目修改、复制中初始化已有资源相关属性
    var setResourceInfoToPages = (function () {
        return function (pages, paths, pathMaps, dmbdOSSImageUrlResizeFilter) {
            handleResourcesFromPages(pages, function (image) {
                switch (image.ver) {
                    case 1:
                        var info = pathMaps[image.path];
                        if (info) {
                            image.name = info.name;
                            image.size = info.size;
                            image.mime = info.mime;
                            image.width = info.width;
                            image.height = info.height;
                            image.createTime = info.createTime;
                            image.url = dmbdOSSImageUrlResizeFilter(info.url, 400);
                        }
                        break;
                    default :
                        break;
                }
            }, function (video) {
                switch (video.ver) {
                    case 1:
                        var info = pathMaps[video.path];
                        if (info) {
                            video.name = info.name;
                            video.duration = transformDuration(info.duration);
                            video.size = info.size;
                            video.bitrate = info.bitrate;
                            video.mime = info.mime;
                            video.ac = info.ac;
                            video.vc = info.vc;
                            video.width = info.width;
                            video.height = info.height;
                            video.createTime = info.createTime;
                            video.url = info.url;
                            video.snapshot = dmbdOSSImageUrlResizeFilter(info.snapshot, 400);
                        }
                        break;
                    default :
                        break;
                }
            });
        };
    })();

    //删除授权的URL属性以及海图等
    var deleteResourceUrlsFromPages = (function () {
        return function (pages) {
            handleResourcesFromPages(pages, function (image) {
                switch (image.ver) {
                    case 1:
                        delete image.name;
                        delete image.size;
                        delete image.mime;
                        delete image.width;
                        delete image.height;
                        delete image.createTime;
                        delete image.url;
                        break;
                    default :
                        break;
                }
            }, function (video) {
                switch (video.ver) {
                    case 1:
                        delete video.name;
                        delete video.duration;
                        delete video.size;
                        delete video.bitrate;
                        delete video.mime;
                        delete video.ac;
                        delete video.vc;
                        delete video.width;
                        delete video.height;
                        delete video.createTime;
                        delete video.url;
                        delete video.snapshot;
                        break;
                    default :
                        break;
                }
            });
        };
    })();


    app.service('programService', ['dmbdRest', 'dmbdOSSImageUrlResizeFilterFilter', '$q', function (dmbdRest, dmbdOSSImageUrlResizeFilter, $q) {

        this.getResourcePathsWithSnapshotFromPages = getResourcePathsWithSnapshotFromPages;
        this.setResourceUrlsToPages = setResourceUrlsToPages;
        this.deleteResourceUrlsFromPages = deleteResourceUrlsFromPages;
        this.handleResourcesFromPages = handleResourcesFromPages;
        this.getResourcePathsFromPages = getResourcePathsFromPages;
        this.setResourceInfoToPages = setResourceInfoToPages;
        this.getFirstSensitiveWord = getFirstSensitiveWord;
        this.testAnyElementIsEmpty = testAnyElementIsEmpty;

        //获取已有节目列表
        this.getProgramList = function (data, success) {
            //var apiUrl = 'mock/program_list2.json';
            //return dmbdRest.get(apiUrl, {
            //    pageSize: data.pageSize,
            //    pageIndex: data.pageIndex
            //}, function (content) {
            //    content.data.forEach(function (program) {
            //        setResourceUrlsToPages2(program.pages, dmbdOSSImageUrlResizeFilter);
            //    });
            //    success(content.data, content.recordsTotal);
            //});
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

                    var paths = getResourcePathsWithSnapshotFromPages(program.pages);//提炼出资源标识符

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
                    dmbdRest.post('../api/material/getMaterialCdnUrl', {
                        paths: angular.toJson(allPaths)
                    }, function (allUrls) {
                        programs.forEach(function (program) {
                            setResourceUrlsToPages(program.pages, allPaths, allUrls, dmbdOSSImageUrlResizeFilter);

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
            //var apiUrl = 'mock/program' + pid + '.json';
            //return dmbdRest.get(apiUrl, {
            //    id: pid
            //}, function (program) {
            //    setResourceUrlsToPages2(program.pages, dmbdOSSImageUrlResizeFilter);
            //    success(program);
            //});
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

                var paths = getResourcePathsFromPages(program.pages);//提炼出资源标识符
                //dmbdRest.post('../api/material/getMaterialCdnUrl', {
                //    paths: angular.toJson(paths)
                //}, function (urls) {
                //    setResourceUrlsToPages(program.pages, paths, urls, dmbdOSSImageUrlResizeFilter);
                //
                //    program.pixelHorizontal = 1080;
                //    program.pixelVertical = 1920;
                //
                //    success(program);
                //});

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
                        setResourceInfoToPages(program.pages, paths, pathMaps, dmbdOSSImageUrlResizeFilter);

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
            deleteResourceUrlsFromPages(data.pages);
            var paths = getResourcePathsFromPages(data.pages);//提炼出资源标识符
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
            deleteResourceUrlsFromPages(data.pages);
            var paths = getResourcePathsFromPages(data.pages);//提炼出资源标识符
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
