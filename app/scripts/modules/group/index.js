'use strict';

angular.module('sbAdminApp').
    controller('groupCtrl', function ($scope, $rootScope, baseService) {
        $scope.root_organizations = $rootScope.userData.root_organizations;
        console.log($scope.root_organizations)
        $scope.ztreeSetting = {
            
        }
});