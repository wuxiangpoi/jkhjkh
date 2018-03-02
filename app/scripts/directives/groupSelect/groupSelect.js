'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('groupLeafSelect', function ($rootScope,baseService) {
        function link($scope, element, attrs) {
            $scope.root_organizations = $rootScope.userData.root_organizations;
            $scope.currentGroup = $rootScope.rootGroup;
            $scope.currentLeaf = {};
            $scope.currentLeaf.id = '';
            $scope.groupLeafes = [];
            $scope.treeId = 'group_tree_' + Date.parse(new Date());
            if (attrs.initid) {
                //baseService.initGroupTree($scope, 'group_tree_choose_modal', false, [],false, false,attrs.initid);				
            } else {
                //baseService.initGroupTree($scope, 'group_tree_choose_modal', false, [],false, false);
            }

            function getOrganizations() {
                var zNodes = [];
                for (var i = 0; i < $scope.root_organizations.length; i++) {
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
                isSort: false,
                isSet: false,
                isCheck: false,
                selectedNodes: []
            }
            $scope.$emit('emitGroupLeaf',$scope.currentGroup,$scope.currentLeaf);
            $scope.getLeafes = function (oid) {
                if (attrs.requrl) {
                    baseService.getJson(baseService.api.apiUrl + attrs.requrl, {
                        oid: oid
                    }, function (data) {
                        $scope.groupLeafes = data;
                    })
                }

            }
            
            $scope.showMenu = function ($event) {
                $event.stopPropagation();
                var selectList = $($event.currentTarget).children('.diy_select_list');
                if(selectList.css("display")=="none"){
                    selectList.show();
                    selectList.bind('click', function (e) {
                        e.stopPropagation();
                    })
                    $(document).bind('click', function () {
                        selectList.hide();
                    })
                }else{
                    selectList.hide();
                    $(document).unbind("click"); 
                }
            }

            $scope.$on('leafClick',function(e,data,event){
                $(event.currentTarget).parents('.diy_select_list').hide();
                if($scope.currentGroup.id != data.id){
                    $scope.currentGroup = data;
                    $scope.$emit('emitGroupLeaf',$scope.currentGroup);
                    $scope.$apply();
                }
            })

            $scope.showLeafMenu = function ($event) {
                $event.stopPropagation();
                $('.treeWrapLeaf').slideDown(50);
                $($event.currentTarget).parent().siblings('.treeWrap').slideUp(50);
                $('body').bind('click', function () {
                    $('.treeWrapLeaf').slideUp(50);
                })
            }
        }
        return {
            templateUrl: 'scripts/directives/groupSelect/groupLeafSelect.html' + baseService.verson,
            restrict: 'AE',
            replace: true,
            link: link

        }
    });