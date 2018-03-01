angular.module('sbAdminApp')
    .directive('zTree', function ($http, $window) {
        function link($scope, element, attrs) {
            attrs.$observe('ztreesetting', function () { //通过$observe监听attrs中绑定的option属性，可以通过ajax请求数据，动态更新图表。
                var ztreeSetting = $scope.$eval(attrs.ztreesetting);
                if (angular.isObject(ztreeSetting)) {
                    var setting = {
                        view: {
                            showIcon: false,
                            addHoverDom: ztreeSetting.isSet ? addHoverDom : false, //当鼠标移动到节点上时，显示用户自定义控件  
                            removeHoverDom: ztreeSetting.isSet ? removeHoverDom : false, //离开节点时的操作 
                            addDiyDom: addDiyDom
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        check: {
                            enable: ztreeSetting.isCheck,
                            chkboxType: {
                                "Y": "ps",
                                "N": "ps"
                            }
                        },
                        callback: {
                            onClick: function (event, treeId, treeNode, clickFlag) {
                                $(event.target).parent().prev('.chk').click();
                            }
                        }

                    };

                    function addDiyDom(treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj($(element).eq(0).attr('id'));
                        if (ztreeSetting.isSort) {
                            var parent = treeNode.getParentNode();
                            var sObj = $("#" + treeNode.tId + "_span"); //获取节点信息  
                            var addStr = '';
                            var index = $.fn.zTree.getZTreeObj($(element).eq(0).attr('id')).getNodeIndex(treeNode);
                            var len = '';
                            if (parent) {
                                if (parent.children != null) {
                                    len = parent.children.length;
                                    if (len > 1) {
                                        addStr += "<span class='iconfont icon-paixu-shang ztreeBtn' id='upBtn_" + treeNode.tId + "' onfocus='this.blur();'></span>"; //定义添加按钮               
                                        addStr += "<span class='iconfont icon-paixu-xiajiang ztreeBtn' id='downBtn_" + treeNode.tId + "' onfocus='this.blur();'></span>"; //定义添加按钮  
                                    }
                                }
                            }
                            sObj.after(addStr); //加载添加按钮 
                            checkPosition(sObj, treeNode.tId, index);

                            function checkPosition(obj, tid, index) {
                                if (index == 0) {
                                    obj.siblings('#downBtn_' + tid).show();
                                    obj.siblings('#upBtn_' + tid).hide();
                                } else if (index == len - 1) {
                                    obj.siblings('#upBtn_' + tid).show();
                                    obj.siblings('#downBtn_' + tid).hide();
                                } else {
                                    obj.siblings('#upBtn_' + tid).show();
                                    obj.siblings('#downBtn_' + tid).show();
                                }
                            }

                            var upBtn = $("#upBtn_" + treeNode.tId);
                            var downBtn = $("#downBtn_" + treeNode.tId);
                            if (upBtn) upBtn.bind("click", function (e) {
                                $scope.change = true;
                                var zTree = $.fn.zTree.getZTreeObj($(element).eq(0).attr('id'));
                                var prevNode = treeNode.getPreNode();
                                var oIndex = zTree.getNodeIndex(treeNode);
                                zTree.moveNode(prevNode, treeNode, "prev");
                                var nIndex = zTree.getNodeIndex(treeNode);
                                treeNode.sort = nIndex;
                                prevNode.sort = nIndex + 1;
                                checkPosition(sObj, treeNode.tId, nIndex, function () {
                                    treeNode.sort = nIndex;
                                });
                                checkPosition($("#" + prevNode.tId + "_span"), prevNode.tId, oIndex, function () {
                                    prevNode.sort = oIndex;
                                });
                            });
                            if (downBtn) downBtn.bind("click", function (e) {
                                $scope.change = true;
                                var zTree = $.fn.zTree.getZTreeObj(initObj);
                                var nextNode = treeNode.getNextNode();
                                var oIndex = zTree.getNodeIndex(treeNode);
                                zTree.moveNode(treeNode, nextNode, "prev");
                                var nIndex = zTree.getNodeIndex(treeNode);
                                treeNode.sort = nIndex;
                                nextNode.sort = nIndex - 1;
                                checkPosition(sObj, treeNode.tId, nIndex);
                                checkPosition($("#" + nextNode.tId + "_span"), nextNode.tId, oIndex);
                            });
                        } else {
                            if (treeNode.id == 0 && ztreeSetting.isSet) {
                                var sObj = $("#" + treeNode.tId + "_span"); //获取节点信息                          
                                var addStr = '';
                                addStr += "<span id='addBtn_level0' style='margin-left: 80px;color:#000;font-size:12px;' title='add node' onfocus='this.blur();'><i class='iconfont icon-tianjia-' style='vertical-align:-1px;'></i>(点击添加组织机构)</span>"; //定义添加按钮  
                                sObj.after(addStr); //加载添加按钮 
                                var addBtn = $("#addBtn_level0");
                                if (addBtn) addBtn.bind("click", function () {
                                    var zTree = $.fn.zTree.getZTreeObj(initObj);
                                    //将新节点添加到数据库中  
                                    $scope.addNode(function (data) {
                                        $scope.baseService.postData(apiUrl + '/api/organization/saveOrganization', {
                                            name: data.name,
                                            pid: treeNode.id
                                        }, function (res) {
                                            $rootScope.root_organizations = $scope.groups = res;
                                            zTree.addNodes(treeNode, {
                                                pid: treeNode.id,
                                                name: data.name
                                            });
                                        })

                                    })


                                });
                            }
                        }

                    }

                    function addHoverDom(treeId, treeNode) {
                        if (treeNode.id == 0) {
                            return;
                        }
                        var sObj = $("#" + treeNode.tId + "_span"); //获取节点信息  
                        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;

                        var addStr = "<span class='iconfont icon-tianjia- ztreeBtn' id='addBtn_" + treeNode.tId + "' title='add node' onfocus='this.blur();'></span>"; //定义添加按钮  
                        addStr += "<span class='iconfont icon-bianji ztreeBtn' id='editBtn_" + treeNode.tId + "' title='add node' onfocus='this.blur();'></span>"; //定义添加按钮  
                        addStr += "<span class='iconfont icon-shanchu ztreeBtn' id='delBtn_" + treeNode.tId + "' title='add node' onfocus='this.blur();'></span>"; //定义添加按钮  
                        sObj.after(addStr); //加载添加按钮  
                        var addBtn = $("#addBtn_" + treeNode.tId);
                        var editBtn = $("#editBtn_" + treeNode.tId);
                        var delBtn = $("#delBtn_" + treeNode.tId);

                        //绑定添加事件，并定义添加操作  
                        if (addBtn) addBtn.bind("click", function () {
                            var zTree = $.fn.zTree.getZTreeObj(initObj);
                            //将新节点添加到数据库中  
                            $scope.addNode(function (data) {
                                $scope.baseService.postData(apiUrl + '/api/organization/saveOrganization', {
                                    name: data.name,
                                    pid: treeNode.id
                                }, function (res) {
                                    $rootScope.root_organizations = $scope.groups = res;
                                    var newId = '';
                                    for (var i = 0; i < $rootScope.root_organizations.length; i++) {
                                        if ($rootScope.root_organizations[i].name == data.name) {
                                            newId = $rootScope.root_organizations[i].id
                                        }
                                    }
                                    zTree.addNodes(treeNode, {
                                        pid: treeNode.id,
                                        name: data.name,
                                        id: newId
                                    });
                                })

                            })
                        });
                        if (editBtn) editBtn.bind("click", function () {
                            var zTree = $.fn.zTree.getZTreeObj(initObj);
                            var oVal = treeNode.name;
                            zTree.editName(treeNode);
                        });
                        if (delBtn) delBtn.bind("click", function () {
                            var zTree = $.fn.zTree.getZTreeObj(initObj);
                            $scope.beforeRemove(treeNode, function () {
                                if (treeNode.isParent) {
                                    $scope.baseService.confirmAlert('删除组织机构', '该机构包含子机构，请先删除子机构再进行删除！', 'warning');
                                } else {
                                    $scope.baseService.postData(apiUrl + '/api/organization/deleteOrganization', {
                                        id: treeNode.id
                                    }, function (res) {
                                        $rootScope.root_organizations = $scope.groups = res;
                                        zTree.removeNode(treeNode);
                                    }, function () {}, function (msg) {
                                        $scope.baseService.confirmAlert('删除组织机构', msg, 'warning');
                                    })
                                }
                            })
                        });
                    };

                    function removeHoverDom(treeId, treeNode) {
                        $("#addBtn_" + treeNode.tId).unbind().remove();
                        $("#editBtn_" + treeNode.tId).unbind().remove();
                        $("#delBtn_" + treeNode.tId).unbind().remove();
                    };
                    if (ztreeSetting.selectedNodes && ztreeSetting.selectedNodes.length > 0 && ztreeSetting.isCheck) {
                        for (var i = 0; i < ztreeSetting.zNodes.length; i++) {
                            if (ztreeSetting.selectedNodes.indexOf(ztreeSetting.zNodes[i].id) != -1) {
                                ztreeSetting.zNodes[i].checked = true;
                            }
                        }
                    }
                    $.fn.zTree.init(element, setting, ztreeSetting.zNodes);
                    var zTree = $.fn.zTree.getZTreeObj($(element).eq(0).attr('id'));
                    zTree.expandAll(true);
                    $scope.$on('getZtreeData', function (e, data) {
                        var emitData = [];
                        switch (data) {
                            case 'getChecked':
                                emitData = zTree.getCheckedNodes(true);
                                break;
                        }
                        $scope.$emit('emitZtreeData', emitData);
                    });
                }
            }, true);

        }
        return {
            restrict: 'AE',
            link: link
        };
    });