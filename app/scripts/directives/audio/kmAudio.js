'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
    .directive('kmAudio',['$rootScope','baseService', function ($rootScope,baseService) {
        function link($scope, element, attrs) {
            $scope.$watch(attrs['audiodata'], function () {
                var option = $scope.$eval(attrs['audiodata']);
                if (angular.isObject(option)) {
                    $scope.url = option.path;
                    $scope.name = option.name;
                }
            }, true);
        }
        return {
            templateUrl: 'scripts/directives/audio/kmAudio.html' + baseService.verson,
            restrict: 'AE',
            replace: true,
            scope: {
                audiodata: '@'
            },
            link: link
        }
    }]);