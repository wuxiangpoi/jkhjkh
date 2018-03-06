'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
    .directive('dmbdUpload',['$rootScope','FileUploader','baseService', function ($rootScope,FileUploader,baseService) {
        function link($scope, element, attrs) {
            $scope.isShow = false;
            $scope.isHide = false;
            var uploader = $scope.uploader = new FileUploader(
                {url: 'http://dmbd4.oss-cn-hangzhou.aliyuncs.com'}
            );
            uploader.onBeforeUploadItem = function (item) {
                var imgfile_type = $rootScope.getRootDicNameStrs('image_format');
                var videofile_type = $rootScope.getRootDicNameStrs('video_format');
                var host = '';
                var accessid = '';
                var policyBase64 = '';
                var signature = '';
                var callbackbody = '';
                var filename = '';
                var key = '';
                //	var	 expire = 0;
                var token = '';
                baseService.postData(baseService.api.material + 'addMaterial_getOssSignature', {
                    type: videofile_type.split(',').indexOf(item.file.type.split('/')[1]) == -1 ? 0 : 1
                }, function (obj) {
                    host = obj['host']
                    policyBase64 = obj['policy']
                    accessid = obj['accessid']
                    signature = obj['signature']
                    //	expire =obj['expire']
                    callbackbody = obj['callback']
                    key = obj['key']
                    token = obj['token']
                });

                //	$scope.uploader.url=host;
                var filename = item.file.name;
                if (item.file['desc']) {
                    filename = item.file.desc;
                }
                var new_multipart_params = {
                    'key': (key + item.file.name.substr(item.file.name.indexOf('.'))),
                    'policy': policyBase64,
                    'OSSAccessKeyId': accessid,
                    'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                    'callback': callbackbody,
                    'signature': signature,
                    'x:fname': filename,
                    'x:type': videofile_type.split(',').indexOf(item.file.type.split('/')[1]) == -1 ? 0 : 1,
                    'x:gid': item.oid,
                    'x:opt': 0,
                    'x:token': token
                };
                item.formData = [new_multipart_params]; //上传前，添加描述文本
            }
            uploader.onCompleteItem = function (fileItem, response, status, headers) {

                if (response.code != 1) {
                    fileItem.isSuccess = false;
                    fileItem.isError = true;
                    fileItem.errorMsg = response.message;
                }

            };
            uploader.onCompleteAll = function () {
                $scope.isShow = false;
            };
            $scope.isShowDialog = function (isShow) {
                $scope.isShow = isShow;
            }
            $scope.isHideDialog = function () {
                $scope.isHide = !$scope.isHide;
            }
            $scope.$on("callUploader", function(event, data) {
                $scope.uploader.queue = $scope.uploader.queue.concat(data);
                $scope.isShow = true;
                $scope.uploader.uploadAll();               
            });
            $scope.removeItem = function(item,index,$event){
                item.cancel();
                $scope.uploader.queue.splice(index, 1);
                $($event.currentTarget).parents('tr').remove();
            }
        }
        return {
            templateUrl: 'scripts/directives/upload/upload.html' + baseService.verson,
            restrict: 'E',
            replace: true,
            link: link
        }
    }]);