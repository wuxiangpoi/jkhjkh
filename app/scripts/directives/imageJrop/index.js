angular.module('sbAdminApp')
    .directive('imageJrop', ['baseService', 'FileUploader', function(baseService, FileUploader) {
        function link($scope, element, attrs) {
            $scope.uploader = new FileUploader();
            $scope.imgSrc = '';
            $scope.isJcrop = false;
            $scope.upload = false;
            //图片转换base64数据
            function base64data(file, clackFn) {
                if (file) {
                    var reader = new FileReader();
                    var params = $scope.$eval(file);
                    reader.onload = function (evt) {
                        clackFn(evt.target.result);
                    }
                    reader.readAsDataURL(file._file);
                } else { //兼容IE
                    modalService.alert('请切到高级浏览器,再进行图片上传', 'warning');
                }
            }

            function initCrop() {
                $('#jcropImg').cropper({
                    aspectRatio: 4 / 1,
                    viewMode: 2,
                    dragMode: 'move',
                    preview: '.imgPreview',
                    movable: true
                });
                $scope.isJcrop = true;
            }
            $scope.uploader.filters.push({
                name: 'customFilter',
                fn: function (item /*{File|FileLikeObject}*/ , options) {
                    var ctype = item.name.substr(item.name.lastIndexOf('.') + 1);
                    var type = ',' + ctype + ',';
                    var file_type = 'jpg,png,jpeg,bmp';
                    if ((',' + file_type + ',').indexOf(type) != -1) {
                        if (item.size > 5 * 1024 * 1024) {
                            modalService.alert('不得上传大于5Mb的图片', 'warning');
                        } else {
                            return true;
                        }
                    } else {
                        modalService.alert('上传的文件格式平台暂时不支持' + ctype + '，目前支持的格式是:' + file_type, 'warning');

                        return false;

                    }

                }
            });
            $scope.uploader.onAfterAddingFile = function (fileItem) {
                if ($scope.upload) {
                    baseService.postData(baseService.api.material + 'addMaterial_getOssSignature', {
                        type: 0
                    }, function (obj) {
                        var new_multipart_params = {
                            'key': (obj['key'] + item.file.name),
                            'policy': obj['policy'],
                            'OSSAccessKeyId': obj['accessid'],
                            'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                            'callback': obj['callback'],
                            'signature': obj['signature'],
                            'x:fname': filename,
                            'x:type': 0,
                            'x:gid': '',
                            'x:opt': 0,
                            'x:token': obj['token']
                        };
                        item.formData = [new_multipart_params]; //上传前，添加描述文本
                        //item.upload();
                    });
                } else {
                    base64data(fileItem, function (src) {
                        $scope.isJcrop = true;
                        $scope.imgSrc = src;
                        $scope.uploader.queue = [];
                        $scope.$apply();
                        if ($scope.isJcrop) {
                            $('#jcropImg').cropper('destroy');
                            initCrop();
                        } else {
                            initCrop();
                        }
                    })
                }

            };
            $scope.$on('uploadImg', function(e, data) {
                var cas = $('#jcropImg').cropper('getCroppedCanvas');
                var base64url = cas.toDataURL('image/jpeg');
                cas.toBlob(function (blob) {
                    $scope.upload = true;
                    $scope.uploader.addToQueue(blob);
                })
            });
        }
        return {
            templateUrl: 'scripts/directives/imageJrop/template.html' + baseService.verson,
            restrict: 'AE',
            replace: true,
            link: link
        }
    }])