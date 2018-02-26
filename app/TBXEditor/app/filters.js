//过滤器
(function (app) {
    
    //OSS图片裁减
    app.filter('dmbdOSSImageUrlResizeFilter', function () {
        return function (imgUrl, size) {
            var joinChar = imgUrl.indexOf('?') >= 0 ? '&' : '?';
            return imgUrl + joinChar + 'x-oss-process=image/resize,m_lfit,h_' + size + ',w_' + size;
        };
    });

    //尺寸过滤器(文件体积，显示GB、MB、KB等)
    app.filter('dmbdResourceSizeFilter', function () {
        return function (size) {
            if (size < 1024) {
                return size + ' B';
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(2) + ' KB';
            } else if (size < 1024 * 1024 * 1024) {
                return (size / 1024 / 1024).toFixed(2) + ' MB';
            } else if (size < 1024 * 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
            } else {
                return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
            }
        };
    });

    function pading2(num) {
        return num < 10 ? '0' + num : num.toString(10);
    }

    //视频播放时长格式化过滤器
    app.filter('dmbdVideoTimeFormatFilter', function () {
        return function (seconds) {
            return pading2(Math.floor(seconds / 3600))
                + ':' + pading2(Math.floor((seconds % 3600) / 60))
                + ':' + pading2(seconds % 60);
        };
    });

})(app);
