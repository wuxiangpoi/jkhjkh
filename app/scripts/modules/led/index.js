'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
    .controller('ledCtrl', function ($scope, $rootScope, baseService) {
        $scope.displayed = [];
        $scope.sp = {};
        $scope.tableState = {};
        $scope.ids = [];
        $scope.callServer = function (tableState) {
            baseService.initTable($scope, tableState, baseService.api.led + 'getLedPageList');
        }

        $scope.save = function (item) {
            var onData = {};
            if (!item) {
                onData = {
                    sn: '',
                    name: '',
                    model: 'BX-5M1',
                    width: '',
                    height: '',
                    // text: '',
                    addr: '',
                    screenColor: '0',
                    p: '',
                    city_no: '',
                    cityName: '',
                    district: '',
                    adcode: ''
                }
            } else {
                onData.id = item.id;
                onData.sn = item.sn;
                onData.name = item.name;
                onData.model = item.model;
                onData.width = item.width;
                onData.height = item.height;
                // onData.text = item.text;
                onData.addr = item.addr;
                onData.screenColor = item.screenColor == 1 ? '1' : '0';
                // onData.p = item.p.x + ', ' + item.p.y;
                // onData.city_no = item.city_no;
                // onData.cityName = item.cityName?item.cityName:'';
                // onData.district = item.district?item.district:'';
                // onData.adcode = item.adcode?item.adcode:'';
            }
            baseService.confirmDialog(540, item ? '编辑终端' : '添加终端', onData, 'tpl/led_saveDevice.html', function (ngDialog, vm) {
                vm.isShowMessage = false;
                if (vm.modalForm.$valid) {

                    vm.isPosting = true;
                    baseService.postData(baseService.api.led + 'saveLed', onData, function () {
                        ngDialog.close();
                        baseService.alert(item ? '修改成功' : '添加成功', 'success');
                        $scope.callServer($scope.tableState);
                    })
                } else {
                    vm.isShowMessage = true;
                }

            }, function (vm) {

            })
        }
        $scope.playManage = function (item) {
            baseService.getJson(baseService.api.led + 'getPlayLedPage', {
                sn: item.sn
            }, function (data) {

                if (data[0]) {
                    var showData = data[0];
                    switch (data[0].font) {
                        case 0:
                            showData.font = '宋体'
                            break;
                        case 1:
                            showData.font = '黑体'
                            break;
                        case 2:
                            showData.font = '隶书'
                            break;
                        case 3:
                            showData.font = '楷体'
                            break;
                    }
                    switch (data[0].fontColor) {
                        case 1:
                            showData.fontColor = '红色'
                            break;
                        case 2:
                            showData.fontColor = '黄色'
                            break;
                        case 3:
                            showData.fontColor = '绿色'
                            break;
                    }
                    switch (data[0].displayStyle) {
                        case 0:
                            showData.displayStyle = '随机显示'
                            break;
                        case 1:
                            showData.displayStyle = '静止显示'
                            break;
                        case 2:
                            showData.displayStyle = '快速打出'
                            break;
                        case 3:
                            showData.displayStyle = '向左移动'
                            break;
                        case 4:
                            showData.displayStyle = '向左连移'
                            break;
                        case 5:
                            showData.displayStyle = '向上移动'
                            break;
                        case 6:
                            showData.displayStyle = '向上连移'
                            break;
                        case 7:
                            showData.displayStyle = '闪烁'
                            break;
                        case 8:
                            showData.displayStyle = '飘雪'
                            break;
                        case 9:
                            showData.displayStyle = '冒泡'
                            break;
                        case 10:
                            showData.displayStyle = '中间移出'
                            break;
                        case 11:
                            showData.displayStyle = '左右移入'
                            break;
                        case 12:
                            showData.displayStyle = '左右交叉移入'
                            break;
                        case 13:
                            showData.displayStyle = '上下交叉移入'
                            break;
                        case 14:
                            showData.displayStyle = '画卷闭合'
                            break;
                        case 15:
                            showData.displayStyle = '画卷打开'
                            break;
                        case 16:
                            showData.displayStyle = '向左拉伸'
                            break;
                        case 17:
                            showData.displayStyle = '向右拉伸'
                            break;
                        case 18:
                            showData.displayStyle = '向上拉伸'
                            break;
                        case 19:
                            showData.displayStyle = '向下拉伸'
                            break;
                        case 20:
                            showData.displayStyle = '向左镭射'
                            break;
                        case 21:
                            showData.displayStyle = '向右镭射'
                            break;
                        case 22:
                            showData.displayStyle = '向上镭射'
                            break;
                        case 23:
                            showData.displayStyle = '向下镭射'
                            break;
                        case 24:
                            showData.displayStyle = '左右交叉拉幕'
                            break;
                        case 25:
                            showData.displayStyle = '上下交叉拉幕'
                            break;
                        case 26:
                            showData.displayStyle = '分散左拉'
                            break;
                        case 27:
                            showData.displayStyle = '水平百页'
                            break;
                        case 28:
                            showData.displayStyle = '垂直百页'
                            break;
                        case 29:
                            showData.displayStyle = '向左拉幕'
                            break;
                        case 30:
                            showData.displayStyle = '向右拉幕'
                            break;
                        case 31:
                            showData.displayStyle = '向上拉幕'
                            break;
                        case 32:
                            showData.displayStyle = '向下拉幕'
                            break;
                        case 33:
                            showData.displayStyle = '左右闭合'
                            break;
                        case 34:
                            showData.displayStyle = '左右对开'
                            break;
                        case 35:
                            showData.displayStyle = '上下闭合'
                            break;
                        case 36:
                            showData.displayStyle = '上下对开'
                            break;
                        case 37:
                            showData.displayStyle = '向右移动'
                            break;
                        case 38:
                            showData.displayStyle = '向右连移'
                            break;
                        case 39:
                            showData.displayStyle = '向下移动'
                            break;
                        case 40:
                            showData.displayStyle = '向下连移'
                            break;
                        case 41:
                            showData.displayStyle = '45度左旋'
                            break;
                        case 42:
                            showData.displayStyle = '180度左旋'
                            break;
                        case 43:
                            showData.displayStyle = '90度左旋'
                            break;
                        case 44:
                            showData.displayStyle = '45度右旋'
                            break;
                        case 45:
                            showData.displayStyle = '180度右旋'
                            break;
                        case 46:
                            showData.displayStyle = '90度右旋'
                            break;
                        case 47:
                            showData.displayStyle = '菱形打开'
                            break;
                        case 48:
                            showData.displayStyle = '菱形闭合'
                            break;
                    }
                    baseService.confirmDialog(450, '节目管理', showData, 'tpl/led_program.html', function (ngDialog, vm) {})
                } else {
                    baseService.alert('暂无节目播放', 'info')
                }

            })

        }
        $scope.sendCommand = function (type) {
            var tids = $scope.ids.join(',');
            var commandata = {
                sns: tids,
                cmdCode: type,
                cmdParams: ''
            }

            function commandName(type) {
                switch (type) {
                    case 1:
                        return '开机'
                        break;
                    case 2:
                        return '关机'
                        break;
                    case 3:
                        return '校时'
                        break;
                    case 4:
                        return '格式化'
                        break;
                }
            }
            switch (type) {
                case 1:
                case 2:
                case 3:
                case 4:
                    baseService.confirm('终端操作', "确定对当前选中的设备执行命令：" + commandName(type) + "?", function (ngDialog, vm) {
                        vm.isPosting = true;
                        baseService.postData(baseService.api.led + 'sendCommand', commandata, function () {
                            ngDialog.close();
                            baseService.alert('操作成功', 'success')
                        })
                    })
                    break;
                case 5:
                    baseService.confirmDialog(450, '亮度设置', commandata, "tpl/light_setting.html", function (ngDialog,vm) {
                        vm.isShowMessage = false;
                        if (vm.modalForm.$valid) {

                            vm.isPosting = true;
                            baseService.postData(baseService.api.led + 'sendCommand', commandata, function () {
                                ngDialog.close()
                                baseService.alert('设置成功', 'success')
                            })
                        } else {
                            vm.isShowMessage = true;
                        }

                    })
            }
        }
        $scope.del = function (item) {
            baseService.confirm('删除', '确定删除终端' + item.name + '?', function (ngDialog, vm) {
                vm.isPosting = true;
                baseService.postData(baseService.api.led + 'deleteLed', {
                    id: item.id
                }, function (data) {
                    ngDialog.close();
                    baseService.alert("删除成功", 'success');
                    $scope.callServer($scope.tableState);
                });

            })
        }
        $scope.checkAll = function ($event) {
            baseService.checkAll($event, $scope);
        }
        $scope.checkThis = function (item, $event) {
            baseService.checkThis(item, $event, $scope);
        }

        $scope.showTip = function ($event) {
            if ($($event.currentTarget).children('.btn').hasClass('disabled')) {
                $($event.currentTarget).children('.tipDiv').show();
            }
        }
        $scope.hideTip = function ($event) {
            $($event.currentTarget).children('.tipDiv').hide();
        }
    });
// JavaScript Document