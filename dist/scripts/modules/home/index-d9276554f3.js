"use strict";angular.module("sbAdminApp",[]).controller("homeCtrl",["$scope","$window","$rootScope","baseService",function(e,n,i,a){if(e.ter_all=0,e.ter_ok=0,e.ter_noAct=0,e.ter_offline=0,e.ter_error=0,e.closeThisTip=function(e){$(e.currentTarget).parents(".userTip").remove()},e.initPage=function(){var n=new BMap.Map("allmap",{enableMapClick:!1}),i=new BMap.Point(113.649644,34.75661),t=new BMap.ScaleControl({anchor:BMAP_ANCHOR_TOP_LEFT}),o=new BMap.NavigationControl;n.centerAndZoom(i,5),n.enableScrollWheelZoom(!0),n.addControl(t),n.addControl(o),a.getJson(a.api.terminal+"getAllTerminalInfoForMap",{},function(i){function a(e,i){var a=i.target,t=new BMap.Point(a.getPosition().lng,a.getPosition().lat),o=new BMap.InfoWindow(e,l);n.openInfoWindow(o,t)}e.ters=i;for(var t in e.ters){var o=e.ters[t],r=new BMap.Point(t.split(",")[0],t.split(",")[1]),p=new BMap.Marker(r),d=[];d.push("<h5 style='margin:5px 0;'>地址："+o[0].addr+"</h5>");for(var l={width:250,title:"终端信息",padding:5},s=0;s<o.length;s++){var c=o[s];d.push('<div class="infoWindow" style="border-top:1px solid #ddd;font-size:12px;line-height:18px;padding-top:5px;">'),d.push('<div class="info-line"></div>编号：'+c.no),d.push("<div>名称："+c.name+"</div>"),e.ter_all=e.ter_all+1,0==c.status?(d.push("<div>状态：未激活</div>"),e.ter_noAct=e.ter_noAct+1):1==c.status?(d.push("<div>状态：在线</div>"),p=new BMap.Marker(r,{icon:new BMap.Icon("img/zaixian.png",new BMap.Size(20,25))}),e.ter_ok=e.ter_ok+1):2==c.status?(d.push("<div>状态：离线</div>"),e.ter_offline=e.ter_offline+1,p=new BMap.Marker(r,{icon:new BMap.Icon("img/lixian.png",new BMap.Size(20,25))})):3==c.status&&(d.push("<div>状态：异常</div>"),e.ter_error=e.ter_error+1,p=new BMap.Marker(r,{icon:new BMap.Icon("img/yichang.png",new BMap.Size(20,25))})),d.push("</div>"),n.addOverlay(p),function(e,n){n.addEventListener("click",function(n){a(e,n)})}(d.join(""),p)}}})},"undefined"==typeof BMap){var t=document.createElement("script");t.src="http://api.map.baidu.com/api?v=2.0&ak=hWot28fmyYXe1AMOfBfHoMMfSlnVnkeb&callback=baiduMapLoaded",document.body.appendChild(t),n.baiduMapLoaded=function(){e.initPage()}}else e.initPage()}]);