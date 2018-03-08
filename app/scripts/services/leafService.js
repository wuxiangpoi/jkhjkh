var leafService = angular.module('leafService', []);
leafService.factory('leafService', ['baseService', function (baseService) {
    var leafService = {
        getLeafes: function (url, oid, cb) {
            baseService.getJson(url, {
                oid: oid
            }, function (data) {
                cb(data);
            })
        },
        addGroup: function (url, oid, cb) {
            baseService.confirmDialog(540, '添加分组', {}, 'tpl/group_add.html', function (ngDialog, vm) {
                if (vm.modalForm.$valid) {
                    vm.isPosting = true;
                    baseService.postData(url, {
                        oid: oid,
                        name: vm.name
                    }, function () {
                        ngDialog.close();
                        cb();
                    }, function (info) {
                        ngDialog.close();
                        baseService.alert(info, 'warning');
                    })
                } else {
                    vm.isShowMessage = true;
                }
            })
        },
        setGroup: function(url,ids,cb){
            baseService.confirmDialog(540, '设置所属机构', {}, 'tpl/set_organization.html', function (ngDialog, vm) {
                vm.isPosting = true;
                baseService.postData(url, {
                    oid: vm.oid,
                    ids: ids
                }, function () {
                    ngDialog.close();
                    cb();
                });
            }, function (vm) {
                vm.$on('emitGroupLeaf', function (e, group, leaf) {
                    vm.oid = group.id;
                });
            });
        },
        setLeaf: function (url,oid,rids,leafes,cb) {
            var modalData = {
                leafes: leafes,
                isSet: true
            };
            if(leafes.length){
                baseService.confirmDialog(450, '设置分组', modalData, 'tpl/set_leafes.html', function (ngDialog, vm) {
                    var gids = '';
                    var boxes = $("input[name='ckLeafes']");
                    boxes.each(function () {
                        if (this.checked) {
                            gids += "," + $(this).attr('value');
                        }
    
                    });
                    if (!gids) {
                        baseService.alert('请选择分组', 'warning', true);
                        return;
                    }
                    vm.isPosting = true;
                    baseService.postData(url, {
                        set: 1,
                        oid: oid,
                        gids: gids,
                        rids: rids
                    }, function () {
                        ngDialog.close();
                        cb();
                    })
                })
            }else{
                baseService.alert('请先添加分组','warning');
            }
            
        },
        cancelLeaf: function(url,rids,currentLeaf,cb){
            var modalData = {
                isSet: false,
                currentLeaf: currentLeaf
            };
            baseService.confirmDialog(450, '取消分组', modalData, 'tpl/set_leafes.html', function (ngDialog, vm) {
                var gids = '';
                var val = $("input[name='cancelLeafes']:checked").val();
                if (val == 1) {
                    gids = currentLeaf.id;
                }
                vm.isPosting = true;
                baseService.postData(url, {
                    set: 0,
                    gids: gids,
                    rids: rids
                }, function () {
                    ngDialog.close();
                    cb();
                })
            })
        },
        delLeaf: function (url, item, cb) {
            baseService.confirm('删除分组', '确定删除分组：' + item.name + '?', function (ngDialog) {
                baseService.postData(url, {
                    id: item.id
                }, function () {
                    ngDialog.close();
                    cb();
                }, function (info) {
                    ngDialog.close();
                    baseService.confirmAlert('提示', info, 'warning');
                }, true)

            })
        },
        editLeaf: function (url, editData, cb, fcb) {
            baseService.postData(url, editData, function () {
                cb();
            }, function (info) {
                baseService.alert(info, 'warning', true, fcb);
            })
        }
    };
    return leafService;
}]);