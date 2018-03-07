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
                {
                    url: 'http://dmbd4.oss-cn-hangzhou.aliyuncs.com',
                }
            );
            
            
            $scope.isShowDialog = function (isShow) {
                $scope.isShow = isShow;
            }
            $scope.isHideDialog = function () {
                $scope.isHide = !$scope.isHide;
            }
            $scope.$on("callUploader", function(event, data) {
                $scope.uploader.queue = $scope.uploader.queue.concat(data.queue);
                $scope.isShow = true;
                $scope.uploadAll();               
            });
            $scope.removeItem = function(item,index,$event){
                item.cancel();
                $scope.uploader.queue.splice(index, 1);
                $($event.currentTarget).parents('tr').remove();
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
                $.apply();
            };
            $scope.upload = function (item) {
                item.upload();
            };
            $scope.uploadAll = function () {
                uploader.uploadAll();
            };
        }
        return {
            templateUrl: 'scripts/directives/upload/upload.html' + baseService.verson,
            restrict: 'E',
            replace: true,
            link: link
        }
    }]);