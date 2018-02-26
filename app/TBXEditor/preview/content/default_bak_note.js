//注：

var program = {
    "id": "0123456789ABCDEF0123456789ABCDEE",
    "name": "节目二",
    //"rateHorizontal": 16,
    //"rateVertical": 9,
    //"scale": 120,
    "pixelHorizontal": 1920,//节目横向像素值
    "pixelVertical": 1080,//节目纵向像素值
    "pages": [//节目内的场景集合，可存在多个场景，数量理论无上限
        {
            "ver": 1,//场景版本号
            "stay": 40,//当前场景停留时间，单位：秒
            "background": {//该场景的背景，可以没有，也可以是纯色和图片
                "ver": 1,//背景版本号
                "type": 2,//背景类型：0表示无背景；1表示纯色背景，此时color就是背景颜色；2表示图片背景，此时根据image展示背景
                "image": {//type为2时，根据此属性展示背景，注意：当未选取图片时，image为null
                    "ver": 1,
                    "path": "images/03.jpg"//查找图片时的关键字
                },
                "color": {//type为1时,读取此属性，统一有RGB表示
                    "r": 0,
                    "g": 255,
                    "b": 0
                },
                "opacity": 80//透明度，取值范围：0~100，0表示完全透明，100表示完全不透明，仅当tye=1或2时有效
            },
            "elements": [//该场景下的控件集合，一个场景可以有N多控件组成
                {
                    "ver": 1,//控件的版本号
                    "type": 100,//控件的类型，100表示静态文字
                    "data": {//控件类型相关的数据
                        "ver": 1,//该类型控件相关数据的版本号
                        "isMultiple": false,//是否可换行显示（当文字超出水平宽度时）
                        "value": "快媒数字，引领媒体新潮流",//文字内容
                        "font": 1,//字体编号,可先选几种字体测试
                        "size": 20,//文字大小：按页面宽高的最大值的比例来计算，按千分之计算
                        "color": {//字体颜色，统一使用RGB
                            "r": 0,
                            "g": 255,
                            "b": 255
                        },
                        "horizontalAlign": "center",//水平对齐：left：左对齐；center：居中；right：右对齐
                        "verticalAlign": "middle"//垂直对齐：top：顶部对齐；middle：居中；bottom：底部对齐
                    },
                    "layout": {//控件的布局
                        "ver": 1,//布局的版本号
                        "left": 3,//离场景左侧的距离，百分比，可以是小数
                        "top": 0,//离场景顶部的距离，百分比，可以是小数
                        "width": 94,//该控件占据的宽度，百分比，可以是小数
                        "height": 10,//该控件占据的高度，百分比，可以是小数
                        "zIndex": -1,//该控件的显示层级：整数，可以是负数，如果发生重叠，值大的遮住小的
                        "rotate": 0//旋转角度
                    },
                    "background": {//该控件的背景，内部属性与场景的背景完全一致
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {//控件边框
                        "ver": 1,//边框版本号
                        "color": {//边框颜色，统一使用RGB
                            "r": 255,
                            "g": 55,
                            "b": 0
                        },
                        "width": 5,//边框宽度,根据页面宽高最大值的比例来，千分之（注意：layout中的宽度包含边框）
                        "style": "solid",//边框样式：solid实线；dashed虚线；点线：dotted；不识别的按实线处理
                        "radius": 15,//边框圆角，根据页面宽高最大值的比例来，千分之
                        "padding": 5,//边框内边距（即内边留白），根据页面宽高最大值的比例来，千分之（注意：layout中的宽度包含边框）
                        "opacity": 70//边框透明度，取值范围：0~100，0表示完全透明，100表示完全不透明
                    },
                    "filter": {//滤镜效果
                        "ver": 1,
                        "opacity": 100,//控件本身透明度，不包含边框
                        "brightness": 100,//控件本身亮度，不包含边框
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,//模糊度
                        "invert": 0,//反色
                        "hueRotate": 0//色相旋转角度
                    }
                },
                {
                    "ver": 1,
                    "type": 160,//整合走马灯与文字
                    "data": {
                        "ver": 1,
                        "isScroll": false,//false表示静态文字，true表示走马灯，只有向左方向
                        "speed": 10,//走马灯速度
                        "value": "快媒数字，引领媒体新潮流",
                        "font": 0,
                        "size": 25,
                        "color": {
                            "r": 0,
                            "g": 255,
                            "b": 0
                        },
                        "horizontalAlign": "center",//水平对齐，走马灯时此字段无意义
                        "verticalAlign": "middle"//垂直对齐
                    },
                    "layout": {
                        "ver": 1,
                        "left": 5,
                        "top": 10,
                        "width": 90,
                        "height": 10,
                        "zIndex": 1,
                        "rotate": 0
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 255,
                            "g": 0,
                            "b": 255
                        },
                        "width": 5,
                        "style": "solid",
                        "radius": 50,
                        "padding": 5,
                        "opacity": 80
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                },
                {
                    "ver": 1,
                    "type": 900,//表示网页
                    "data": {
                        "ver": 1,//版本号
                        "url": "http://m.qq.com",//网页完整URL
                        "autoRefresh": false,//是否自动刷新网页：true自动刷新；false不刷新
                        "refreshInterval": 60//自动刷新网页的时间间隔，单位：秒，仅autoRefresh为true时有效
                    },
                    "layout": {
                        "ver": 1,
                        "left": 0,
                        "top": 20,
                        "width": 50,
                        "height": 30,
                        "zIndex": -1,
                        "rotate": 15
                    },
                    "background": {
                        "ver": 1,
                        "type": 2,
                        "image": {
                            "ver": 1,
                            "path": "images/01.jpg"
                        },
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 77,
                            "g": 88,
                            "b": 0
                        },
                        "width": 5,
                        "style": "solid",
                        "radius": 40,
                        "padding": 5,
                        "opacity": 90
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 90,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                },
                {
                    "ver": 1,
                    "type": 250,//表示多张图片轮播
                    "data": {
                        "ver": 1,
                        "images": [//图片数组，理论无上限
                            {
                                "ver": 1,
                                "path": "images/08.jpg"
                            },
                            {
                                "ver": 1,
                                "path": "images/09.jpg"
                            },
                            {
                                "ver": 1,
                                "path": "images/10.jpg"
                            },
                            {
                                "ver": 1,
                                "path": "images/11.jpg"
                            },
                            {
                                "ver": 1,
                                "path": "images/12.jpg"
                            }
                        ],
                        "animation": {
                            "inId": 1,//进场动画编号（下一张图片进来时的动画）
                            "outId": 1//出场动画编号（上一张图片离开时的动画），理论上进场动画和出场动画是可以不对应的
                        },
                        "stay": 3,//前后两次动画之间逗留的时间，单位：秒
                        "duration": 1500//动画持续的时间，单位：毫秒
                    },
                    "layout": {
                        "ver": 1,
                        "left": 50,
                        "top": 20,
                        "width": 50,
                        "height": 30,
                        "zIndex": 1,
                        "rotate": 0
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 255,
                            "g": 55,
                            "b": 0
                        },
                        "width": 5,
                        "style": "solid",
                        "radius": 35,
                        "padding": 2,
                        "opacity": 90
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                },
                {
                    "ver": 1,
                    "type": 300,//表示单个视频（已舍弃，可不解析此类型）
                    "data": {
                        "ver": 1,
                        "video": {
                            "ver": 1,
                            "path": "./media/02.mp4"
                        },
                        "isMuted": true
                    },
                    "layout": {
                        "ver": 1,
                        "left": 0,
                        "top": 50,
                        "width": 50,
                        "height": 30,
                        "zIndex": 0,
                        "rotate": 0
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 255,
                            "g": 55,
                            "b": 0
                        },
                        "width": 6,
                        "style": "solid",
                        "radius": 50,
                        "padding": 5,
                        "opacity": 70
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                },
                {
                    "ver": 1,
                    "type": 350,//表示多个视频（当上一个视频播放结束后自动播放下一个视频，最后一个播放完毕后又从第一个开始）
                    "data": {
                        "ver": 1,
                        "videos": [//表示多个视频的数组
                            {
                                "ver": 1,
                                "path": "./media/04.mp4"
                            },
                            {
                                "ver": 1,
                                "path": "./media/03.mp4"
                            },
                            {
                                "ver": 1,
                                "path": "./media/11.mp4"
                            }
                        ],
                        "isMuted": false//是否禁音，对本控件内所有
                    },
                    "layout": {
                        "ver": 1,
                        "left": 50,
                        "top": 50,
                        "width": 50,
                        "height": 30,
                        "zIndex": -1,
                        "rotate": 0
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 255,
                            "g": 55,
                            "b": 0
                        },
                        "width": 10,
                        "style": "solid",
                        "radius": 40,
                        "padding": 0,
                        "opacity": 100
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                },
                {
                    "ver": 1,
                    "type": 500,//表示时间
                    "data": {
                        "ver": 1,
                        "formatter": 1,//时间显示格式：1时间和日期；2仅日期；3仅时间
                        "font": 3,
                        "size": 35,
                        "color": {
                            "r": 255,
                            "g": 0,
                            "b": 255
                        },
                        "horizontalAlign": "center",
                        "verticalAlign": "middle"
                    },
                    "layout": {
                        "ver": 1,
                        "left": 0,
                        "top": 80,
                        "width": 100,
                        "height": 10,
                        "zIndex": -1,
                        "rotate": 0
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 255,
                            "g": 55,
                            "b": 0
                        },
                        "width": 5,
                        "style": "solid",
                        "radius": 12,
                        "padding": 5,
                        "opacity": 70
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                },
                {
                    "ver": 1,
                    "type": 0,
                    "layout": {
                        "ver": 1,
                        "left": 0,
                        "top": 90,
                        "width": 100,
                        "height": 10,
                        "zIndex": -1,
                        "rotate": 0
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 255,
                            "g": 55,
                            "b": 0
                        },
                        "width": 5,
                        "style": "solid",
                        "radius": 12,
                        "padding": 5,
                        "opacity": 70
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                }
            ]
        },
        {
            "ver": 1,
            "stay": 2,
            "background": {
                "ver": 1,
                "type": 2,
                "image": {
                    "ver": 1,
                    "path": "images/09.jpg"
                },
                "color": {
                    "r": 24,
                    "g": 168,
                    "b": 92
                },
                "opacity": 100
            },
            "elements": [
                {
                    "ver": 1,
                    "type": 200,
                    "data": {
                        "ver": 1,
                        "image": {
                            "ver": 1,
                            "path": "images/07.jpg"
                        }
                    },
                    "layout": {
                        "ver": 1,
                        "left": 10,
                        "top": 60,
                        "width": 80,
                        "height": 50,
                        "zIndex": 0,
                        "rotate": 15
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 0,
                            "g": 55,
                            "b": 255
                        },
                        "width": 5,
                        "style": "solid",
                        "radius": 12,
                        "padding": 5,
                        "opacity": 70
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                }
            ]
        },
        {
            "ver": 1,
            "stay": 30,
            "background": {
                "ver": 1,
                "type": 2,
                "image": {
                    "ver": 1,
                    "path": "images/01.jpg"
                },
                "color": {
                    "r": 0,
                    "g": 255,
                    "b": 0
                },
                "opacity": 50
            },
            "elements": [
                {
                    "ver": 1,
                    "type": 150,
                    "data": {
                        "ver": 1,
                        "value": "快媒数字，引领媒体新潮流111",
                        "font": 4,
                        "size": 25,
                        "color": {
                            "r": 255,
                            "g": 55,
                            "b": 0
                        },
                        "verticalAlign": "middle",
                        "speed": 30,
                        "isLeft": true
                    },
                    "layout": {
                        "ver": 1,
                        "left": 0,
                        "top": 0,
                        "width": 100,
                        "height": 10,
                        "zIndex": 0,
                        "rotate": 0
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 0,
                            "g": 255,
                            "b": 255
                        },
                        "width": 5,
                        "style": "solid",
                        "radius": 12,
                        "padding": 5,
                        "opacity": 70
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                },
                {
                    "ver": 1,
                    "type": 250,
                    "data": {
                        "ver": 1,
                        "images": [
                            {
                                "ver": 1,
                                "path": "images/08.jpg"
                            },
                            {
                                "ver": 1,
                                "path": "images/09.jpg"
                            },
                            {
                                "ver": 1,
                                "path": "images/10.jpg"
                            }
                        ],
                        "animation": {
                            "inId": 3,
                            "outId": 3
                        },
                        "stay": 3,
                        "duration": 1000
                    },
                    "layout": {
                        "ver": 1,
                        "left": 0,
                        "top": 10,
                        "width": 100,
                        "height": 55,
                        "zIndex": 0,
                        "rotate": 0
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 255,
                            "g": 255,
                            "b": 255
                        },
                        "width": 0,
                        "style": "solid",
                        "radius": 0,
                        "padding": 0,
                        "opacity": 100
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                },
                {
                    "ver": 1,
                    "type": 350,
                    "data": {
                        "ver": 1,
                        "videos": [
                            {
                                "ver": 1,
                                "path": "./media/01.mp4"
                            },
                            {
                                "ver": 1,
                                "path": "./media/03.mp4"
                            },
                            {
                                "ver": 1,
                                "path": "./media/06.mp4"
                            }
                        ],
                        "isMuted": false
                    },
                    "layout": {
                        "ver": 1,
                        "left": 0,
                        "top": 65,
                        "width": 100,
                        "height": 35,
                        "zIndex": -1,
                        "rotate": 0
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 255,
                            "g": 255,
                            "b": 255
                        },
                        "width": 0,
                        "style": "solid",
                        "radius": 0,
                        "padding": 0,
                        "opacity": 100
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                },
                {
                    "ver": 1,
                    "type": 200,
                    "data": {
                        "ver": 1,
                        "image": {
                            "ver": 1,
                            "path": "images/03.jpg"
                        }
                    },
                    "layout": {
                        "ver": 1,
                        "left": 3,
                        "top": 67,
                        "width": 12,
                        "height": 6,
                        "zIndex": 0,
                        "rotate": 0
                    },
                    "background": {
                        "ver": 1,
                        "type": 0,
                        "image": null,
                        "color": {
                            "r": 0,
                            "g": 0,
                            "b": 0
                        },
                        "opacity": 100
                    },
                    "border": {
                        "ver": 1,
                        "color": {
                            "r": 255,
                            "g": 0,
                            "b": 255
                        },
                        "width": 8,
                        "style": "solid",
                        "radius": 0,
                        "padding": 0,
                        "opacity": 100
                    },
                    "filter": {
                        "ver": 1,
                        "opacity": 100,
                        "brightness": 100,
                        "saturate": 100,
                        "contrast": 100,
                        "grayscale": 0,
                        "blur": 0,
                        "invert": 0,
                        "hueRotate": 0
                    }
                }
            ]
        }
    ]
};