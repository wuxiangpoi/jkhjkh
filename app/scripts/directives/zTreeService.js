angular.module('sbAdminApp')
    .directive('zTree', function ($http, $window) {
        function link($scope, element, attrs) {
            attrs.$observe('value', function () { //通过$observe监听attrs中绑定的option属性，可以通过ajax请求数据，动态更新图表。
                var zNodes = $scope.$eval(attrs.value);
                if (angular.isObject(zNodes)) {
                    var setting = {
                        view: {
                            showIcon: false
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        check: {
                            enable: zNodes.isCheck,
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
                    if(zNodes.selectedNodes && zNodes.selectedNodes.length > 0 && zNodes.isCheck){
                        for(var i = 0;i < zNodes.zNodes.length;i ++){
                           if(zNodes.selectedNodes.indexOf(zNodes.zNodes[i].id) != -1){
                            zNodes.zNodes[i].checked = true;
                           }
                        } 
                    }
                    $.fn.zTree.init(element, setting, zNodes.zNodes);
                    var zTree = $.fn.zTree.getZTreeObj($(element).eq(0).attr('id'));
                    $scope.$on('getZtreeData',function(e,data){
                        var emitData = [];
                        switch(data){
                            case 'getChecked':
                            emitData = zTree.getCheckedNodes(true);
                            break;
                        }
                        $scope.$emit('emitZtreeData',emitData);
                    });
                }
            }, true);

        }
        return {
            restrict: 'AE',
            link: link
        };
    });