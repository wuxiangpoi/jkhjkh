/* version:20171025 */
var kmsz = kmsz || {};


//节目解析器：面向对象版
(function (editor) {

    var getFontFamily = (function () {
        var fonts = [
            {id: 0, name: "系统默认", value: "inherit"},
            {id: 1, name: "宋体", value: "SimSun"},
            {id: 2, name: "黑体", value: "SimHei"},
            {id: 3, name: "微软雅黑", value: "Microsoft YaHei"},
            {id: 4, name: "楷体", value: "KaiTi"},
            {id: 5, name: "隶书", value: "LiSu"},
            {id: 6, name: "幼圆", value: "YouYuan"}
        ];
        return function (fontID) {
            var find = array_find(fonts, function (font) {
                return font.id === fontID;
            });
            return find ? find.value : fonts[0].value;
        };
    })();


    //获取格式化后的时间字符串
    var getDateTimeString = function (time, formatterID) {
        switch (formatterID) {
            case 1:
                return formatDate(time, "yyyy年MM月dd日 HH:mm:ss");
            case 2:
                return formatDate(time, "yyyy年MM月dd日");
            case 3:
                return formatDate(time, "HH:mm:ss");
            case 4:
                return formatDate(time, "yyyy年MM月dd日") + " 星期" + "日一二三四五六".substr(time.getDay() % 7, 1);
            default:
                return formatDate(time, "yyyy年MM月dd日 HH:mm:ss");
        }
    };


    //创建布局节点
    function createLayoutDOM(layout) {
        var dom = document.createElement('div');
        dom.classList.add('element-layout');

        switch (layout.ver) {
            case 1:
                (function () {
                    dom.style.left = layout.left + '%';
                    dom.style.top = layout.top + '%';
                    dom.style.width = layout.width + '%';
                    dom.style.height = layout.height + '%';
                    dom.style.zIndex = layout.zIndex;
                    if (layout.rotate % 360 !== 0) {//小优化
                        dom.style.webkitTransform
                            = dom.style.mozTransform
                            = dom.style.msTransform
                            = dom.style.oTransform
                            = dom.style.transform
                            = 'rotate(' + layout.rotate + 'deg)';
                    }
                })();
                break;
            default :
                (function () {
                    dom.style.left = '0';
                    dom.style.top = '0';
                    dom.style.width = '100%';
                    dom.style.height = '100%';
                    dom.style.zIndex = '0';
                })();
                break;
        }
        return dom;
    }

    //创建3D变换节点
    function createTransformDOM(transform) {
        var dom = document.createElement('div');
        dom.classList.add('element-transform');

        transform = transform || {};
        switch (transform.ver) {
            case 1:
                (function () {
                    //return;
                    var transform_strs = [];
                    if (transform.ps !== 0) {
                        transform_strs.push('perspective(' + transform.ps * 5 + 'em)');
                    }
                    if (transform.tx !== 0) {
                        transform_strs.push('translateX(' + transform.tx + '%)');
                    }
                    if (transform.ty !== 0) {
                        transform_strs.push('translateY(' + transform.ty + '%)');
                    }
                    if (transform.tz !== 0) {
                        transform_strs.push('translateZ(' + transform.tz + '%)');
                    }
                    if (transform.sx !== 1) {
                        transform_strs.push('scaleX(' + transform.sx + ')');
                    }
                    if (transform.sy !== 1) {
                        transform_strs.push('scaleY(' + transform.sy + ')');
                    }
                    if (transform.sz !== 1) {
                        transform_strs.push('scaleZ(' + transform.sz + ')');
                    }
                    if (transform.rx % 360 !== 0) {
                        transform_strs.push('rotateX(' + transform.rx + 'deg)');
                    }
                    if (transform.ry % 360 !== 0) {
                        transform_strs.push('rotateY(' + transform.ry + 'deg)');
                    }
                    if (transform.rz % 360 !== 0) {
                        transform_strs.push('rotateZ(' + transform.rz + 'deg)');
                    }
                    if (transform_strs.length !== 0) {//小优化
                        dom.style.webkitTransform
                            = dom.style.mozTransform
                            = dom.style.msTransform
                            = dom.style.oTransform
                            = dom.style.transform
                            = transform_strs.join(' ');
                    }
                })();
                break;
            default :
                break;
        }
        return dom;
    }

    //创建背景节点
    function createBackgroundDOM(background, border, imageUrlConverter) {
        var dom = document.createElement('div');
        dom.classList.add('element-background');

        switch (background.ver) {
            case 1:
                (function () {
                    if (background.type === 0) {//无背景
                        return;
                    } else if (background.type === 1) {//颜色背景
                        var color = background.color;
                        dom.style.background = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                    } else if (background.type === 2) {//图片背景
                        if (background.image) {
                            dom.style.background = "url('" + imageUrlConverter(background.image) + "') no-repeat scroll center center / 100% 100% border-box border-box";
                        }
                    }
                    dom.style.opacity = background.opacity / 100;
                    if (border) {
                        switch (border.ver) {
                            case 1:
                                dom.style.webkitBorderRadius
                                    = dom.style.mozBorderRadius
                                    = dom.style.borderRadius
                                    = border.radius / 10 + 'em';
                                break;
                            default :
                                break;
                        }
                    }
                })();
                break;
            default :
                break;
        }
        return dom;
    }

    //创建边框节点
    function createBorderDOM(border) {
        var dom = document.createElement('div');
        dom.classList.add('element-border');

        switch (border.ver) {
            case 1:
                (function () {
                    var color = border.color;
                    dom.style.border = border.style + ' ' + border.width / 10 + 'em rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + border.opacity / 100 + ')';
                    dom.style.padding = border.padding / 10 + 'em';
                    dom.style.webkitBorderRadius
                        = dom.style.mozBorderRadius
                        = dom.style.borderRadius
                        = border.radius / 10 + 'em';
                })();
                break;
            default :
                break;
        }
        return dom;
    }

    //创建滤镜节点
    function createFilterDOM(filter) {
        var dom = document.createElement('div');
        dom.classList.add('element-filter');

        switch (filter.ver) {
            case 1:
                (function () {
                    var filter_strs = [];
                    if (filter.opacity !== 100) {//透明度
                        filter_strs.push('opacity(' + filter.opacity + '%)');
                    }
                    if (filter.brightness !== 100) {//亮度
                        filter_strs.push('brightness(' + filter.brightness + '%)');
                    }
                    if (filter.contrast !== 100) {//对比度
                        filter_strs.push('contrast(' + filter.contrast + '%)');
                    }
                    if (filter.saturate !== 100) {//饱和度
                        filter_strs.push('saturate(' + filter.saturate + '%)');
                    }
                    if (filter.grayscale !== 0) {//灰度
                        filter_strs.push('grayscale(' + filter.grayscale + '%)');
                    }
                    if (filter.invert !== 0) {//反色
                        filter_strs.push('invert(' + filter.invert + '%)');
                    }
                    if (filter.blur !== 0) {//模糊
                        filter_strs.push('blur(' + filter.blur * 16 / 10 + 'px)');
                    }
                    if (filter.hueRotate % 360 !== 0) {//色相旋转
                        filter_strs.push('hue-rotate(' + filter.hueRotate + 'deg)');
                    }
                    if (filter_strs.length !== 0) {//小优化
                        dom.style.filter = filter_strs.join(' ');
                    }
                })();
                break;
            default :
                break;
        }
        return dom;
    }

    function createWidgetByType(type, data, imageUrlConverter, videoUrlConverter, originalPixel) {
        switch (type) {
            case 100:
                return new TextWidget(data);
            case 150:
                return new MarqueeWidget(data, originalPixel);
            case 160:
                return new TextMarqueeWidget(data, originalPixel);
            case 200:
                return new ImageWidget(data, imageUrlConverter);
            case 250:
                return new CarouselWidget(data, imageUrlConverter, originalPixel);
            case 300:
                return new VideoWidget(data, videoUrlConverter);
            case 350:
                return new SerieWidget(data, videoUrlConverter);
            case 500:
                return new TimeWidget(data);
            case 900:
                return new WebviewWidget(data);
            default :
                return null;
        }
    }


    function Widget() {
        var dom = document.createElement('div');
        dom.classList.add('element-full');

        this._dom = dom;
        this._startHandlers = [];
        this._stopHandlers = [];
        this._destroyHandlers = [];
        this._resizeHandlers = [];

        this.initialize.apply(this, arguments);
    }

    Widget.prototype = {
        getDOM: function () {
            return this._dom;
        },
        addStartHandler: function (handler) {
            this._startHandlers.push(handler);
        },
        removeStartHandler: function (handler) {
            array_remove(this._startHandlers, handler);
        },
        start: function () {
            var that = this;
            that._startHandlers.forEach(function (handler) {
                handler.call(that);
            });
        },
        addStopHandler: function (handler) {
            this._stopHandlers.push(handler);
        },
        removeStopHandler: function (handler) {
            array_remove(this._stopHandlers, handler);
        },
        stop: function () {
            var that = this;
            that._stopHandlers.forEach(function (handler) {
                handler.call(that);
            });
        },
        initialize: function () {

        },
        onDestroy: function (handler) {
            this._destroyHandlers.push(handler);
        },
        destroy: function () {
            var that = this;
            that._destroyHandlers.forEach(function (handler) {
                handler.call(that);
            });
            array_clear(that._destroyHandlers);
            that._dom = null;
        },
        onResize: function (handler) {
            this._resizeHandlers.push(handler);
        },
        resize: function () {
            var that = this;
            var args = arguments;
            that._resizeHandlers.forEach(function (handler) {
                handler.call(that, args);
            });
        }
    };

    Widget.prototype.constructor = Widget;


    var TextWidget = extend(Widget);
    (function (TextWidget) {
        TextWidget.prototype.initialize = function (data) {
            var that = this;
            switch (data.ver) {
                case 1:
                    (function () {
                        var dom = that.getDOM();
                        dom.classList.add('element-table');
                        dom.style.fontSize = data.size / 10 + 'em';

                        var domCell = document.createElement('div');
                        domCell.style.whiteSpace = data.isMultiple ? 'normal' : 'nowrap';
                        domCell.style.textAlign = data.horizontalAlign;
                        domCell.style.verticalAlign = data.verticalAlign;
                        dom.appendChild(domCell);

                        var color = data.color;
                        var valDOM = document.createElement('span');
                        valDOM.style.fontFamily = getFontFamily(data.font);
                        valDOM.style.color = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                        valDOM.textContent = data.value;
                        domCell.appendChild(valDOM);

                        that.onDestroy(function () {
                            domCell.removeChild(valDOM);
                            valDOM = null;
                            dom.removeChild(domCell);
                            domCell = null;
                        });
                    })();
                    break;
                default :
                    break;
            }
        };
    })(TextWidget);


    var TimeWidget = extend(Widget);
    (function (TimeWidget) {
        TimeWidget.prototype.initialize = function (data) {
            var that = this;

            switch (data.ver) {
                case 1:
                    (function () {
                        var dom = that.getDOM();
                        dom.classList.add('element-table');
                        dom.style.fontSize = data.size / 10 + 'em';

                        var domCell = document.createElement('div');
                        domCell.style.whiteSpace = 'nowrap';
                        domCell.style.textAlign = data.horizontalAlign;
                        domCell.style.verticalAlign = data.verticalAlign;
                        dom.appendChild(domCell);

                        var color = data.color;
                        var timeDOM = document.createElement('span');
                        timeDOM.style.fontFamily = getFontFamily(data.font);
                        timeDOM.style.color = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                        domCell.appendChild(timeDOM);

                        var timing = function () {
                            timeDOM.textContent = getDateTimeString(new Date(), data.formatter);
                        };

                        //页面切换走时计时器停止，回来时继续
                        var timer = null;
                        var startHandler = function () {
                            if (timer === null) {
                                timing();
                                timer = window.setInterval(timing, 997);
                            }
                        };
                        var stopHandler = function () {
                            if (timer !== null) {
                                window.clearInterval(timer);
                                timer = null;
                            }
                        };
                        that.addStartHandler(startHandler);
                        that.addStopHandler(stopHandler);

                        that.onDestroy(function () {
                            var that = this;
                            that.removeStopHandler(stopHandler);
                            that.removeStartHandler(startHandler);
                            stopHandler = null;
                            startHandler = null;
                            timing = null;

                            domCell.removeChild(timeDOM);
                            timeDOM = null;
                            dom.removeChild(domCell);
                            domCell = null;
                        });
                    })();
                    break;
                default :
                    break;
            }
        };
    })(TimeWidget);


    var TextMarqueeWidget = extend(Widget);
    (function (TextMarqueeWidget) {
        TextMarqueeWidget.prototype.initialize = function (data, originalPixel) {
            var that = this;

            switch (data.ver) {
                case 1:
                    (function () {
                        var dom = that.getDOM();
                        dom.classList.add('transform-will-change');
                        dom.classList.add('element-table');
                        dom.style.overflow = 'visible';
                        dom.style.fontSize = data.size / 10 + 'em';

                        var domCell = document.createElement('div');
                        domCell.style.whiteSpace = 'nowrap';
                        if (!data.isScroll) {
                            domCell.style.textAlign = data.horizontalAlign;
                        }
                        domCell.style.verticalAlign = data.verticalAlign;
                        dom.appendChild(domCell);

                        var domAnim = 'marquee-left-container';
                        var marqueeAnim = 'marquee-left-text';

                        var marqueeDOM = document.createElement('span');
                        marqueeDOM.classList.add('transform-will-change');
                        marqueeDOM.style.fontFamily = getFontFamily(data.font);
                        var color = data.color;
                        marqueeDOM.style.color = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                        marqueeDOM.textContent = data.value;
                        domCell.appendChild(marqueeDOM);

                        var startHandler = function () {
                            var timer = window.setTimeout(function () {
                                window.clearTimeout(timer);
                                timer = null;
                                //console.log(dom.clientWidth, dom.clientHeight);
                                //console.log(marqueeDOM.clientWidth, marqueeDOM.clientHeight);
                                var seconds = (dom.clientWidth + marqueeDOM.clientWidth) * 400 / data.speed / originalPixel;
                                dom.style.webkitAnimation
                                    = dom.style.mozAnimation
                                    = dom.style.oAnimation
                                    = dom.style.animation
                                    = domAnim + ' ' + seconds + 's linear infinite';
                                marqueeDOM.style.webkitAnimation
                                    = marqueeDOM.style.mozAnimation
                                    = marqueeDOM.style.oAnimation
                                    = marqueeDOM.style.animation
                                    = marqueeAnim + ' ' + seconds + 's linear infinite';
                            }, 0);
                        };

                        var stopHandler = function () {
                            dom.style.webkitAnimation
                                = dom.style.mozAnimation
                                = dom.style.oAnimation
                                = dom.style.animation
                                = '';
                            marqueeDOM.style.webkitAnimation
                                = marqueeDOM.style.mozAnimation
                                = marqueeDOM.style.oAnimation
                                = marqueeDOM.style.animation
                                = '';
                        };

                        if (data.isScroll) {
                            marqueeDOM.style.display = 'inline-block';
                            marqueeDOM.style.webkitTransform
                                = marqueeDOM.style.mozTransform
                                = marqueeDOM.style.transform
                                = 'translateX(-100%)';
                            that.addStartHandler(startHandler);
                            that.addStopHandler(stopHandler);
                        }


                        that.onDestroy(function () {
                            var that = this;
                            if (data.isScroll) {
                                that.removeStopHandler(stopHandler);
                                that.removeStartHandler(startHandler);
                            }
                            stopHandler = null;
                            startHandler = null;

                            domCell.removeChild(marqueeDOM);
                            marqueeDOM = null;
                            dom.removeChild(domCell);
                            domCell = null;
                        });

                    })();
                    break;
                default :
                    break;
            }
        };
    })(TextMarqueeWidget);


    var MarqueeWidget = extend(Widget);
    (function (MarqueeWidget) {
        MarqueeWidget.prototype.initialize = function (data, originalPixel) {
            var that = this;

            switch (data.ver) {
                case 1:
                    (function () {
                        var dom = that.getDOM();
                        dom.classList.add('transform-will-change');
                        dom.classList.add('element-table');
                        dom.style.overflow = 'visible';
                        dom.style.fontSize = data.size / 10 + 'em';

                        var domCell = document.createElement('div');
                        domCell.style.whiteSpace = 'nowrap';
                        domCell.style.verticalAlign = data.verticalAlign;
                        dom.appendChild(domCell);

                        var domAnim = data.isLeft ? 'marquee-left-container' : 'marquee-right-container';
                        var marqueeAnim = data.isLeft ? 'marquee-left-text' : 'marquee-right-text';

                        var marqueeDOM = document.createElement('span');
                        marqueeDOM.classList.add('transform-will-change');
                        marqueeDOM.style.fontFamily = getFontFamily(data.font);
                        var color = data.color;
                        marqueeDOM.style.color = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
                        marqueeDOM.style.display = 'inline-block';
                        marqueeDOM.style.webkitTransform
                            = marqueeDOM.style.mozTransform
                            = marqueeDOM.style.transform
                            = 'translateX(-100%)';
                        marqueeDOM.textContent = data.value;
                        domCell.appendChild(marqueeDOM);

                        var startHandler = function () {
                            var timer = window.setTimeout(function () {
                                window.clearTimeout(timer);
                                timer = null;
                                //console.log(dom.clientWidth, dom.clientHeight);
                                //console.log(marqueeDOM.clientWidth, marqueeDOM.clientHeight);
                                var seconds = (dom.clientWidth + marqueeDOM.clientWidth) * 400 / data.speed / originalPixel;
                                dom.style.webkitAnimation
                                    = dom.style.mozAnimation
                                    = dom.style.oAnimation
                                    = dom.style.animation
                                    = domAnim + ' ' + seconds + 's linear infinite';
                                marqueeDOM.style.webkitAnimation
                                    = marqueeDOM.style.mozAnimation
                                    = marqueeDOM.style.oAnimation
                                    = marqueeDOM.style.animation
                                    = marqueeAnim + ' ' + seconds + 's linear infinite';
                            }, 0);
                        };

                        var stopHandler = function () {
                            dom.style.webkitAnimation
                                = dom.style.mozAnimation
                                = dom.style.oAnimation
                                = dom.style.animation
                                = '';
                            marqueeDOM.style.webkitAnimation
                                = marqueeDOM.style.mozAnimation
                                = marqueeDOM.style.oAnimation
                                = marqueeDOM.style.animation
                                = '';
                        };

                        that.addStartHandler(startHandler);
                        that.addStopHandler(stopHandler);

                        that.onDestroy(function () {
                            var that = this;
                            that.removeStopHandler(stopHandler);
                            that.removeStartHandler(startHandler);
                            stopHandler = null;
                            startHandler = null;

                            domCell.removeChild(marqueeDOM);
                            marqueeDOM = null;
                            dom.removeChild(domCell);
                            domCell = null;
                        });

                    })();
                    break;
                default :
                    break;
            }
        };
    })(MarqueeWidget);


    var ImageWidget = extend(Widget);
    (function (ImageWidget) {
        ImageWidget.prototype.initialize = function (data, imageUrlConverter) {
            var that = this;
            switch (data.ver) {
                case 1:
                    (function () {
                        if (data.image) {
                            var dom = that.getDOM();
                            var imgDOM = document.createElement('img');
                            imgDOM.classList.add('element-full');
                            imgDOM.src = imageUrlConverter(data.image);
                            dom.appendChild(imgDOM);

                            that.onDestroy(function () {
                                dom.removeChild(imgDOM);
                                imgDOM.src = '';
                                imgDOM = null;
                            });
                        }
                    })();
                    break;
                default :
                    break;
            }
        };
    })(ImageWidget);


    var CarouselWidget = extend(Widget);
    (function (CarouselWidget) {
        CarouselWidget.prototype.initialize = function (data, imageUrlConverter, originalPixel) {
            var that = this;

            var inAnims = [
                {id: 1, name: "右入", value: "right-slide-in"},
                {id: 2, name: "左入", value: "left-slide-in"},
                {id: 3, name: "上入", value: "top-slide-in"},
                {id: 4, name: "下入", value: "bottom-slide-in"},
                {id: 5, name: "淡入", value: "fade-in"},
                {id: 6, name: "旋入", value: "rotateY-in"}
            ];
            var outAnims = [
                {id: 1, name: "左出", value: "left-slide-out"},
                {id: 2, name: "右出", value: "right-slide-out"},
                {id: 3, name: "下出", value: "bottom-slide-out"},
                {id: 4, name: "上出", value: "top-slide-out"},
                {id: 5, name: "淡出", value: "fade-out"},
                {id: 6, name: "旋出", value: "rotateY-out"}
            ];


            function createImageDOM() {
                var imgDOM = document.createElement('img');
                imgDOM.classList.add('element-full');
                imgDOM.classList.add('element-absolute');
                imgDOM.classList.add('backface_hidden');
                imgDOM.classList.add('transform-will-change');
                imgDOM.classList.add('hidden');
                return imgDOM;
            }

            switch (data.ver) {
                case 1:
                    (function () {
                        var dom = that.getDOM();
                        dom.classList.add('element-relative');
                        dom.classList.add('preserve_3d');
                        dom.style.webkitPerspective
                            = dom.style.mozPerspective
                            = dom.style.perspective = originalPixel / 2 + 'px';

                        if (data.images.length === 0) {
                            return;
                        }

                        if (data.images.length === 1) {
                            (function () {
                                var imgDOM = createImageDOM();
                                imgDOM.classList.remove('hidden');
                                imgDOM.src = imageUrlConverter(data.images[0]);
                                dom.appendChild(imgDOM);

                                that.onDestroy(function () {
                                    dom.removeChild(imgDOM);
                                    imgDOM.src = '';
                                    imgDOM = null;
                                });
                            })();
                        } else {
                            (function () {
                                var inAnim = array_find(inAnims, function (item) {
                                    return item.id === data.animation.inId;
                                }) || inAnims[0];
                                var outAnim = array_find(outAnims, function (item) {
                                    return item.id === data.animation.outId;
                                }) || outAnims[0];
                                var imageQueue = new CycleQueue(data.images, true);

                                var prevImageDOM = createImageDOM();
                                var curImageDOM = createImageDOM();
                                var nextImageDOM = createImageDOM();
                                prevImageDOM.src = imageUrlConverter(imageQueue.prev());
                                curImageDOM.src = imageUrlConverter(imageQueue.next());
                                nextImageDOM.src = imageUrlConverter(imageQueue.next());
                                dom.appendChild(prevImageDOM);
                                dom.appendChild(curImageDOM);
                                dom.appendChild(nextImageDOM);

                                curImageDOM.classList.remove('hidden');

                                var playing = function () {
                                    prevImageDOM.classList.add('hidden');
                                    prevImageDOM.style.webkitAnimation
                                        = prevImageDOM.style.mozAnimation
                                        = prevImageDOM.style.oAnimation
                                        = prevImageDOM.style.animation
                                        = '';
                                    prevImageDOM.src = imageUrlConverter(imageQueue.next());
                                    curImageDOM.style.webkitAnimation
                                        = curImageDOM.style.mozAnimation
                                        = curImageDOM.style.oAnimation
                                        = curImageDOM.style.animation
                                        = outAnim.value + ' ' + data.duration + 'ms forwards';
                                    nextImageDOM.style.webkitAnimation
                                        = nextImageDOM.style.mozAnimation
                                        = nextImageDOM.style.oAnimation
                                        = nextImageDOM.style.animation
                                        = inAnim.value + ' ' + data.duration + 'ms forwards';
                                    nextImageDOM.classList.remove('hidden');

                                    var cacheImageDOM = prevImageDOM;
                                    prevImageDOM = curImageDOM;
                                    curImageDOM = nextImageDOM;
                                    nextImageDOM = cacheImageDOM;
                                };

                                //场景调度时计时器启/停
                                var timer = null;
                                var startHandler = function () {
                                    if (timer === null) {
                                        //playing();
                                        timer = window.setInterval(playing, data.stay * 1000 + data.duration);
                                    }
                                };
                                var stopHandler = function () {
                                    if (timer !== null) {
                                        window.clearInterval(timer);
                                        timer = null;
                                    }
                                };
                                that.addStartHandler(startHandler);
                                that.addStopHandler(stopHandler);

                                that.onDestroy(function () {
                                    var that = this;
                                    that.removeStopHandler(stopHandler);
                                    that.removeStartHandler(startHandler);
                                    stopHandler = null;
                                    startHandler = null;
                                    playing = null;

                                    dom.removeChild(nextImageDOM);
                                    dom.removeChild(curImageDOM);
                                    dom.removeChild(prevImageDOM);
                                    nextImageDOM.src = '';
                                    curImageDOM.src = '';
                                    prevImageDOM.src = '';
                                    nextImageDOM = null;
                                    curImageDOM = null;
                                    prevImageDOM = null;
                                });
                            })();
                        }
                    })();
                    break;
                default :
                    break;
            }

        };
    })(CarouselWidget);


    var VideoWidget = extend(Widget);
    (function (VideoWidget) {
        VideoWidget.prototype.initialize = function (data, videoUrlConverter) {
            var that = this;

            switch (data.ver) {
                case 1:
                    (function () {
                        if (data.video) {
                            var dom = that.getDOM();
                            var videoDOM = document.createElement('video');
                            videoDOM.classList.add('element-full');
                            videoDOM.classList.add('element-video-fill');
                            videoDOM.setAttribute('preload', 'auto');
                            videoDOM.setAttribute('webkit-playsinline', '');
                            videoDOM.loop = true;
                            videoDOM.muted = data.isMuted;
                            dom.appendChild(videoDOM);

                            videoDOM.src = videoUrlConverter(data.video);
                            videoDOM.load();

                            //场景切换时视频调度
                            var startHandler = function () {
                                try {
                                    videoDOM.play();
                                } catch (e) {
                                    videoDOM.load();
                                    videoDOM.play();
                                }
                            };
                            var stopHandler = function () {
                                //videoDOM.load();
                                videoDOM.pause();
                            };
                            that.addStartHandler(startHandler);
                            that.addStopHandler(stopHandler);

                            that.onDestroy(function () {
                                var that = this;
                                that.removeStopHandler(stopHandler);
                                that.removeStartHandler(startHandler);
                                stopHandler = null;
                                startHandler = null;

                                dom.removeChild(videoDOM);
                                videoDOM.src = '';
                                videoDOM = null;
                            });
                        }
                    })();
                    break;
                default :
                    break;
            }
        };
    })(VideoWidget);


    var SerieWidget = extend(Widget);
    (function (SerieWidget) {
        SerieWidget.prototype.initialize = function (data, videoUrlConverter) {
            var that = this;

            function createVideoDOM() {
                var videoDOM = document.createElement('video');
                videoDOM.classList.add('element-full');
                videoDOM.classList.add('element-video-fill');
                videoDOM.classList.add('hidden2');
                videoDOM.setAttribute('preload', 'auto');
                videoDOM.setAttribute('webkit-playsinline', '');
                return videoDOM;
            }

            switch (data.ver) {
                case 1:
                    (function () {
                        if (data.videos.length === 0) {
                            return;
                        }

                        var dom = that.getDOM();
                        if (data.videos.length === 1) {//只有一个视频
                            (function () {
                                var videoDOM = createVideoDOM();
                                videoDOM.classList.remove('hidden2');
                                videoDOM.loop = true;
                                videoDOM.muted = data.isMuted;
                                dom.appendChild(videoDOM);

                                var onPlay = function () {
                                    this.removeEventListener('error', onLoadError);
                                };

                                var onPlayError = function (e) {
                                    //console.log('error', e);
                                    var errorMSG = e.target.error ? e.target.error.message : '未知';
                                    kmsz.util.toast('播放出错:' + errorMSG + ':' + e.target.currentSrc, 5000);

                                    videoDOM.load();
                                    videoDOM.play();
                                };

                                var onLoadError = function (e) {
                                    var errorMSG = e.target.error ? e.target.error.message : '未知';
                                    kmsz.util.toast('加载错误:' + errorMSG + ':' + e.target.currentSrc, 5000);
                                };

                                //场景切换时视频调度
                                var startHandler = function () {
                                    videoDOM.addEventListener('error', onPlayError);
                                    try {
                                        videoDOM.play();
                                    } catch (e) {
                                        videoDOM.load();
                                        videoDOM.play();
                                    }
                                };
                                var stopHandler = function () {
                                    videoDOM.removeEventListener('error', onPlayError);
                                    videoDOM.pause();
                                };

                                videoDOM.addEventListener('error', onLoadError);
                                videoDOM.src = videoUrlConverter(data.videos[0]);

                                videoDOM.addEventListener('play', onPlay);

                                that.addStartHandler(startHandler);
                                that.addStopHandler(stopHandler);

                                that.onDestroy(function () {
                                    var that = this;
                                    that.removeStopHandler(stopHandler);
                                    that.removeStartHandler(startHandler);

                                    videoDOM.removeEventListener('play', onPlay);
                                    videoDOM.removeEventListener('error', onLoadError);

                                    stopHandler = null;
                                    startHandler = null;
                                    onLoadError = null;
                                    onPlayError = null;
                                    onPlay = null;

                                    dom.removeChild(videoDOM);
                                    //videoDOM.src = '';
                                    videoDOM = null;
                                });
                            })();
                        } else {//两个或以上视频
                            (function () {
                                var videoQueue = new CycleQueue(data.videos, false);

                                var curVideoDOM = createVideoDOM();
                                curVideoDOM.muted = data.isMuted;
                                dom.appendChild(curVideoDOM);
                                var nextVideoDOM = createVideoDOM();
                                nextVideoDOM.muted = data.isMuted;
                                dom.appendChild(nextVideoDOM);

                                var onCurrentPlay = function () {
                                    this.removeEventListener('error', onLoadError);
                                    nextVideoDOM.addEventListener('error', onLoadError);
                                    nextVideoDOM.src = videoUrlConverter(videoQueue.next());
                                };
                                var onCurrentEnded = function () {
                                    this.removeEventListener('error', onCurrentPlayError);
                                    nextVideoDOM.addEventListener('error', onNextPlayError);
                                    try {
                                        nextVideoDOM.play();
                                    } catch (e) {
                                        nextVideoDOM.load();
                                        nextVideoDOM.play();
                                    }
                                    nextVideoDOM.classList.remove('hidden2');
                                    this.classList.add('hidden2');
                                };

                                var onNextPlay = function () {
                                    this.removeEventListener('error', onLoadError);
                                    curVideoDOM.addEventListener('error', onLoadError);
                                    curVideoDOM.src = videoUrlConverter(videoQueue.next());
                                };
                                var onNextEnded = function () {
                                    this.removeEventListener('error', onNextPlayError);
                                    curVideoDOM.addEventListener('error', onCurrentPlayError);
                                    try {
                                        curVideoDOM.play();
                                    } catch (e) {
                                        curVideoDOM.load();
                                        curVideoDOM.play();
                                    }
                                    curVideoDOM.classList.remove('hidden2');
                                    this.classList.add('hidden2');
                                };

                                var onCurrentPlayError = function (e) {
                                    //console.log('error', e);
                                    var errorMSG = e.target.error ? e.target.error.message : '未知';
                                    kmsz.util.toast('播放出错:' + errorMSG + ':' + e.target.currentSrc, 5000);
                                    onCurrentEnded.call(this);
                                };
                                var onNextPlayError = function (e) {
                                    //console.log('error', e);
                                    var errorMSG = e.target.error ? e.target.error.message : '未知';
                                    kmsz.util.toast('播放出错:' + errorMSG + ':' + e.target.currentSrc, 5000);
                                    onNextEnded.call(this);
                                };

                                var onLoadError = function (e) {
                                    var errorMSG = e.target.error ? e.target.error.message : '未知';
                                    kmsz.util.toast('加载错误:' + errorMSG + ':' + e.target.currentSrc, 5000);
                                    this.src = videoUrlConverter(videoQueue.next());
                                };

                                var startHandler = function () {
                                    curVideoDOM.addEventListener('error', onCurrentPlayError);
                                    try {
                                        curVideoDOM.play();
                                    } catch (e) {
                                        curVideoDOM.load();
                                        curVideoDOM.play();
                                    }
                                    curVideoDOM.classList.remove('hidden2');
                                };
                                var stopHandler = function () {
                                    curVideoDOM.removeEventListener('error', onCurrentPlayError);
                                    nextVideoDOM.removeEventListener('error', onNextPlayError);
                                    curVideoDOM.removeEventListener('error', onLoadError);
                                    nextVideoDOM.removeEventListener('error', onLoadError);
                                    curVideoDOM.pause();
                                    nextVideoDOM.pause();
                                };

                                curVideoDOM.addEventListener('error', onLoadError);
                                curVideoDOM.src = videoUrlConverter(videoQueue.current());

                                curVideoDOM.addEventListener('play', onCurrentPlay);
                                curVideoDOM.addEventListener('ended', onCurrentEnded);
                                nextVideoDOM.addEventListener('play', onNextPlay);
                                nextVideoDOM.addEventListener('ended', onNextEnded);

                                that.addStartHandler(startHandler);
                                that.addStopHandler(stopHandler);

                                that.onDestroy(function () {
                                    var that = this;
                                    that.removeStopHandler(stopHandler);
                                    that.removeStartHandler(startHandler);

                                    nextVideoDOM.removeEventListener('ended', onNextEnded);
                                    nextVideoDOM.removeEventListener('play', onNextPlay);
                                    curVideoDOM.removeEventListener('ended', onCurrentEnded);
                                    curVideoDOM.removeEventListener('play', onCurrentPlay);

                                    stopHandler = null;
                                    startHandler = null;
                                    onLoadError = null;
                                    onNextPlayError = null;
                                    onCurrentPlayError = null;
                                    onNextEnded = null;
                                    onNextPlay = null;
                                    onCurrentEnded = null;
                                    onCurrentPlay = null;

                                    dom.removeChild(nextVideoDOM);
                                    //nextVideoDOM.src = '';
                                    nextVideoDOM = null;
                                    dom.removeChild(curVideoDOM);
                                    //curVideoDOM.src = '';
                                    curVideoDOM = null;
                                });
                            })();
                        }
                    })();
                    break;
                default :
                    break;
            }
        };
    })(SerieWidget);

    var WebviewWidget = extend(Widget);
    (function (WebviewWidget) {
        WebviewWidget.prototype.initialize = function (data) {
            var that = this;
            switch (data.ver) {
                case 1:
                    (function () {
                        if (data.url) {
                            var dom = that.getDOM();
                            var ifrDOM = document.createElement('iframe');
                            ifrDOM.setAttribute('frameborder', '0');
                            ifrDOM.setAttribute('scrolling', 'auto');
                            ifrDOM.classList.add('element-full');
                            ifrDOM.src = data.url;
                            dom.appendChild(ifrDOM);

                            if (data.autoRefresh) {
                                var timing = function () {
                                    ifrDOM.src = data.url;
                                };

                                //页面切换走时计时器停止，回来时继续
                                var timer = null;
                                var startHandler = function () {
                                    if (timer === null) {
                                        timer = window.setInterval(timing, data.refreshInterval * 1000);
                                    }
                                };
                                var stopHandler = function () {
                                    if (timer !== null) {
                                        window.clearInterval(timer);
                                        timer = null;
                                    }
                                };
                                that.addStartHandler(startHandler);
                                that.addStopHandler(stopHandler);
                            }

                            that.onDestroy(function () {
                                var that = this;
                                if (data.autoRefresh) {
                                    that.removeStopHandler(stopHandler);
                                    that.removeStartHandler(startHandler);
                                    stopHandler = null;
                                    startHandler = null;
                                    timing = null;
                                }

                                ifrDOM.src = 'about:blank';
                                try {
                                    ifrDOM.contentWindow.document.write('');
                                    ifrDOM.contentWindow.document.clear();
                                } catch (e) {
                                }
                                dom.removeChild(ifrDOM);
                                ifrDOM = null;
                            });
                        }
                    })();
                    break;
                default :
                    break;
            }
        };
    })(WebviewWidget);

    function Box(ele, imageUrlConverter, videoUrlConverter, originalPixel) {
        var dom = null;
        var widget = null;
        var destroyHandler = null;
        switch (ele.ver) {
            case 1:
                (function () {
                    var layoutDOM = createLayoutDOM(ele.layout);
                    var transformDOM = createTransformDOM(ele.transform);
                    var backgroundDOM = createBackgroundDOM(ele.background, ele.border, imageUrlConverter);
                    var borderDOM = createBorderDOM(ele.border);
                    var filterDOM = createFilterDOM(ele.filter);

                    layoutDOM.appendChild(transformDOM);
                    transformDOM.appendChild(backgroundDOM);
                    transformDOM.appendChild(borderDOM);
                    borderDOM.appendChild(filterDOM);

                    dom = layoutDOM;
                    widget = createWidgetByType(ele.type, ele.data, imageUrlConverter, videoUrlConverter, originalPixel);
                    if (widget) {
                        filterDOM.appendChild(widget.getDOM());
                    }

                    destroyHandler = function () {
                        var that = this;
                        if (widget) {
                            filterDOM.removeChild(widget.getDOM());
                            widget.destroy();
                            widget = that._widget = null;
                        }
                        dom = that._dom = null;

                        borderDOM.removeChild(filterDOM);
                        transformDOM.removeChild(borderDOM);
                        transformDOM.removeChild(backgroundDOM);
                        layoutDOM.removeChild(transformDOM);
                        filterDOM = null;
                        borderDOM = null;
                        backgroundDOM = null;
                        transformDOM = null;
                        layoutDOM = null;
                    };
                })();
                break;
            default :
                break;
        }
        this._dom = dom;
        this._widget = widget;
        this._destroyHandler = destroyHandler;
    }

    Box.prototype = {
        getDOM: function () {
            return this._dom;
        },
        getWidget: function () {
            return this._widget;
        },
        destroy: function () {
            if (this._destroyHandler) {
                this._destroyHandler.call(this);
                this._destroyHandler = null;
            }
        }
    };

    Box.prototype.constructor = Box;


    function Scene() {
        var dom = document.createElement('li');
        dom.classList.add('page-view');

        this._dom = dom;
        this._page = null;
        this._startHandlers = [];
        this._stopHandlers = [];
        this._isStart = false;
        this._boxs = [];
        this._destroyHandler = null;
        this._imageUrlConverter = null;
        this._videoUrlConverter = null;
        this._originalPixel = 1920;

        this.hide();
    }

    Scene.prototype = {
        getDOM: function () {
            return this._dom;
        },
        show: function () {
            this.getDOM().classList.remove('hidden');
        },
        hide: function () {
            this.getDOM().classList.add('hidden');
        },
        setImageUrlConverter: function (converter) {
            this._imageUrlConverter = converter;
        },
        getImageUrlConverter: function () {
            return this._imageUrlConverter;
        },
        setVideoUrlConverter: function (converter) {
            this._videoUrlConverter = converter;
        },
        getVideoUrlConverter: function () {
            return this._videoUrlConverter;
        },
        setOriginalPixel: function (originalPixel) {
            this._originalPixel = originalPixel;
        },
        getOriginalPixel: function () {
            return this._originalPixel;
        },
        addStartHandler: function (handler) {
            this._startHandlers.push(handler);
        },
        removeStartHandler: function (handler) {
            array_remove(this._startHandlers, handler);
        },
        start: function () {
            var that = this;
            if (that._page === null) {
                console.error('start 方法执行之前必须先调用 load 方法！');
                return;
            }

            that._boxs.forEach(function (box) {
                var widget = box.getWidget();
                if (widget) {
                    widget.start();
                }
            });

            that._startHandlers.forEach(function (handler) {
                handler.call(that);
            });
        },
        addStopHandler: function (handler) {
            this._stopHandlers.push(handler);
        },
        removeStopHandler: function (handler) {
            array_remove(this._stopHandlers, handler);
        },
        stop: function () {
            var that = this;

            that._boxs.forEach(function (box) {
                var widget = box.getWidget();
                if (widget) {
                    widget.stop();
                }
            });

            that._stopHandlers.forEach(function (handler) {
                handler.call(that);
            });
        },
        load: function (page) {
            var that = this;
            if (that._page === null) {
                var dom = that.getDOM();

                switch (page.ver) {
                    case 1:
                        (function () {
                            //填充背景
                            var backgroundDOM = createBackgroundDOM(page.background, null, that.getImageUrlConverter());
                            dom.appendChild(backgroundDOM);

                            //填充元素集合
                            var boxsDOM = document.createElement('div');
                            boxsDOM.classList.add('page-elements');
                            dom.appendChild(boxsDOM);

                            page.elements.forEach(function (ele) {
                                var box = new Box(ele, that.getImageUrlConverter(), that.getVideoUrlConverter(), that.getOriginalPixel());
                                var boxDOM = box.getDOM();
                                if (boxDOM) {
                                    boxsDOM.appendChild(boxDOM);
                                }
                                that._boxs.push(box);
                            });

                            //定义销毁时执行的方法，用于清理内存
                            that._destroyHandler = function () {
                                var that = this;
                                that._boxs.forEach(function (box) {
                                    var boxDOM = box.getDOM();
                                    if (boxDOM) {
                                        boxsDOM.removeChild(boxDOM);
                                    }
                                    box.destroy();
                                });
                                array_clear(that._boxs);

                                dom.removeChild(boxsDOM);
                                boxsDOM = null;
                                dom.removeChild(backgroundDOM);
                                backgroundDOM = null;
                            };
                        })();
                        break;
                    default :
                        break
                }

                that._page = page;
            }
        },
        destroy: function () {
            var that = this;

            if (that._page !== null) {
                that._page = null;

                if (that._destroyHandler) {
                    that._destroyHandler.call(that);
                    that._destroyHandler = null;
                }
            }
        },
        appendTo: function (node) {
            node.appendChild(this.getDOM());
        },
        resize: function () {
            var args = arguments;
            this._boxs.forEach(function (box) {
                var widget = box.getWidget();
                if (widget) {
                    widget.resize.call(widget, args);
                }
            });
        }
    };

    Scene.prototype.constructor = Scene;


    //解析器
    function Parser() {
        var screenDOM = document.createElement('div');
        screenDOM.classList.add('qmedia-editor-parser');
        var programDOM = document.createElement('ul');
        programDOM.classList.add('program-container');
        screenDOM.appendChild(programDOM);

        this._screenDOM = screenDOM;
        this._programDOM = programDOM;
        this._pixelHorizontal = 1920;
        this._pixelVertical = 1080;
        this._keepScale = false;
        this._autoRotate = false;
        this._imageUrlConverter = defaultConverter;
        this._videoUrlConverter = defaultConverter;

        this._canvas = null;
        this._scenes = [];
        this._destroyHandlers = [];

        function defaultConverter(data) {
            return data;
        }
    }

    Parser.prototype = {
        setPixelHorizontal: function (pixelHorizontal) {
            this._pixelHorizontal = pixelHorizontal;
        },
        setPixelVertical: function (pixelVertical) {
            this._pixelVertical = pixelVertical;
        },
        setKeepScale: function (bool) {
            this._keepScale = bool;
        },
        setAutoScale: function (bool) {
            this._autoRotate = bool;
        },
        setImageUrlConverter: function (converter) {
            this._imageUrlConverter = converter;
        },
        getImageUrlConverter: function () {
            return this._imageUrlConverter;
        },
        setVideoUrlConverter: function (converter) {
            this._videoUrlConverter = converter;
        },
        getVideoUrlConverter: function () {
            return this._videoUrlConverter;
        },
        inflate: function (canvas, pages) {
            var that = this;

            if (pages.length === 0) {
                return;
            }

            function createScene() {
                var scene = new Scene();
                scene.setImageUrlConverter(that.getImageUrlConverter());
                scene.setVideoUrlConverter(that.getVideoUrlConverter());
                scene.setOriginalPixel(that._pixelHorizontal > that._pixelVertical ? that._pixelHorizontal : that._pixelVertical);
                return scene;
            }

            if (pages.length === 1) {//只有一个场景
                (function () {
                    var scene = createScene();
                    that._programDOM.appendChild(scene.getDOM());
                    that._scenes.push(scene);

                    scene.load(pages[0]);
                    scene.show();
                    scene.start();

                    that.onDestroy(function () {
                        var that = this;
                        scene.stop();
                        scene.hide();
                        scene.destroy();
                        array_remove(that._scenes, scene);
                        that._programDOM.removeChild(scene.getDOM());
                    });
                })();
            } else {//两个或以上场景
                (function () {
                    var pageQueue = new CycleQueue(pages, false);
                    var curScene = createScene();
                    var nextScene = createScene();
                    that._programDOM.appendChild(curScene.getDOM());
                    that._programDOM.appendChild(nextScene.getDOM());
                    that._scenes.push(curScene);
                    that._scenes.push(nextScene);

                    var curPage = pageQueue.current();
                    var nextPage = pageQueue.next();
                    curScene.load(curPage);
                    curScene.show();
                    curScene.start();
                    nextScene.load(nextPage);

                    var timer = window.setTimeout(function () {
                        curPage = nextPage;
                        nextPage = pageQueue.next();

                        var cacheScene = curScene;
                        curScene = nextScene;
                        nextScene = cacheScene;

                        curScene.show();
                        curScene.start();

                        nextScene.stop();
                        nextScene.hide();
                        var timer2 = window.setTimeout(function () {
                            window.clearTimeout(timer2);
                            timer2 = null;
                            nextScene.destroy();
                            nextScene.load(nextPage);
                        }, 0);

                        timer = window.setTimeout(arguments.callee, curPage.stay * 1000);

                    }, curPage.stay * 1000);


                    that.onDestroy(function () {
                        window.clearTimeout(timer);
                        timer = null;

                        var that = this;

                        nextScene.destroy();
                        curScene.stop();
                        curScene.hide();
                        curScene.destroy();

                        array_remove(that._scenes, nextScene);
                        array_remove(that._scenes, curScene);
                        that._programDOM.removeChild(nextScene.getDOM());
                        that._programDOM.removeChild(curScene.getDOM());
                    });
                })();
            }

            that._canvas = canvas;
            //canvas.appendChild(that._screenDOM);
            canvas.insertBefore(that._screenDOM, canvas.firstChild);

            that.onDestroy(function () {
                var that = this;
                canvas.removeChild(that._screenDOM);
                that._canvas = null;
            });
        },
        onDestroy: function (handler) {
            this._destroyHandlers.push(handler);
        },
        destroy: function () {
            var that = this;
            that._destroyHandlers.forEach(function (handler) {
                handler.call(that);
            });
            array_clear(that._destroyHandlers);
        },
        resize: function (clientWidth, clientHeight) {
            var pixelHorizontal = this._pixelHorizontal;
            var pixelVertical = this._pixelVertical;
            var keepScale = this._keepScale;
            var autoRotate = this._autoRotate;

            var width = pixelHorizontal;
            var height = pixelVertical;
            var scaleX = clientWidth / width;
            var scaleY = clientHeight / height;

            var shouldRotate = false;//指示实际是否应发生旋转
            if (autoRotate) {//自动旋转
                //只有节目横竖屏和屏幕横竖屏不一致时才旋转
                if ((pixelHorizontal > pixelVertical && clientWidth < clientHeight)
                    || (pixelHorizontal < pixelVertical && clientWidth > clientHeight)) {
                    scaleX = clientWidth / height;
                    scaleY = clientHeight / width;
                    shouldRotate = true;
                }
            }

            if (keepScale) {//保持比例
                //取较小的比例值
                if (scaleX > scaleY) {
                    scaleX = scaleY;
                } else {
                    scaleY = scaleX;
                }
            }

            var transformStyleValue = 'translate3d(-50%,-50%,0) scale(' + (scaleX + ',' + scaleY) + ')';
            if (shouldRotate) {
                transformStyleValue += ' rotate(90deg)';
            }

            var programDOM = this._programDOM;
            programDOM.style.width = width + 'px';
            programDOM.style.height = height + 'px';
            programDOM.style.fontSize = (pixelHorizontal > pixelVertical ? pixelHorizontal : pixelVertical) / 100 + 'px';
            programDOM.style.webkitTransform
                = programDOM.style.mozTransform
                = programDOM.style.msTransform
                = programDOM.style.oTransform
                = programDOM.style.transform
                = transformStyleValue;

            this._scenes.forEach(function (scene) {
                scene.resize();
            });
        }
    };

    Parser.prototype.constructor = Parser;

    editor.Parser = Parser;


    //循环队列
    var CycleQueue = (function () {
        function CycleQueue(arr, isClone) {
            if (isClone === true) {
                var newArr = [];
                for (var i = 0, len = arr.length; i < len; i++) {
                    newArr.push(arr[i]);
                }
                this._arr = newArr;
            } else {
                this._arr = arr;
            }
            this._index = 0;
        }

        CycleQueue.prototype = {
            getIndex: function () {//获取指针位置
                return this._index;
            },
            setIndex: function (index) {//设置指针位置
                var len = this._arr.length;
                this._index = (index % len + len) % len;
            },
            prev: function () {//取前一个，并将指针前移
                return this.skipPrev(1);
            },
            skipPrev: function (step) {//向前跳几步
                return this.skipNext(-step);
            },
            next: function () {//取后一个，并将指针后移
                return this.skipNext(1);
            },
            skipNext: function (step) {//向后跳几步
                var arr = this._arr;
                var len = arr.length;
                var index = this._index = ((this._index + step) % len + len) % len;
                return arr[index];
            },
            current: function () {//取当前位置，指针不变
                return this._arr[this._index];
            }
        };

        CycleQueue.prototype.constructor = CycleQueue;

        return CycleQueue;
    })();

    //日期格式化
    var formatDate = (function () {

        function getPadString2(integer) {
            return integer > 9 ? '' + integer : '0' + integer;
        }

        function getPadString3(integer) {
            return integer > 99 ? '' + integer : (integer > 9 ? '0' + integer : '00' + integer);
        }

        //格式化为本地时间
        function toLocaleFormat(formatString) {
            if (!formatString) {
                return this.toLocaleString();
            }

            var str = formatString.replace(/yyyy|YYYY/g, this.getFullYear());
            var yyy = this.getFullYear() % 100;
            str = str.replace(/yy|YY/g, getPadString2(yyy));
            var MMM = this.getMonth() + 1;
            str = str.replace(/MM/g, getPadString2(MMM));
            str = str.replace(/M/g, MMM);
            var ddd = this.getDate();
            str = str.replace(/dd|DD/g, getPadString2(ddd));
            str = str.replace(/d|D/g, ddd);
            var hhh = this.getHours();
            str = str.replace(/hh|HH/g, getPadString2(hhh));
            str = str.replace(/h|H/g, hhh);
            var mmm = this.getMinutes();
            str = str.replace(/mm/g, getPadString2(mmm));
            str = str.replace(/m/g, mmm);
            var sss = this.getSeconds();
            str = str.replace(/ss|SS/g, getPadString2(sss));
            str = str.replace(/s|S/g, sss);
            var fff = this.getMilliseconds();
            str = str.replace(/fff|FFF/g, getPadString3(fff));
            var ff = Math.floor(fff / 10);
            str = str.replace(/ff|FF/g, getPadString2(ff));
            var f = Math.floor(ff / 10);
            str = str.replace(/f|F/g, f);
            return str;
        }

        return function (date, formatString) {
            return toLocaleFormat.call(date, formatString);
        };

    })();

    function array_find(arr, match) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (match(arr[i])) {
                return arr[i];
            }
        }
        return null;
    }

    function array_clear(arr) {
        arr.splice(0, arr.length);
    }

    function array_remove(arr, item) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === item) {
                arr.splice(i, 1);
            }
        }
    }

    function extend(_super) {
        function F() {
        }

        F.prototype = _super.prototype;

        function CLASS() {
            _super.apply(this, arguments);
        }

        CLASS.prototype = new F();

        CLASS.prototype.constructor = CLASS;

        return CLASS;
    }

})(kmsz.editor = kmsz.editor || {});

