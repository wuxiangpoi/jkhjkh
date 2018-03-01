var baseService = angular.module('baseService', []);
baseService.factory('baseService', ['$rootScope', '$http', '$location', 'ngDialog','programService', function ($rootScope, $http, $location, ngDialog,programService) {
    var apiUrl = 'http://47.92.116.16:9090';
    var verson = '?_v1.5';
    var baseService = {
        verson: verson,
        api: {
            apiUrl: apiUrl,
            auth: apiUrl + '/api/auth/',
            group: apiUrl + '/api/group/',
            led: apiUrl + '/api/led/',
            ledPage: apiUrl + '/api/ledPage/',
            material: apiUrl + '/api/material/',
            program: apiUrl + '/api/program/',
            terminal: apiUrl + '/api/terminal/',
            program: apiUrl + '/api/program/',
            programCmd: apiUrl + '/api/programCmd/',
            terminalCmd: apiUrl + '/api/terminalCmd/',
            role: apiUrl + '/api/role/',
            user: apiUrl + '/api/user/',
            organization: apiUrl + '/api/organization/',
            terminalReport: apiUrl + '/api/terminalReport/',
            installUser: apiUrl + '/api/installUser/',
            schedule: apiUrl + '/client/schedule/'
        },
        md5_pwd: function (pwd) {
            var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7',
                '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
            ];
            var enStr = hex_md5(pwd + "dmbd!@#$%^&*");
            var str = '';
            for (var i = 0; i < enStr.length; i++) {
                for (var j = 0; j < hexDigits.length; j++) {
                    if (hexDigits[j] == enStr.charAt(i)) {
                        j = j + 1;
                        str += hexDigits[j == hexDigits.length ? 0 : j];
                    }
                }
            }
            return str;

        },
        confirm: function (title, info, cb) {
            ngDialog.openConfirm({
                template: 'tpl/confirm.html' + verson,
                cache: false,
                className: 'ngdialog-theme-default',
                controller: ['$scope', function ($scope) {
                    $scope.info = info
                    $scope.title = title
                    $scope.modalConfirmSubmit = function () {
                        cb(ngDialog)
                    }
                    $scope.cancel = function () {
                        ngDialog.close()
                    }

                }],
                width: 540
            })
        },
        confirmDialog: function (size, title, data, html, cb, beforeOpen) {
            this.beforeOpen = beforeOpen || 0
            ngDialog.openConfirm({
                template: html + verson,
                cache: false,
                className: 'ngdialog-theme-default',
                controller: ['$scope', function ($scope) {
                    $scope.data = data
                    $scope.title = title
                    if (beforeOpen) {
                        beforeOpen($scope)
                    }

                    $scope.modalConfirmSubmit = function (type) {
                        if (type) {
                            cb(type, ngDialog, $scope);
                        } else {
                            cb(ngDialog, $scope);
                        }

                    }
                    $scope.cancel = function () {
                        $scope.closeThisDialog()
                    }

                }],
                width: size
            })
        },
        alert: function (info, type) {
            ngDialog.open({
                template: 'tpl/alert.html' + verson,
                closeByEscape: false,
                controller: ['$scope', function ($scope) {
                    $scope.type = type;
                    $scope.info = info;
                    setTimeout(function () {
                        $scope.closeThisDialog()
                    }, 1000)
                }]
            });
        },
        getJson: function (url, params, cb) {
            var me = this;
            $http.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {  
                    var str = [];  
                    for(var p in obj){  
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    }  
                    return str.join("&");  
                  }  
            }).then(function (res) {
                var data = res.data;
                if (data.code == 1) {
                    cb(data.content);
                } else if (data.code == 2) {
                    me.goToUrl('/login');
                    return false;
                } else {
                    me.alert(data.message, 'warning');
                    return false;
                }
            }, function (res) {
                me.alert('网络或服务端异常', 'warning')
            })
        },
        getData: function (url, params, cb) {
            var me = this;
            $http.get(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {  
                    var str = [];  
                    for(var p in obj){  
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    }  
                    return str.join("&");  
                  }  
            }).then(function (res) {
                var data = res.data;
                if (data.code == 1) {
                    cb(data.content);
                } else if (data.code == 2) {
                    me.goToUrl('/login');
                    return false;
                } else {
                    me.alert(data.message, 'warning');
                    return false;
                }
            }, function (res) {
                me.alert('网络或服务端异常', 'warning')
            })
        },
        postData: function (url, params, cb,vm) {
            var me = this;
            $http.post(url, params,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {  
                    var str = [];  
                    for(var p in obj){  
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    }  
                    return str.join("&");  
                  }  
            }).then(function (res) {
                var data = res.data;
                if(vm){
                    vm.isPosting = false;
                }
                if (data.code == 1) {
                    cb(data.content);
                } else if (data.code == 2) {
                    me.goToUrl('/login');
                } else {
                    me.alert(data.message, 'warning');
                    return false;
                }
            }, function (res) {
                me.alert('网络或服务端异常', 'warning')
            })
        },
        removeAry: function(aObj,val){
            var nArr = [];
            for(var i = 0; i < aObj.length; i ++){
                if(aObj[i] != val){
                    nArr.push(aObj[i]);
                }
            }
            return nArr;
        },
        goToUrl: function (path) {
            $location.path(path);
        },
        initTable: function($scope,tableState,url){
            $scope.isLoading = true;
            $scope.tableState = tableState;
            var pagination = tableState.pagination;
            var start = pagination.start || 0;
            var num = $scope.sp.length;
            $scope.sp.start = start;
            this.getJson(url,$scope.sp,function(result){
                $scope.displayed = result.data;
                num = num || $rootScope.paginationNumber[0];
                tableState.pagination.number = num;
                tableState.pagination.numberOfPages = Math.ceil(result.recordsTotal / num);
                $scope.isLoading = false;
            })
        },
        formateDay: function(day){
            if(day < 10){
                return '0' + day.toString();
            }else{
                return day.toString();
            }
        },
        dmbdOSSImageUrlResizeFilter: function(imgUrl, size){
                var joinChar = imgUrl.indexOf('?') >= 0 ? '&' : '?';
                return imgUrl + joinChar + 'x-oss-process=image/resize,m_lfit,' + size + ',w_' + size;
        },
        showProgram: function(item){
            var me = this;
           
            programService.getProgramById(item.pid, function (program) {
                program.creator = item.creator;
                program.status = item.status;
                program.approveUid = item.approveUid;
                program.approveUidFinal = item.approveUidFinal;
                me.confirmDialog(750, '节目预览', program, "tpl/program_details.html", function (ngDialog, vm) {

                }, function (vm) {
                    vm.program = program;
                });
            });
            
        },
        showMaterial: function(item,detailType){
            item.detailType = detailType;
            item.nUrl = baseService.dmbdOSSImageUrlResizeFilter(item.path,400);
            this.confirmDialog(750, '素材详情', item, "tpl/material_detail.html", function (ngDialog, vm) {

            }, function (vm) {
                
            });
            
        }
    }
    return baseService;
}]);