'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp', [])
    .controller('ledgramCtrl', function ($scope, $rootScope, baseService) {
        $scope.displayed = [];
        $scope.sp = {};
        $scope.tableState = {};
        $scope.ids = [];
        $scope.callServer = function (tableState) {
            baseService.initTable($scope, tableState, baseService.api.ledPage + 'getLedPageListPage');
        }

        $scope.save = function (item) {
            var onData = {};
            if (item) {
                onData.id = item.id;
                onData.name = item.name;
                onData.font = item.font.toString();
                onData.fontBold = item.fontBold.toString();
                onData.fontSize = item.fontSize.toString();
                onData.fontColor = item.fontColor.toString();
                // onData.bgColor = item.bgColor;
                onData.stay = item.stay;
                onData.speed = item.speed;
                onData.displayStyle = item.displayStyle.toString();
                onData.text = item.text;
            } else {
                onData = {
                    name: '',
                    font: '0',
                    fontBold: '3',
                    fontSize: '18',
                    fontColor: '1',
                    // bgColor: '',
                    stay: 0,
                    speed: 15,
                    displayStyle: '4',
                    text: ''
                }
            }
            baseService.confirmDialog(540, item ? '编辑' : '添加新节目', onData, 'tpl/led_savepogram.html', function (ngDialog, vm) {
                vm.isShowMessage = false;
                if (vm.modalForm.$valid) {

                    vm.isPosting = true;
                    baseService.postData(baseService.api.ledPage + 'saveLedPage', onData, function () {
                        ngDialog.close();
                        baseService.alert(item ? '修改成功' : '添加成功', 'success');
                        $scope.callServer($scope.tableState);
                    })
                } else {
                    vm.isShowMessage = true;
                }

            }, function (vm) {
                vm.font = [{
                        value: 0,
                        name: '宋体'
                    },
                    {
                        value: 1,
                        name: '黑体'
                    },
                    {
                        value: 2,
                        name: '隶书'
                    },
                    {
                        value: 3,
                        name: '楷体'
                    }
                ]
                vm.fontColor = [{
                        value: 1,
                        name: '红色'
                    },
                    {
                        value: 2,
                        name: '黄色'
                    },
                    {
                        value: 3,
                        name: '绿色'
                    },
                ]
                vm.displayStyle = [{
                        value: 0,
                        name: '随机显示'
                    },
                    {
                        value: 1,
                        name: '静止显示'
                    },
                    {
                        value: 2,
                        name: '快速打出'
                    },
                    {
                        value: 3,
                        name: '向左移动'
                    },
                    {
                        value: 4,
                        name: '向左连移'
                    },
                    {
                        value: 5,
                        name: '向上移动'
                    },
                    {
                        value: 6,
                        name: '向上连移'
                    },
                    {
                        value: 7,
                        name: '闪烁'
                    },
                    {
                        value: 8,
                        name: '飘雪'
                    },
                    {
                        value: 9,
                        name: '冒泡'
                    },
                    {
                        value: 10,
                        name: '中间移出'
                    },
                    {
                        value: 11,
                        name: '左右移入'
                    },
                    {
                        value: 12,
                        name: '左右交叉移入'
                    },
                    {
                        value: 13,
                        name: '上下交叉移入'
                    },
                    {
                        value: 14,
                        name: '画卷闭合'
                    },
                    {
                        value: 15,
                        name: '画卷打开'
                    },
                    {
                        value: 16,
                        name: '向左拉伸'
                    },
                    {
                        value: 17,
                        name: '向右拉伸'
                    },
                    {
                        value: 18,
                        name: '向上拉伸'
                    },
                    {
                        value: 19,
                        name: '向下拉伸'
                    },
                    {
                        value: 20,
                        name: '向左镭射'
                    },
                    {
                        value: 21,
                        name: '向右镭射'
                    },
                    {
                        value: 22,
                        name: '向上镭射'
                    },
                    {
                        value: 23,
                        name: '向下镭射'
                    },
                    {
                        value: 24,
                        name: '左右交叉拉幕'
                    },
                    {
                        value: 25,
                        name: '上下交叉拉幕'
                    },
                    {
                        value: 26,
                        name: '分散左拉'
                    },
                    {
                        value: 27,
                        name: '水平百页'
                    },
                    {
                        value: 28,
                        name: '垂直百页'
                    },
                    {
                        value: 29,
                        name: '向左拉幕'
                    },
                    {
                        value: 30,
                        name: '向右拉幕'
                    },
                    {
                        value: 31,
                        name: '向上拉幕'
                    },
                    {
                        value: 32,
                        name: '向下拉幕'
                    },
                    {
                        value: 33,
                        name: '左右闭合'
                    },
                    {
                        value: 34,
                        name: '左右对开'
                    },
                    {
                        value: 35,
                        name: '上下闭合'
                    },
                    {
                        value: 36,
                        name: '上下对开'
                    },
                    {
                        value: 37,
                        name: '向右移动'
                    },
                    {
                        value: 38,
                        name: '向右连移'
                    },
                    {
                        value: 39,
                        name: '向下移动'
                    },
                    {
                        value: 40,
                        name: '向下连移'
                    },
                    {
                        value: 41,
                        name: '45度左旋'
                    },
                    {
                        value: 42,
                        name: '180度左旋'
                    },
                    {
                        value: 43,
                        name: '90度左旋'
                    },
                    {
                        value: 44,
                        name: '45度右旋'
                    },
                    {
                        value: 45,
                        name: '180度右旋'
                    },
                    {
                        value: 46,
                        name: '90度右旋'
                    },
                    {
                        value: 47,
                        name: '菱形打开'
                    },
                    {
                        value: 48,
                        name: '菱形闭合'
                    }
                ]

                function getFontSize() {
                    var fs = [];
                    for (var i = 10; i < 37; i++) {
                        fs.push({
                            value: i,
                            name: i + 'px'
                        })
                    }
                    return fs;
                }
                vm.fontSize = getFontSize();
                vm.$watch('data.speed', function (val) {
                    var process = val / 0.3 + '%';
                    vm.data.speed = val;
                    $('#sliderWrap').find('.bar').css('backgroundSize', process + ' 100%')
                })
                vm.$watch('data.stay', function (val) {
                    var stayProcess = val / 0.1 + '%';
                    vm.data.stay = val;
                    $('#sliderWrap1').find('.bar').css('backgroundSize', stayProcess + ' 100%')
                })
            })
        }
        $scope.sendDown = function (item) {
            baseService.confirmDialog(720, '节目下发', item, "tpl/led_list_modal.html", function (ngDialog, vm) {
                var s = '';
                s = vm.ids.join(',');
                if (s.length) {
                    vm.isPosting = true;
                    baseService.postData(baseService.api.ledPage + 'sendProgramCommand', {
                        ledProgramId: item.id,
                        sns: s
                    }, function () {
                        ngDialog.close();
                        baseService.alert('下发成功', 'success')
                    })
                } else {
                    baseService.alert('请至少勾选一个节目再进行操作', 'warning', true);
                }
                
            }, function (vm) {
                vm.displayed = [];
                vm.sp = {};
                vm.sp.tid = item.id;
                vm.tableState = {};
                vm.ids = [];
                vm.callServer = function (tableState) {
                    baseService.initTable(vm, tableState, baseService.api.led + 'getLedPageList');
                }
                vm.checkAll = function ($event) {
                    baseService.checkAll($event, vm);
                }
                vm.checkThis = function (item, $event) {
                    baseService.checkThis(item, $event, vm);
                }
            })
        }

        $scope.del = function (item) {
            baseService.confirm('删除', '确定删除节目' + item.name + '?', function (ngDialog, vm) {
                vm.isPosting = true;
                baseService.postData(baseService.api.ledPage + 'deleteLedPage', {
                    id: item.id
                }, function (data) {
                    ngDialog.close();
                    baseService.alert("删除成功", 'success');
                    $scope.callServer($scope.tableState);
                });

            })
        }

    });
// JavaScript Document