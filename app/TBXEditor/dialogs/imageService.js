(function (app) {

    function transformImage(image, dmbdOSSImageUrlResizeFilter) {
        return {
            ver: 1,
            path: image.path,
            name: image.name,
            size: image.size,
            mime: image.mime,
            width: image.width,
            height: image.height,
            createTime: image.createTime,
            url: dmbdOSSImageUrlResizeFilter(image.url, 400)
        };
    }

    app.service('imageService', ['dmbdRest', 'dmbdOSSImageUrlResizeFilterFilter', '$q', function (dmbdRest, dmbdOSSImageUrlResizeFilter, $q) {

        //获取列表
        this.getImageList = function (data, success) {
            //var apiUrl = 'mock/image_list2.json';
            var apiUrl = '../api/material/getMaterialList4editor';
            return dmbdRest.get(apiUrl, {
                type: 0,
                search: data.search,
                start: data.pageSize * data.pageIndex,
                length: data.pageSize
            }, function (content) {
                var images = content.data.map(function (image) {
                    return transformImage(image, dmbdOSSImageUrlResizeFilter);//转换数据为需要的格式
                });
                success(images, content.recordsTotal);
            });
        };

    }]);

})(app);
