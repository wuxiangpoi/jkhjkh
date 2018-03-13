'use strict';

angular.module('sbAdminApp').
controller('groupCtrl', function ($scope, $rootScope, baseService) {
    $scope.root_organizations = $rootScope.userData.root_organizations;
    $scope.isSort = false;

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
        isSet: true,
        isCheck: false,
        selectedNodes: []
    }
    $scope.sort = function () {
        $scope.isSort = true;
        $scope.ztreeSetting = {
            zNodes: getOrganizations(),
            isSort: true,
            isSet: false,
            isCheck: false,
            selectedNodes: []
        }
    }
    $scope.cancelSort = function () {
        $scope.isSort = false;
        $scope.ztreeSetting = {
            zNodes: getOrganizations(),
            isSort: false,
            isSet: true,
            isCheck: false,
            selectedNodes: []
        }
    }
    $scope.sumbitSort = function () {
        var zTree = $.fn.zTree.getZTreeObj('groupSet');
        baseService.postData(baseService.api.organization + 'saveOrganizationSort', {
            sorts: JSON.stringify(zTree.getNodes()[0].children)
        }, function (res) {
            $scope.root_organizations = $rootScope.userData.root_organizations = res;
            $scope.isSort = false;
            $scope.ztreeSetting = {
                zNodes: getOrganizations(),
                isSort: false,
                isSet: true,
                isCheck: false,
                selectedNodes: []
            }
        })
    }
    $scope.$on('addNode', function (e, zTree, treeNode) {
        baseService.confirmDialog(540, '新建组织机构', {}, 'tpl/group_save.html', function (ngDialog, vm) {
            if (vm.modalForm.$valid) {
                vm.isPosting = true;
                baseService.postData(baseService.api.organization + 'saveOrganization', {
                    name: vm.name,
                    pid: treeNode.id
                }, function (res) {
                    ngDialog.close();
                    $scope.root_organizations = $rootScope.userData.root_organizations = res;
                    var newId = '';
                    for (var i = 0; i < $scope.root_organizations.length; i++) {
                        if ($scope.root_organizations[i].name == vm.name) {
                            newId = $scope.root_organizations[i].id
                        }
                    }
                    zTree.addNodes(treeNode, {
                        pid: treeNode.id,
                        name: vm.name,
                        id: newId
                    });
                }, vm)
            } else {
                vm.isShowMessage = true;
            }
        })
    });
    $scope.$on('editNode', function (e, zTree, treeNode) {
        var oVal = '';
        for (var i = 0; i < $scope.root_organizations.length; i++) {
            if (treeNode.id == $scope.root_organizations[i].id) {
                oVal = $scope.root_organizations[i].name;
            }
        }
        if (treeNode.name == '') {
            treeNode.name = oVal;
            baseService.alert('组名不能为空，请重新输入！', 'warning', true, function () {
                zTree.editName(treeNode);
            })
        } else {
            if (treeNode.name == oVal) {
                return;
            }
            baseService.postData(baseService.api.organization + 'saveOrganization', {
                id: treeNode.id,
                name: treeNode.name
            }, function (res) {
                $scope.root_organizations = $rootScope.userData.root_organizations = res;
            }, function (msg) {
                treeNode.name = oVal;
                zTree.editName(treeNode);
                baseService.alert(msg, 'warning', true);
            })
        }
    });
    $scope.$on('delNode', function (e, zTree, treeNode) {
        baseService.confirm('删除', '确定删除该组织机构' + treeNode.name + ' ?', function (ngDialog) {
            ngDialog.close();
            if (treeNode.isParent) {
                baseService.confirmAlert('删除组织机构', '该机构包含子机构，请先删除子机构再进行删除！', 'warning');
            } else {
                baseService.postData(baseService.api.organization + 'deleteOrganization', {
                    id: treeNode.id
                }, function (res) {
                    $scope.root_organizations = $rootScope.userData.root_organizations = res;
                    zTree.removeNode(treeNode);
                    baseService.alert('删除成功', 'success', true);
                }, function (msg) {
                    baseService.confirmAlert('删除组织机构', msg, 'warning');
                })
            }
        })

    });
});