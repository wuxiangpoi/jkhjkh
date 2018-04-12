'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('groupLeafSelect', function ($rootScope, baseService) {
        function link($scope, element, attrs) {
            $scope.root_organizations = $rootScope.userData.root_organizations;
            $scope.currentGroup = $rootScope.rootGroup;
            $scope.currentLeaf = {};
            $scope.currentLeaf.id = '';
            $scope.groupLeafes = [];
            $scope.treeId = 'group_tree_' + Date.parse(new Date());
            $scope.showLeaf = false;
            $scope.showGroup = false;
            $scope.showLeafes = false;
            $scope.getLeafes = function (oid) {
                if (attrs.reqleafurl) {
                    $scope.showLeaf = true;
                    baseService.getJson(baseService.api.apiUrl + attrs.reqleafurl, {
                        oid: oid
                    }, function (data) {
                        $scope.groupLeafes = data;
                    })
                }

            }

            function getOrganizations() {
                var zNodes = [];

                if (attrs.initid) {
                    for (var i = 0; i < $scope.root_organizations.length; i++) {
                        zNodes.push({
                            id: $scope.root_organizations[i].id,
                            pId: $scope.root_organizations[i].pid,
                            name: $scope.root_organizations[i].name,
                            sort: $scope.root_organizations[i].sort
                        });
                        if ($scope.root_organizations[i].id == attrs.initid) {
                            $scope.currentGroup = $scope.root_organizations[i];
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.root_organizations.length; i++) {
                        zNodes.push({
                            id: $scope.root_organizations[i].id,
                            pId: $scope.root_organizations[i].pid,
                            name: $scope.root_organizations[i].name,
                            sort: $scope.root_organizations[i].sort
                        });
                    }
                }

                return zNodes;
            }
            $scope.getLeafes($scope.currentGroup.id);

            $scope.ztreeSetting = {
                zNodes: getOrganizations(),
                isSort: false,
                isSet: false,
                isCheck: false,
                selectedNodes: []
            }

            $scope.$emit('emitGroupLeaf', $scope.currentGroup, $scope.currentLeaf);


            $scope.showMenu = function ($event) {
                
                $event.stopPropagation();
                var selectList = $($event.currentTarget).children('.diy_select_list');
                $scope.showGroup = !$scope.showGroup;
                $scope.showLeafes = false;
                selectList.bind('click', function (e) {
                    e.stopPropagation();
                })
                if($scope.showGroup){
                    $(document).bind('click', function () {
                        $scope.showLeafes = false;
                        $scope.showGroup = false;
                        $scope.$apply();
                    })
                }
                
            }

            $scope.$on('leafClick', function (e, data, event) {
                $scope.showLeafes = false;
                $scope.showGroup = false;
                if ($scope.currentGroup.id != data.id) {
                    $scope.currentGroup = data;
                    $scope.currentLeaf = {};
                    $scope.currentLeaf.id = '';
                    $scope.$emit('emitGroupLeaf', $scope.currentGroup, $scope.currentLeaf);
                    $scope.getLeafes($scope.currentGroup.id);
                    $scope.$apply();
                }
            })
            $scope.leafClick = function ($event,item) {
                $event.stopPropagation();
                $scope.showLeafes = false;
                $scope.showGroup = false;
                if(item.id != $scope.currentLeaf.id){
                    $scope.currentLeaf = item;
                    $scope.$emit('emitGroupLeaf', $scope.currentGroup, $scope.currentLeaf);
                    // setTimeout(function(){  
                    //     $scope.$apply();//必需手动进行脏值检测,否则数据无法刷新到界面  
                    // },1); 
                }
            }
            $scope.showLeafMenu = function ($event) {
                $event.stopPropagation();
                $scope.showGroup = false;
                $scope.showLeafes = !$scope.showLeafes;
            }
        }
        return {
            templateUrl: 'scripts/directives/groupSelect/groupLeafSelect.html' + baseService.verson,
            restrict: 'AE',
            replace: true,
            link: link

        }
    });