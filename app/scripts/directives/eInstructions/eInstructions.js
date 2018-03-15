'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('eInstructions', function ($rootScope, baseService) {
        function link($scope, element, attrs) {
            attrs.$observe('instructions', function () { //通过$observe监听attrs中绑定的option属性，可以通过ajax请求数据，动态更新图表。
                var option = attrs.instructions;

            }, true);
        }
        return {
            templateUrl: 'scripts/directives/eInstructions/template.html' + baseService.verson,
            restrict: 'AE',
            replace: true,
            link: link

        }
    });