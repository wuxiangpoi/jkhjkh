'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
  .directive('siderBar', ['$location', function (location) {
    return {
      templateUrl: 'scripts/directives/siderBar/template.html' + baseService.verson,
      restrict: 'E',
      replace: true,
      terminal: false,
      controller: function ($scope, $rootScope) {
        $scope.collapseVar = 0;
        $scope.path = location.path();
        $scope.location = location;
        function checkPath(path) {

          switch (path) {
            case '/main/domain':
              $scope.collapseVar = 2
              break;

            case '/main/dictionary':
              $scope.collapseVar = 2
              break;
            case '/main/admin':
              $scope.collapseVar = 2
              break;
            case '/main/versionfile':
              $scope.collapseVar = 2
              break;
            case '/main/terminalreport':
              $scope.collapseVar = 1
              break;
            case '/main/terminal/:id':
              $scope.collapseVar = 1
              break;
            case '/main/auser':
              $scope.collapseVar = 3
              break;
            case '/main/checkmodel':
              $scope.collapseVar = 4
              break;
            case '/main/terminalcommand':
              $scope.collapseVar = 4
              break;
            case '/main/role':
              $scope.collapseVar = 6
              break;
            case '/main/user':
              $scope.collapseVar = 6
              break;
          }
        }
        checkPath($scope.path);
        $scope.check = function (x) {
          var newPath = location.path();
          if (x == $scope.collapseVar)
            $scope.collapseVar = 0;
          else {
            $scope.collapseVar = x;
          }
        }
      }
    }
  }]);