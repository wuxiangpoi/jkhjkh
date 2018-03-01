'use strict';

angular.module('sbAdminApp').
    controller('groupCtrl', function ($scope, $rootScope, baseService) {
        $scope.root_organizations = $rootScope.userData.root_organizations;
        function getOrganizations(){
            var zNodes = [];
            for(var i = 0;i < $scope.root_organizations.length;i ++){
                zNodes.push({
                    id: $scope.root_organizations[i].id,
                    pId: $scope.root_organizations[i].pid,
                    name: $scope.root_organizations[i].name,
                    sort: $scope.root_organizations[i].sort
                });
            }
            return zNodes;
        }
        $scope.ztreeSetting = {
            zNodes: getOrganizations(),
            isSet: true
        }
});