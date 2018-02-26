'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
	.controller('homeCtrl', ['$scope', '$rootScope', 'baseService', function ($scope, $rootScope, baseService) {
		$scope.sp = {};
		var now = new Date();
		$scope.sp.year = now.getFullYear();
		$scope.sp.month = now.getMonth() + 1;
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var prevYear = year - 1;
		var dataList = [];
		$scope.mapInfo = [];
		for (var i = 0; i < 12; i++) {
			dataList.push({
				"month": i + 1,
				"normalCount": 0,
				"offlineCount": 0,
				"abnormalCount": 0
			});
		}
		$scope.formDate = function (n, o, attr) {
			$scope.sp[attr] = n._i.split('-')[0].toString();
			$scope.getData();
		}

		function getmonthNum(month) {
			if (month < 10) {
				return '0' + month.toString();
			} else {
				return month.toString();
			}
		}
		$scope.getData = function () {
			baseService.getData(baseService.api.apiUrl + 'api/report/terminalReport/' + $scope.sp.year, {}, function (res) {
				var dataList = [];
				var maxValue = '';
				var normalCountList = [];
				var nofflineCountList = [];
				var abnormalCountList = [];
				var terminalOption = {
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						},
						backgroundColor: '#0a2439',
						padding: [10, 20, 10, 5],
						textStyle: {
							color: '#000'
						},
						formatter: '<span style="color:#fff;">{b}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#08a9d6;display:inline-block;margin-right:4px;"></span><span style="color:#08a9d6;font-size:12px;">在线终端</span><span style="color:#54e3c5;"> {c0}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#eee;display:inline-block;margin-right:4px;"></span><span style="color:#adadad;font-size:12px;">离线终端</span><span style="color:#eee;"> {c1}</span><br /><span style="width:10px;height:10px;border-radius:50%;background:#c82f40;display:inline-block;margin-right:4px;"></span><span style="color:#c82f40;font-size:12px;">异常终端</span><span style="color:#f33c45;"> {c2}</span>',
						extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'
					},
					legend: {
						data: [{
							name: '在线终端',
							textStyle: {
								color: '#08a9d6'
							}
						}, {
							name: '异常终端',
							textStyle: {
								color: '#c82f40'
							}
						}, {
							name: '离线终端',
							textStyle: {
								color: '#bababa'
							}
						}],
						right: '1%'
					},
					grid: {
						left: '6%',
						right: '0%',
						bottom: '0%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						//name: '(月份)',
						nameRotate: 90,
						nameTextStyle: {

						},
						nameGap: 0,
						axisLine: {
							lineStyle: {
								color: '#0d67af'
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							color: '#0d67af',
							fontSize: 10,
							rotate: 90
						},
						data: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
					},
					yAxis: [{
							type: 'value',
							min: 0,
							max: maxValue + 10,
							interval: 10,
							axisLine: {
								lineStyle: {
									color: '#0d67af'
								}
							},
							splitLine: {
								show: false
							},
							axisLabel: {
								color: '#0d67af',
								formatter: '{value}'
							}
						},
						{
							type: 'value',
							splitLine: {
								show: false,
								lineStyle: {
									color: '#e2e3e6'
								}
							},
							min: 0,
							axisLine: {
								lineStyle: {
									color: '#e2e3e6'
								}
							},
							max: maxValue + maxValue,
							axisTick: {
								show: false
							},
							axisLine: {
								show: false
							},
							axisLabel: {
								show: false
							}
						}
					],
					series: [{
							name: '在线终端',
							type: 'bar',
							stack: '总量',
							areaStyle: {
								normal: {}
							},
							smooth: true,
							barCategoryGap: '50%',
							itemStyle: {
								normal: {
									color: {
										type: 'linear',
										x: 0,
										y: 0,
										x2: 1,
										y2: 0,
										colorStops: [{
											offset: 0,
											color: '#0d67af' // 0% 处的颜色
										}, {
											offset: 0.2,
											color: '#1083c5' // 0% 处的颜色
										}, {
											offset: 0.4,
											color: '#1096ce' // 0% 处的颜色
										}, {
											offset: 0.6,
											color: '#08a9d6' // 0% 处的颜色
										}, {
											offset: 0.8,
											color: '#06b9de' // 0% 处的颜色
										}, {
											offset: 1,
											color: '#00d1ea' // 100% 处的颜色
										}]
									}
								}

							},
							data: normalCountList
						},
						{
							name: '离线终端',
							type: 'bar',
							stack: '总量',
							areaStyle: {
								normal: {}
							},
							smooth: true,
							itemStyle: {
								normal: {
									color: {
										type: 'linear',
										x: 0,
										y: 0,
										x2: 1,
										y2: 0,
										colorStops: [{
											offset: 0,
											color: '#a3a4a6' // 0% 处的颜色
										}, {
											offset: 1,
											color: '#dee5e7' // 100% 处的颜色
										}]
									}
								}

							},
							data: nofflineCountList
						},
						{
							name: '异常终端',
							type: 'bar',
							stack: '总量',
							smooth: true,
							areaStyle: {
								normal: {}
							},
							areaStyle: {
								normal: {}
							},
							itemStyle: {
								normal: {
									color: {
										type: 'linear',
										x: 0,
										y: 0,
										x2: 1,
										y2: 0,
										colorStops: [{
											offset: 0,
											color: '#ad2338' // 0% 处的颜色
										}, {
											offset: 0.5,
											color: '#ad2338' // 0% 处的颜色
										}, {
											offset: 1,
											color: '#e13442' // 100% 处的颜色
										}]
									}
								}

							},
							data: abnormalCountList
						},
						{
							name: '趋势',
							type: 'line',
							smooth: true,
							yAxisIndex: 1,
							lineStyle: {
								normal: {
									color: '#0cf5c0',
									type: 'dashed'
								}

							},
							data: normalCountList
						}

					]
				}
				for (var i = 0; i < 12; i++) {
					dataList.push({
						"year": $scope.sp.year,
						"month": i + 1,
						"normalCount": 0,
						"offlineCount": 0,
						"abnormalCount": 0
					});
				}
				for (var i = 0; i < dataList.length; i++) {
					for (var j = 0; j < res.length; j++) {
						if (res[j].month == dataList[i].month) {
							dataList[i] = res[j];
						}
					}
				}

				function setBarChart() {
					var oldMax = 0;
					for (var i = 0; i < dataList.length; i++) {
						var newMax = dataList[i].normalCount + dataList[i].offlineCount + dataList[i].abnormalCount
						if (newMax > oldMax) {
							oldMax = newMax;
						}
					}
					oldMax = Math.ceil((oldMax + 20) / 10) * 10;
					terminalOption.yAxis[0].max = oldMax;
					terminalOption.yAxis[1].max = oldMax * 2;
					terminalOption.xAxis.data = dataList.map(function (item) {
						return item.year + '-' + getmonthNum(item.month);
					});
					terminalOption.series[0].data = dataList.map(function (item) {
						return item.normalCount;
					});
					terminalOption.series[3].data = dataList.map(function (item) {
						return item.normalCount;
					});
					terminalOption.series[1].data = dataList.map(function (item) {
						return item.offlineCount;
					});
					terminalOption.series[2].data = dataList.map(function (item) {
						return item.abnormalCount;
					});
					$scope.terminalOption = terminalOption;
				}
				if ($scope.sp.year == year) {
					baseService.getData(baseService.api.apiUrl + 'api/report/terminalReport/' + prevYear, {}, function (resPrev) {
						var dataListPrev = [];
						for (var i = 0; i < 12; i++) {
							dataListPrev.push({
								"year": prevYear,
								"month": i + 1,
								"normalCount": 0,
								"offlineCount": 0,
								"abnormalCount": 0
							});
						}
						for (var i = 0; i < dataListPrev.length; i++) {
							for (var j = 0; j < resPrev.length; j++) {
								if (resPrev[j].month == dataListPrev[i].month) {
									dataListPrev[i] = resPrev[j];
								}
							}
						}

						dataList = dataListPrev.concat(dataList);
						dataList = dataList.slice(month - 1, 11 + month);
						setBarChart();

					})
				} else {
					setBarChart();

				}


			})
			baseService.getData(baseService.api.apiUrl + 'api/report/newTerminalPerMonthReport/' + year, {}, function (res) {
				/************************ */
				var data = [];
				var colorArr = ['rgba(12, 237, 189, 0.9)', 'rgba(61, 111, 252, 0.7)', 'rgba(0, 157, 228, 0.8)', 'rgba(12, 141, 250, 0.8)', 'rgba(2, 214, 230, 0.9)'];
				if (res.length) {
					for (var i = 0; i < res.length; i++) {
						data.push({
							value: res[i].count,
							year: res[i].year,
							month: res[i].month,
							name: res[i].year + '-' + res[i].month
						})
					}
				} else {
					for (var i = 0; i < 12; i++) {
						data.push({
							value: 0,
							year: year,
							month: month,
							name: year + '-' + res[i].month
						})
					}
				}
				var terminalpieOption = {
					title: {
						text: '{a|新增终端}',
						//subtext: '2018',
						x: 'center',
						y: 'middle',
						color: '#bbbbbb',
						textStyle: {
							rich: {
								a: {
									color: '#00a0e9',
									fontSize: 18,
									backgroundColor: {
										image: '../../img/pie_brg.png'
									},
									height: 110
								}
							}
						},
						//itemGap: -85,
						subtextStyle: {
							color: '#bbb',
							fontSize: 18
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: "{b}<br/>{c} 台",
						backgroundColor: '#0a2439',
						padding: [10, 20, 10, 5],
						textStyle: {
							color: '#fff'
						},
						extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'
					},
					color: colorArr,
					legend: {},
					grid: {
						left: '0%',
						right: '0%',
						bottom: '0%',
						containLabel: true
					},
					calculable: true,
					series: [{
						name: '新增终端',
						type: 'pie',
						radius: [60, 120],
						center: ['50%', '50%'],
						labelLine: {
							normal: {
								length: 8,
								length2: 30,
							}

						},
						label: {
							normal: {
								formatter: '{a|{c}}\n{b|{b}}',
								borderWidth: 0,
								borderRadius: 4,
								padding: [0, -30],
								color: '#00a0e9',
								rich: {
									a: {
										fontSize: 12,
										lineHeight: 20
									},
									b: {
										fontSize: 12,
										lineHeight: 20,
									}

								}
							}
						},
						roseType: 'area',
						data: data
					}]
				};

				function setPieChart(data) {
					terminalpieOption.series[0].data = data;
					$scope.terminalpieOption = terminalpieOption;
				}
				if ($scope.sp.year == year) {
					baseService.getData(baseService.api.apiUrl + 'api/report/newTerminalPerMonthReport/' + prevYear, {}, function (resPrev) {
						var dataListPrev = [];

						for (var i = 0; i < 12; i++) {
							dataListPrev.push({
								value: resPrev[i].count,
								year: resPrev[i].year,
								month: resPrev[i].month,
								name: resPrev[i].year + '-' + resPrev[i].month
							});
						}

						data = dataListPrev.concat(data);
						data = data.slice(month - 1, 11 + month);
						setPieChart(data);

					})
				} else {
					setPieChart(data);

				}
			})
			baseService.getData(baseService.api.apiUrl + 'api/report/terminalReportAll', {}, function (res) {
				var totalMax = 10000;
                $scope.totalCount = res.totalCount;
                $scope.onlineCount = res.onlineCount;
                $scope.offlineCount = res.offlineCount;				// var totalCount = res.totalCount * 100;
				// var onlineCount = res.onlineCount * 100;
				// var offlineCount = res.offlineCount * 100;
				// $scope.terminalmeterOption = {
				// 	tooltip: {
				// 		formatter: "{a} <br/>{c} {b} 台",
				// 		backgroundColor: '#0a2439',
				// 		padding: [10, 20, 10, 5],
				// 		textStyle: {
				// 			color: '#fff'
				// 		},
				// 		extraCssText: 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);'
				// 	},
				// 	series: [{
				// 			name: '终端总量',
				// 			type: 'gauge',
				// 			min: 0,
				// 			max: totalMax,
				// 			splitNumber: 10,
				// 			center: ['50%', '50%'],
				// 			radius: '70%',
				// 			axisLine: { // 坐标轴线
				// 				lineStyle: { // 属性lineStyle控制线条样式
				// 					color: [
				// 						[0.09, 'lime'],
				// 						[0.82, '#1e90ff'],
				// 						[1, '#ff4500']
				// 					],
				// 					width: 3,
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			axisLabel: { // 坐标轴小标记
				// 				textStyle: { // 属性lineStyle控制线条样式
				// 					fontWeight: 'bolder',
				// 					color: '#fff',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10,
				// 					fontSize: 8
				// 				}
				// 			},
				// 			axisTick: { // 坐标轴小标记
				// 				length: 15, // 属性length控制线长
				// 				lineStyle: { // 属性lineStyle控制线条样式
				// 					color: 'auto',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			splitLine: { // 分隔线
				// 				length: 25, // 属性length控制线长
				// 				lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
				// 					width: 3,
				// 					color: '#fff',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			pointer: { // 分隔线
				// 				shadowColor: '#fff', //默认透明
				// 				shadowBlur: 5
				// 			},
				// 			title: {
				// 				offsetCenter: [0, '-40%'],
				// 				textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				// 					fontSize: 14,
				// 					color: '#00a0e9',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			detail: {
				// 				backgroundColor: '#0a2439',
				// 				borderWidth: 1,
				// 				borderColor: '#00a0e9',
				// 				shadowColor: '#00a0e9', //默认透明
				// 				shadowBlur: 5,
				// 				width: 40,
				// 				height: 30,
				// 				fontSize: 14,
				// 				offsetCenter: [0, '100%'], // x, y，单位px
				// 				textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				// 					color: '#00a0e9'
				// 				}
				// 			},
				// 			data: [{
				// 				value: totalCount,
				// 				name: '终端总量'
				// 			}]
				// 		},
				// 		{
				// 			name: '在线终端',
				// 			type: 'gauge',
				// 			center: ['18%', '50%'], // 默认全局居中
				// 			radius: '50%',
				// 			min: 0,
				// 			max: totalCount,
				// 			startAngle: 315,
				// 			endAngle: 45,
				// 			splitNumber: 10,
				// 			axisLine: { // 坐标轴线
				// 				lineStyle: { // 属性lineStyle控制线条样式
				// 					color: [
				// 						[0.29, 'lime'],
				// 						[0.86, '#1e90ff'],
				// 						[1, '#ff4500']
				// 					],
				// 					width: 2,
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			axisLabel: { // 坐标轴小标记
				// 				textStyle: { // 属性lineStyle控制线条样式
				// 					fontWeight: 'bolder',
				// 					color: '#fff',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10,
				// 					fontSize: 8
				// 				}
				// 			},
				// 			axisTick: { // 坐标轴小标记
				// 				length: 12, // 属性length控制线长
				// 				lineStyle: { // 属性lineStyle控制线条样式
				// 					color: 'auto',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			splitLine: { // 分隔线
				// 				length: 20, // 属性length控制线长
				// 				lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
				// 					width: 3,
				// 					color: '#fff',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			pointer: {
				// 				width: 5,
				// 				shadowColor: '#fff', //默认透明
				// 				shadowBlur: 5
				// 			},
				// 			title: {
				// 				offsetCenter: [0, '-30%'],
				// 				textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				// 					fontSize: 12,
				// 					color: '#00a0e9',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			detail: {
				// 				backgroundColor: '#0a2439',
				// 				borderWidth: 1,
				// 				borderColor: '#00a0e9',
				// 				shadowColor: '#00a0e9', //默认透明
				// 				shadowBlur: 5,
				// 				width: 40,
				// 				height: 30,
				// 				fontSize: 14,
				// 				offsetCenter: [0, '140%'], // x, y，单位px
				// 				textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				// 					color: '#00a0e9'
				// 				}
				// 			},
				// 			data: [{
				// 				value: onlineCount,
				// 				name: '在线终端'
				// 			}]
				// 		},
				// 		{
				// 			name: '离线终端',
				// 			type: 'gauge',
				// 			center: ['82%', '50%'], // 默认全局居中
				// 			radius: '50%',
				// 			min: 0,
				// 			max: totalCount,
				// 			startAngle: 135,
				// 			endAngle: -135,
				// 			splitNumber: 10,
				// 			axisLine: { // 坐标轴线
				// 				lineStyle: { // 属性lineStyle控制线条样式
				// 					color: [
				// 						[0.29, 'lime'],
				// 						[0.86, '#1e90ff'],
				// 						[1, '#ff4500']
				// 					],
				// 					width: 2,
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			axisLabel: { // 坐标轴小标记
				// 				textStyle: { // 属性lineStyle控制线条样式
				// 					fontWeight: 'bolder',
				// 					color: '#fff',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10,
				// 					fontSize: 8
				// 				}
				// 			},
				// 			axisTick: { // 坐标轴小标记
				// 				length: 12, // 属性length控制线长
				// 				lineStyle: { // 属性lineStyle控制线条样式
				// 					color: 'auto',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			splitLine: { // 分隔线
				// 				length: 20, // 属性length控制线长
				// 				lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
				// 					width: 3,
				// 					color: '#fff',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			pointer: {
				// 				width: 5,
				// 				shadowColor: '#fff', //默认透明
				// 				shadowBlur: 5
				// 			},
				// 			title: {
				// 				offsetCenter: [0, '-30%'],
				// 				textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				// 					fontSize: 12,
				// 					color: '#00a0e9',
				// 					shadowColor: '#fff', //默认透明
				// 					shadowBlur: 10
				// 				}
				// 			},
				// 			detail: {
				// 				backgroundColor: '#0a2439',
				// 				borderWidth: 1,
				// 				borderColor: '#00a0e9',
				// 				shadowColor: '#00a0e9', //默认透明
				// 				shadowBlur: 5,
				// 				width: 40,
				// 				height: 30,
				// 				fontSize: 14,
				// 				offsetCenter: [0, '140%'], // x, y，单位px
				// 				textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				// 					color: '#00a0e9'
				// 				}
				// 			},
				// 			data: [{
				// 				value: offlineCount,
				// 				name: '离线终端'
				// 			}]
				// 		}
				// 	]
				// };

			})
			baseService.getData(baseService.api.apiUrl + 'api/report/terminalReportByRegion', {}, function (res) {
				//*****************/

				var geoCoordMap = {};
				for (var i in baseService.citiesNo) {
					geoCoordMap[baseService.citiesNo[i].n] = baseService.citiesNo[i].p.split('|')[0].split(',');
				}
				var data = [];

				for (var i = 0; i < res.length; i++) {
					data.push({
						name: baseService.citiesNo[res[i].cityCode].n,
						value: res[i].count
					})
					$scope.mapInfo.push({
						name: baseService.citiesNo[res[i].cityCode].n,
						value: res[i].count
					})
				}

				var convertData = function (data) {
					var res = [];
					for (var i = 0; i < data.length; i++) {
						var geoCoord = geoCoordMap[data[i].name];
						if (geoCoord) {
							res.push({
								name: data[i].name,
								value: geoCoord.concat(data[i].value)
							});
						}
					}
					return res;
				};

				function renderItem(params, api) {
					var coords = [
						[116.7, 39.53],
						[103.73, 36.03],
						[112.91, 27.87],
						[120.65, 28.01],
						[119.57, 39.95]
					];
					var points = [];
					for (var i = 0; i < coords.length; i++) {
						points.push(api.coord(coords[i]));
					}
					var color = api.visual('color');

					return {
						type: 'polygon',
						shape: {
							points: echarts.graphic.clipPointsByRect(points, {
								x: params.coordSys.x,
								y: params.coordSys.y,
								width: params.coordSys.width,
								height: params.coordSys.height
							})
						},
						style: api.style({
							fill: color,
							stroke: echarts.color.lift(color)
						})
					};
				}
				$scope.mapOption = {
					backgroundColor: '#0a2439',
					tooltip: {
						trigger: 'item'
					},
					grid: {
						left: '0%',
						right: '0%',
						bottom: '0%'
					},
					bmap: {
						center: [104.114129, 37.550339],
						zoom: 5,
						roam: true,
						mapStyle: {
							styleJson: [{
									"featureType": "water",
									"elementType": "all",
									"stylers": {
										"color": "#000000"
									}
								},
								{
									"featureType": "land",
									"elementType": "all",
									"stylers": {
										"color": "#0a2439"
									}
								},
								{
									"featureType": "boundary",
									"elementType": "geometry",
									"stylers": {
										"color": "#2d5f8c"
									}
								},
								{
									"featureType": "railway",
									"elementType": "all",
									"stylers": {
										"visibility": "off"
									}
								},
								{
									"featureType": "highway",
									"elementType": "geometry",
									"stylers": {
										"color": "#49122c"
									}
								},
								{
									"featureType": "highway",
									"elementType": "geometry.fill",
									"stylers": {
										"color": "#005b96",
										"lightness": 1
									}
								},
								{
									"featureType": "highway",
									"elementType": "labels",
									"stylers": {
										"visibility": "off"
									}
								},
								{
									"featureType": "arterial",
									"elementType": "geometry",
									"stylers": {
										"color": "red"
									}
								},
								{
									"featureType": "arterial",
									"elementType": "geometry.fill",
									"stylers": {
										"color": "#00508b"
									}
								},
								{
									"featureType": "poi",
									"elementType": "all",
									"stylers": {
										"visibility": "off"
									}
								},
								{
									"featureType": "green",
									"elementType": "all",
									"stylers": {
										"color": "#056197",
										"visibility": "off"
									}
								},
								{
									"featureType": "subway",
									"elementType": "all",
									"stylers": {
										"visibility": "off"
									}
								},
								{
									"featureType": "manmade",
									"elementType": "all",
									"stylers": {
										"visibility": "off"
									}
								},
								{
									"featureType": "local",
									"elementType": "all",
									"stylers": {
										"visibility": "off"
									}
								},
								{
									"featureType": "arterial",
									"elementType": "labels",
									"stylers": {
										"visibility": "off"
									}
								},
								{
									"featureType": "boundary",
									"elementType": "geometry.fill",
									"stylers": {
										"color": "#2d5f8c"
									}
								},
								{
									"featureType": "building",
									"elementType": "all",
									"stylers": {
										"color": "#red"
									}
								},
								{
									"featureType": "label",
									"elementType": "labels.text.fill",
									"stylers": {
										"color": "#3d8eab",
										"visibility": "on"
									}
								},
								{
									"featureType": "label",
									"elementType": "labels.text.stroke",
									"stylers": {
										"color": "#444444",
										"visibility": "on"
									}
								}
							]
						}
					},
					// series: [{
					// 		name: 'pm2.5',
					// 		type: 'scatter',
					// 		coordinateSystem: 'bmap',
					// 		data: convertData(data),
					// 		symbolSize: function (val) {
					// 			return val[2] / 10;
					// 		},
					// 		label: {
					// 			normal: {
					// 				formatter: '{b}',
					// 				position: 'right',
					// 				show: false
					// 			},
					// 			emphasis: {
					// 				show: true
					// 			}
					// 		},
					// 		itemStyle: {
					// 			normal: {
					// 				color: '#ddb926'
					// 			}
					// 		}
					// 	},
					// 	{
					// 		name: 'Top 5',
					// 		type: 'effectScatter',
					// 		coordinateSystem: 'bmap',
					// 		data: convertData(data.sort(function (a, b) {
					// 			return b.value - a.value;
					// 		}).slice(0, 6)),
					// 		symbolSize: function (val) {
					// 			return val[2] / 10;
					// 		},
					// 		showEffectOn: 'emphasis',
					// 		rippleEffect: {
					// 			brushType: 'stroke'
					// 		},
					// 		hoverAnimation: true,
					// 		label: {
					// 			normal: {
					// 				formatter: '{b}',
					// 				position: 'right',
					// 				show: true
					// 			}
					// 		},
					// 		itemStyle: {
					// 			normal: {
					// 				color: '#f4e925',
					// 				shadowBlur: 10,
					// 				shadowColor: '#333'
					// 			}
					// 		},
					// 		zlevel: 1
					// 	},
					// 	{
					// 		type: 'custom',
					// 		coordinateSystem: 'bmap',
					// 		renderItem: renderItem,
					// 		itemStyle: {
					// 			normal: {
					// 				opacity: 0.5
					// 			}
					// 		},
					// 		animation: false,
					// 		silent: true,
					// 		data: [0],
					// 		z: -10
					// 	}
					// ]
				}
			})
		}
		$scope.getData();


	}]);
// JavaScript Document