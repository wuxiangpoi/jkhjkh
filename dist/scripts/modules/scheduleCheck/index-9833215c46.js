"use strict";angular.module("sbAdminApp",["chartService"]).controller("scheduleCheckCtrl",["$scope","$rootScope","baseService","chartService",function(e,c,a,r){e.displayed=[],e.sp={},e.tableState={},e.callServer=function(r){a.initTable(e,r,a.api.apiUrl+"/api/programScheduleCheck/getProgramScheduleCheckPageList",function(e){c.programScheduleCheckCounts=e.recordsTotal})},e.showSchedule=function(c,t){a.showSchedule(c,t,r,function(r){a.confirm("排期审核","确定"+(1==r?"通过":"不通过")+"排期："+c.name+"?",function(t,o){o.isPosting=!0,a.postData(a.api.apiUrl+"/api/programScheduleCheck/checkProgramSchedule",{id:c.id,status:r},function(c){t.close(),a.alert("操作成功","success"),e.callServer(e.tableState)})})})}}]);