'@file: loading';
angular.module(ProjectName)
    .directive('canvas', ['$rootScope', '$timeout', '$q', 'fetchService', 'CONFIG', function ($rootScope, $timeout, $q, fetchService, CONFIG) {
        var directive = {
            restrict: 'A',
            // replace: true,
            scope: true,
            template: '\
                <canvas id="monitor-scene"></canvas>\
                <canvas id="monitor-scene-background"></canvas>\
                <div id="{{radarMonitor.tools}}">\
                    <ul id="monitor-nodeMenu" ng-show="radarMonitor.nodeMenu.status" style="left:{{radarMonitor.nodeMenu.x}};top:{{radarMonitor.nodeMenu.y}}">\
                        <li><a>取消</a></li>\
                        <li><a>添加连线</a></li>\
                        <li><a>复制节点</a></li>\
                        <li><a>删除节点</a></li>\
                        <!--<li id="level">\
                            <a>设置等级</a>\
                            <ul class="lili nav4">\
                                <li id="1"><span>壹</span></li>\
                                <li id="2"><span>贰</span></li>\
                                <li id="3"><span>弎</span></li>\
                                <li id="4"><span>肆</span></li>\
                                <li id="5"><span>伍</span></li>\
                                <li id="6"><span class = "nob">陆</span></li>\
                            </ul>\
                        </li>-->\
                        <li id="text">\
                            <a>设置文字位置</a>\
                            <ul class="lili nav5">\
                                <li id="Top_Center"><span>上</span></li>\
                                <li id="Bottom_Center"><span>下</span></li>\
                                <li id="Middle_Left"><span>左</span></li>\
                                <li id="Middle_Right"><span>右</span></li>\
                                <li id="Middle_Center"><span class="nob">中</span></li>\
                            </ul>\
                        </li>\
                        <li><a>顺时针旋转</a></li>\
                        <li><a>逆时针旋转</a></li>\
                        <li><a>警告</a></li>\
                    </ul>\
                    <ul id="monitor-linkMenu" ng-show="radarMonitor.linkMenu.status" style="left:{{radarMonitor.linkMenu.x}};top:{{radarMonitor.linkMenu.y}}">\
                        <li><a>取消</a></li>\
                        <li><a>删除连线</a></li>\
                        <li><a>改为红色</a></li>\
                        <li><a>改为默认颜色</a></li>\
                    </ul>\
                    <ul id="monitor-echartsMenu" ng-show="radarMonitor.echartsMenu.status" style="left:{{radarMonitor.echartsMenu.x}};top:{{radarMonitor.echartsMenu.y}}">\
                        <li><a>取消</a></li>\
                        <li><a>删除图表</a></li>\
                        <li><a>配置</a></li>\
                    </ul>\
                    <ul id="monitor-echartsConfigContainer" ng-show="radarMonitor.echartsConfig.status" style="left:{{radarMonitor.echartsConfig.x}};top:{{radarMonitor.echartsConfig.y}}">\
                        <li><span>开启实时监控：</span> <label><input type="checkbox" name="looper" ng-checked="MonitorController.getEchartsConfig.looper" ng-click="MonitorController.setEchartsLooper($event)"></label></li>\
                        <li><span>配置数据接口：</span> <textarea type="text" name="api" ng-model="MonitorController.getEchartsConfig.api"></textarea></li>\
                        <li><span>配置数据接口：</span> </li>\
                        <li><span>配置数据接口：</span> </li>\
                        <li class="bottom"><button type="button" ng-click="MonitorController.saveConfig()">确定</button> <button type="button" ng-click="radarMonitor.setCancel()">取消</button></li>\
                    </ul>\
                </div>\
                <div id="echartsContainer">\
                    <echarts ng-repeat="list in radarMonitor.EchartsList" id="{{list.id}}" ec-config="list" style="display:block; width: {{list.width}}px; height: {{list.height}}px;"></echarts>\
                    <!--<echarts ec-config="monitor.echartsConfig" style="display:block; width: 400px; height: 260px;"></echarts>-->\
                </div>\
            ',
            controller: function ($scope) {
                var _this = this;
                this.loopType = 1; //1: 同步同线程, 2: 异步多线程
                this.canvas = $scope.$parent.canvasConf.canvas;
                this.tools = 'monitor-tools';
                this.editor = 'monitor-editor';
                this.alarmWording = 'Warning';
                this.Image = {
                    '1': 'cloud.png',
                    '2': '8000.png',
                    '3': 'ER16.png',
                    '4': '5200.png',
                    '5': '2948.png',
                    '6': 'serv.png',
                    '7': 'serve.png'
                };

                var oCorner = new Image();
                oCorner.onload = function () {
                    _this.oCorner = this;
                    this.onload = null;
                };
                oCorner.src = CONFIG.webRoot + 'modules/common/theme/img/scale.png';
                // this.corner = CONFIG.webRoot + 'modules/common/monitor/img/scale.png';
                this.nodeMenu = {
                    status: false,
                    x: '0px',
                    y: '0px'
                };
                this.linkMenu = angular.copy(this.nodeMenu);
                this.echartsMenu = angular.copy(this.nodeMenu);
                this.echartsConfig = angular.copy(this.nodeMenu);
                this.setCancel = function () {
                    // 后期加入API数据demo展现浮层弹窗
                    this.echartsConfig.status = false;
                };
                this.pixelRatio = 2; //屏幕分辨率
                this.monitorApi = CONFIG.api['theme'].sceneConf;
                this.EchartsList = [];
                var eChartOptions = $scope.$parent.eChartOptions || {};
                this.MonitorFactory = function (type, data) {
                    var echarts = eChartOptions[type] || {};
                    if (!data) {
                        data = {};
                    }
                    var factory = {};
                    factory = angular.extend(factory, data, true);
                    if (!echarts) {
                        factory.elementType = factory.elementType || type;
                        factory.config = factory.config || {
                            size: {
                                width: factory.width || 600,
                                height: factory.height || 460
                            },
                            offset: {
                                x: factory.x || 0,
                                y: factory.y || 0
                            },
                            looper: factory.looper || 0,
                            api: factory.api || ''
                        };
                    } else {
                        factory.id = factory.id || 'eChart_' + type + '_' + Math.floor(Math.random() * 100000 + 1);
                        factory.ecid = factory.ecid || factory.id;
                        factory.elementType = factory.elementType || 'echart';
                        factory.echartType = factory.echartType || type;
                        factory.config = factory.config || echarts.config || {
                            pixelRatio: factory.pixelRatio || this.pixelRatio,
                            theme: 'default',
                            event: [],
                            dataLoaded: true,
                            size: {
                                width: factory.width || 600,
                                height: factory.height || 460
                            },
                            offset: {
                                x: factory.x || 0,
                                y: factory.y || 0
                            },
                            looper: factory.looper || 0,
                            api: factory.api || ''
                        };
                        factory.option = factory.option || echarts.option;
                    }
                    factory.oCorner = factory.oCorner || '';
                    return factory;
                };
                //  this.echartsConfig = angular.copy(this._echartsConfig);
            },
            controllerAs: 'radarMonitor',
            link: function ($scope, $element, $attrs, $ctrl) {
                /*
                 // 求最大公约数
                 function gcd (a, b) {
                  var r;
                  while (b != 0) {
                    r = a % b;
                    a = b;
                    b = r;
                  }
                  return a;
                }
                // 获取设备的 pixel ratio
                var getPixelRatio = function(context) {
                    var backingStore = context.backingStorePixelRatio ||
                        context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1;
                    return (window.devicePixelRatio || 1) / backingStore;
                };
                var ratio = getPixelRatio(ctx);
                 */
                var conf = $scope.$eval($attrs.canvas);
                var MonitorController = function () {
                    var win = $(window),
                        endNode,
                        currentNode,
                        tmpx,
                        tmpy,
                        isDragging,
                        validation,
                        pixel = $ctrl.pixelRatio, //调整清晰度, 1: 普清, 2: 高清
                        strr = '';
                    return {
                        init: function () {
                            var _this = this;
                            this.config = conf;
                            $timeout(function () {
                                var rootDom = $('#' + (conf.root || 'monitorContainer'));
                                var x = rootDom.offset().left;
                                var y = rootDom.offset().top;
                                var w = rootDom.width();
                                var h = rootDom.height();
                                if (!_this.Scene || !_this.Stage) {
                                    //生成背景canvas层
                                    var canvasBg = document.getElementById($ctrl.canvas + '-background');
                                    canvasBg.height = h * pixel;
                                    canvasBg.width = w * pixel;
                                    canvasBg.style.zIndex = 0;
                                    canvasBg.style.height = h + 'px';
                                    canvasBg.style.width = w + 'px';
                                    var sceneBg = new JTopo.Scene();
                                    sceneBg.backgroundColor = '255, 255, 255';
                                    sceneBg.alpha = 1;
                                    var stageBg = new JTopo.Stage(canvasBg, { pixel: pixel, x: x, y: y });
                                    stageBg.frames = 0;
                                    stageBg.add(sceneBg);
                                    _this.SceneBg = sceneBg;
                                    //生成大屏展现主canvas
                                    var canvas = document.getElementById($ctrl.canvas);
                                    canvas.height = h * pixel;
                                    canvas.width = w * pixel;
                                    canvas.style.zIndex = 9;
                                    canvas.style.height = h + 'px';
                                    canvas.style.width = w + 'px';
                                    var scene = new JTopo.Scene();
                                    var stage = new JTopo.Stage(canvas, { pixel: pixel, x: x, y: y });
                                    _this.Scene = scene;
                                    _this.Stage = stage;
                                }

                                _this.config.x = x;
                                _this.config.y = y;
                                _this.config.width = w;
                                _this.config.height = h;
                                _this.loadSceneConf();
                                _this._initEvent();
                                _this.render();
                                _this._setLooper();
                                conf.mode && (_this.Stage.mode = conf.mode);
                                _this.currentNode = currentNode;
                                //   var scene1 = new JTopo.Scene();
                                //   _this.Stage.add(scene1);
                                console.log('scene:', _this.Scene, '\n', _this.Stage.width + 'stage: ', _this.Stage);
                            }, 0);
                            return this;
                        },
                        monitorProxy: {
                            _cache: {},
                            on: function (name, func) {
                                this._cache[name] = func;
                                return this;
                            },
                            off: function (name) {
                                (this._cache[name]) && delete this._cache[name];
                                return this;
                            },
                            fire: function (name) {
                                if (this._cache[name]) {
                                    this._cache[name].apply(MonitorController, [].slice.call(arguments, 1));
                                }
                                return this;
                            }
                        },
                        _nodesCache: {},
                        setStage: function (act) {
                            for (var i = 0, len = this.Scene.childs.length; i < len; i++) {
                                var os = this.Scene.childs[i];
                                if (os.setSize) {
                                    os.setSize((!!act ? os.width / 2 : os.width * 2), (!!act ? os.height / 2 : os.height * 2));
                                }
                            }
                            console.log(this.Stage, this.Scene, pixel);
                        },
                        loadSceneConf: function () {
                            var _this = this;
                            fetchService.get([{
                                url: $ctrl.monitorApi,
                                data: {}
                            }]).then(function (ret) {
                                var data = ret[0].data;
                                angular.forEach(data, function (v, k) {
                                    switch (v.elementType) {
                                        case 'echart':
                                            _this.createEcharts(v.echartType, v);
                                            break;
                                        case 'node':
                                            if (v.level <= 6) {
                                                _this._createNode(v.x, v.y, v.text, ($ctrl.Image[v.level] || v.Image), v.textPosition, v.level, v.larm);
                                            }
                                            break;
                                        case 'link':
                                            var nodeA = _this.Scene.findElements(function (e) {
                                                return e.id == v.nodeAid;
                                            });
                                            var nodeZ = _this.Scene.findElements(function (e) {
                                                return e.id == v.nodeZid;
                                            });
                                            if (nodeA[0] && nodeZ[0]) {
                                                _this._createLink(nodeA[0], nodeZ[0], v.text, v.fontColor);
                                            }
                                            break;
                                        default:
                                            break;

                                    }
                                });
                                // _this.autoFixed();
                            });
                        },
                        autoFixed: function () {
                            return this.Stage.centerAndZoom();
                        },
                        _dataProxy: function () {

                        },
                        _setLooper: function () {
                            var _this = this;
                            var thisObj = arguments.callee;
                            var defer = $q.defer();
                            var renewCharts = function (opts) {
                                var opt = opts; // angular.copy(opts);
                                var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
                                var data0 = opt.series[0].data;
                                var data1 = opt.series[1].data;
                                data0.shift();
                                data0.push(Math.round(Math.random() * 1000));
                                data1.shift();
                                data1.push((Math.random() * 10 + 5).toFixed(1) - 0);
                                opt.xAxis[0].data.shift();
                                opt.xAxis[0].data.push(axisData);
                                if (opt.xAxis[1]) {
                                    opt.xAxis[1].data.shift();
                                    opt.xAxis[1].data.push(15);
                                }
                                return opt;
                            };
                            angular.forEach(this._nodesCache, function (node) {
                                var looper = node.config.looper;
                                if (!looper) {
                                    return;
                                }
                                // var oChart = node.echarts;
                                var opt = renewCharts(node.option);
                                node.option = opt;
                                // console.log(node);
                                // node.echarts.setOption(opt);
                                // $scope.$emit('Monitor:rtEcharts', node);
                            });
                            this._looperTimer = $timeout(function () {
                                !!_this._looperTimer && $timeout.cancel(_this._looperTimer);
                                thisObj.call(_this);
                            }, CONFIG.realTime);
                        },
                        _loadEcharts: function (data) {
                            data.width = data.width / pixel;
                            data.height = data.height / pixel;
                            return $scope.$parent.theme.addEcharts(data.echartType, data);
                        },
                        createEcharts: function (type, data) {
                            if (!data) {
                                data = {};
                            }
                            data.oCorner = $ctrl.oCorner;
                            var factory = $ctrl.MonitorFactory(type, data);
                            $ctrl.EchartsList.push(factory);
                        },
                        _realTimeEcharts: function (oSource) {
                            //  var _this = this;
                            if (!oSource) {
                                return;
                            }
                            var node;
                            var ecid = oSource.id;
                            //  var oImg = oSource.getDataURL();
                            var oImg = oSource.echarts.getRenderedCanvas({ pixelRatio: (oSource.config.pixelRatio || 2) });
                            if (!!this._nodesCache[ecid]) {
                                node = this._nodesCache[ecid];
                                node.setImage(oImg);
                                node.Image = oImg;
                            } else {
                                node = new JTopo.Node('');
                                node = angular.extend(node, oSource, true);
                                node.serializedProperties.push('level');
                                node.setLocation(0, 0);
                                node.x = node.x || node.config.offset.x || 0;
                                node.y = node.y || node.config.offset.y || 0;
                                node.width = node.config.size.width * node.config.pixelRatio;
                                node.height = node.config.size.height * node.config.pixelRatio;
                                node.level = 1;
                                node.setImage(oImg);
                                node.Image = oImg;
                                node.textPosition = 'Middle_Center';
                                node.fontColor = '0, 0, 0';
                                this._nodesCache[ecid] = node;
                                this.Scene.add(node);
                                //   this.monitorProxy.on(ecid, $ctrl.commonLooper);
                                //   this.monitorProxy.fire(ecid, node);
                            }
                            //  oSource.dispose();
                            return node;
                        },
                        _NodehandlerMouseup: function (event, node) {
                            $ctrl.linkMenu.status = false;
                            $ctrl.echartsMenu.status = false;
                            currentNode = node;
                            tmpx = event.pageX - this.config.x + 30;
                            tmpy = event.pageY - this.config.y + 30;
                            $ctrl.nodeMenu.x = event.pageX - this.config.x + 10 + 'px';
                            $ctrl.nodeMenu.y = event.pageY - this.config.y - 20 + 'px';
                            $ctrl.nodeMenu.status = true;
                        },
                        _nodeHandlerClick: function (event, node) {
                            endNode = node;
                            if (null != currentNode && currentNode != endNode && validation === true) {
                                strr = "";
                                this._createLink(currentNode, endNode, strr);
                                currentNode = null;
                                validation = false; //验证是否在当前节点上右键点击了添加节点
                            }
                        },
                        _linkHandlerMouseup: function (event, link) {
                            currentNode = link;
                            $ctrl.nodeMenu.status = false;
                            $ctrl.echartsMenu.status = false;
                            $ctrl.linkMenu.x = event.pageX - this.config.x + 10 + 'px';
                            $ctrl.linkMenu.y = event.pageY - this.config.y - 20 + 'px';
                            $ctrl.linkMenu.status = true;
                        },
                        _createNode: function (x, y, str, img, textPosition, level, larm) {
                            var node = new JTopo.Node(str);
                            node.serializedProperties.push('id');
                            node.serializedProperties.push('level');
                            node.setLocation(x, y);
                            node.Image = '';
                            node.id = x * y;
                            node.level = level;
                            if (null != img) {
                                if (typeof img === 'string' && !/^data\:/i.test(img)) {
                                    node.setImage(CONFIG.webRoot + 'modules/common/theme/img/' + img, true);
                                    node.Image = img;
                                } else {
                                    node.setImage(img, true);
                                    node.elementType = str;
                                    node.Image = arguments[arguments.length - 1];
                                }
                                node.Image = img;
                            }
                            if (!!larm && larm !== 'undefined') {
                                node.alarm = $ctrl.alarmWording;
                            }
                            node.textPosition = textPosition;
                            node.fontColor = '0, 0, 0';
                            node.oCorner = $ctrl.oCorner || null;
                            this.Scene.add(node);
                            return node;
                        },
                        _createLink: function (node1, node2, str, color) {
                            var link = new JTopo.Link(node1, node2, str);
                            //node2.father = node1;
                            link.elementType = 'link';
                            link.lineWidth = 3; //线宽
                            link.bundleOffset = 60;
                            link.bundleGap = 20;
                            link.textOffsetY = 3;
                            link.fontColor = color || '0, 200, 255';
                            link.strokeColor = color || '0, 200, 255';
                            this.Scene.add(link);
                            return link;
                        },
                        _createTextarea: function () {
                            var tid = $ctrl.editor;
                            var oTextarea = angular.element(tid);
                            if (oTextarea) {
                                oTextarea = document.createElement('textarea');
                                oTextarea.id = tid;
                                oTextarea.onblur = function () {
                                    this.monitorNode && (this.monitorNode.text = this.value);
                                    this.style.display = 'none';
                                };
                                document.body.appendChild(oTextarea);
                                this._oTextarea = oTextarea;
                            }
                            return oTextarea;
                        },
                        editElementValue: function (event, node) {
                            var oTextarea = this._createTextarea();
                            oTextarea.style.left = event.pageX - oTextarea.offsetWidth / 2 + 'px';
                            oTextarea.style.top = event.pageY + 5 + 'px';
                            oTextarea.style.zIndex = 0;
                            oTextarea.value = node.text;
                            oTextarea.style.display = 'block';
                            oTextarea.focus();
                            oTextarea.select();
                            node.text = '';
                            oTextarea.monitorNode = node;
                        },
                        render: function () {
                            return this.Stage.add(this.Scene);
                        },
                        remove: function () {
                            delete this._nodesCache[currentNode.id];
                            this.Scene.remove(currentNode);
                            currentNode = null;
                        },
                        clear: function () {
                            this._nodesCache = {};
                            return this.Stage.clear();
                        },
                        _toolsHandler: function (event) {
                            var dom = event.target || event.srcElement;
                            if (!currentNode) {
                                return;
                            }
                            var type = $(dom).text();
                            var action = null;
                            var oParent = $(dom).parents('li');
                            if (oParent.length === 2) {
                                type = oParent[1].id;
                                action = oParent[0].id;
                            }
                            switch (type) {
                                // monitor-nodeMenu
                                case '设置文字位置':
                                    return;
                                case '添加连线':
                                    validation = true;
                                    break;
                                case '复制节点':
                                    this._createNode(tmpx, tmpy, currentNode.text, currentNode.Image, 'Bottom_Center');
                                    break;
                                case '删除节点':
                                case '删除图表':
                                    this.Scene.remove(currentNode);
                                    currentNode = null;
                                    break;
                                case '顺时针旋转':
                                    currentNode.rotate += 0.5;
                                    break;
                                case '逆时针旋转':
                                    currentNode.rotate -= 0.5;
                                    break;
                                case '警告':
                                    currentNode.alarm = (currentNode.alarm == null) ? $ctrl.alarmWording : null;
                                    break;
                                case 'text':
                                    currentNode.textPosition = action;
                                    break;
                                case 'level':
                                    currentNode.level = action;
                                    break;
                                    // monitor-linkMenu
                                case '删除连线':
                                    this.Scene.remove(currentNode);
                                    break;
                                case '改为红色':
                                    currentNode.strokeColor = '255, 0, 0';
                                    break;
                                case '改为默认颜色':
                                    currentNode.strokeColor = '0, 200, 255';
                                    break;
                                    // monitor-echartsMenu
                                case '配置':
                                    return this._configEcharts(event);
                            }
                            $timeout(function () {
                                $ctrl.nodeMenu.status = false;
                                $ctrl.linkMenu.status = false;
                                $ctrl.echartsMenu.status = false;
                            });
                        },
                        getEchartsConfig: function () {
                            //  currentNode = angular.extend($ctrl.echartsConfig.data);
                            if (!currentNode) {
                                return {
                                    looper: 0,
                                    api: ''
                                };
                            }
                            return {
                                looper: currentNode.source.attrs.looper || 0,
                                api: currentNode.source.attrs.api || ''
                            };
                        }(),
                        setEchartsLooper: function (event) {
                            var dom = event.target || event.srcElement;
                            currentNode.config.looper = ~~dom.checked;
                            this.getEchartsConfig.looper = currentNode.config.looper;
                        },
                        _configEcharts: function () {
                            var _this = this;
                            $scope.$apply(function () {
                                _this.getEchartsConfig.looper = currentNode.config.looper || 0;
                                _this.getEchartsConfig.api = currentNode.config.api || '';
                                $ctrl.nodeMenu.status = false;
                                $ctrl.linkMenu.status = false;
                                $ctrl.echartsMenu.status = false;
                                $ctrl.echartsConfig.x = event.pageX - _this.config.x + 10 + 'px';
                                $ctrl.echartsConfig.y = event.pageY - _this.config.y - 20 + 'px';
                                $ctrl.echartsConfig.status = true;
                            });
                        },
                        _echarthandlerMouseup: function (event, node) {
                            //  console.log(node, event.button, isDragging);
                            if (event.button === 0) {
                                $ctrl.echartsMenu.status = false;
                                if (!!isDragging) {
                                    var opt = {
                                        width: node.width,
                                        height: node.height
                                    };
                                    //  node.Echarts.CONFIG.config.position = opt;
                                    isDragging = null;
                                }
                            } else if (event.button === 2) {
                                currentNode = node;
                                $ctrl.echartsMenu.x = event.pageX - this.config.x + 10 + 'px';
                                $ctrl.echartsMenu.y = event.pageY - this.config.y + 10 + 'px';
                                $ctrl.echartsMenu.status = true;

                            }
                            // $scope.$broadcast('Monitor:resetEcharts', opt);
                        },
                        _eventController: function (event) {
                            var type = event.type;
                            var e = event.target || event.srcElement;
                            switch (!0) {
                                case (type === 'mouseup' && !e.elementType): //空白canvas单击事件
                                case (type === 'dblclick' && !e.elementType): //空白canvas双击事件
                                    $ctrl.nodeMenu.status = false;
                                    $ctrl.linkMenu.status = false;
                                    $ctrl.echartsMenu.status = false;
                                    $ctrl.echartsConfig.status = false;
                                    break;
                                case (type === 'mouseup' && e.elementType === 'echart'): //点击事件&& echart
                                    $ctrl.nodeMenu.status = false;
                                    $ctrl.linkMenu.status = false;
                                    $ctrl.echartsConfig.status = false;
                                    this._echarthandlerMouseup(event, e);
                                    break;
                                case (type === 'mouseup' && e.elementType === 'node'): //右键点击事件&& node
                                    $ctrl.nodeMenu.status = false;
                                    $ctrl.linkMenu.status = false;
                                    $ctrl.echartsMenu.status = false;
                                    $ctrl.echartsConfig.status = false;
                                    event.button === 2 ? this._NodehandlerMouseup(event, e) : this._nodeHandlerClick(event, e);
                                    break;
                                case (type === 'mouseup' && e.elementType === 'link'): //右键点击事件&& link
                                    $ctrl.nodeMenu.status = false;
                                    $ctrl.linkMenu.status = false;
                                    $ctrl.echartsMenu.status = false;
                                    $ctrl.echartsConfig.status = false;
                                    event.button === 2 && this._linkHandlerMouseup(event, e);
                                    break;
                                case (type === 'dblclick' && e.elementType === 'node'): //双击事件&& node
                                case (type === 'dblclick' && e.elementType === 'link'): //双击事件&& link
                                    this.editElementValue.call(this, event, e);
                                    break;
                                    /* case (type === 'dblclick' && !e.elementType): //空白canvas双击事件
                                         // this.autoFixed();
                                         break;*/
                                default:
                                    break;
                            }

                        },
                        _save: function () {
                            if (!this.Scene) {
                                return;
                            }
                            var data = [];
                            for (var i = 0, l = this.Scene.childs.length; i < l; i++) {
                                var f = this.Scene.childs[i];
                                var o = {};
                                o.elementType = f.elementType;
                                switch (f.elementType) {
                                    case 'link':
                                        o.id = f.id;
                                        o.nodeAid = f.nodeA.id;
                                        o.nodeZid = f.nodeZ.id;
                                        o.text = f.text;
                                        o.fontColor = f.fontColor;
                                        break;
                                    case 'echart':
                                        o.echartType = f.echartType;
                                        o.id = f.id;
                                        o.x = f.x;
                                        o.y = f.y;
                                        o.width = f.width;
                                        o.height = f.height;
                                        o.config = f.config;
                                        o.config.size = {
                                            width: o.width,
                                            height: o.height
                                        };
                                        o.config.offset = {
                                            x: o.x,
                                            y: o.y
                                        };
                                        o.option = f.option;
                                        o.ecid = f.ecid;
                                        o.Image = f.Image;
                                        o.looper = f.config.looper || 0;
                                        o.api = f.config.api || '';
                                        break;
                                    case 'node':
                                        o.id = f.id;
                                        o.x = f.x;
                                        o.y = f.y;
                                        o.width = f.width;
                                        o.height = f.height;
                                        o.Image = f.Image;
                                        o.text = f.text;
                                        o.textPosition = f.textPosition;
                                        o.larm = f.alarm || '';
                                        o.level = f.level;
                                        break;
                                }
                                data.push(o);
                            }
                            console.log(data);
                            console.log(JSON.stringify(data)); //, '\n', JSON.stringify(data));
                        },
                        saveConfig: function () {
                            var data = this.getEchartsConfig;
                            currentNode.config = angular.extend(currentNode.config, data, true);
                            $ctrl.echartsConfig.status = false;
                            !!currentNode.config.looper && this.monitorProxy.fire(currentNode.ecid, currentNode);

                        },
                        _initEvent: function () {
                            var _this = this,
                                _timer;
                            //_createEcharts
                            $scope.$on('Monitor:save', function (event, data) {
                                return _this._save.call(_this, event, data);
                            });
                            $scope.$on('Monitor:setStage', function (event, data) {
                                return $timeout(function () {
                                    _this.setStage.call(_this, data);
                                });
                            });
                            $scope.$on('Monitor:createEcharts', function (e, data) {
                                return MonitorController.createEcharts.call(MonitorController, data);
                            });
                            $scope.$on('Monitor:rtEcharts', function (event, data) {
                                return $timeout(function () {
                                    return _this._realTimeEcharts.call(_this, data);
                                });
                            });
                            $scope.$on('Monitor:addNode', function (event, data) {
                                data = data || [0, 0, '', $ctrl.Image['1'], 'Middle_Center', 1, ''];
                                return $timeout(function () {
                                    return _this._createNode.apply(_this, data);
                                });
                            });
                            this.Scene.dbclick(function (e) {
                                $timeout.cancel(_timer);
                                _timer = null;
                                return _this._eventController.call(_this, e);
                            });
                            this.Scene.mousedrag(function (e) {
                                if (!isDragging) {
                                    isDragging = e;
                                }
                                // return _this._eventController.call(_this, e);
                            });
                            this.Scene.mouseup(function (e) {
                                if (!!_timer) {
                                    $timeout.cancel(_timer);
                                    return _timer = null;
                                }
                                _timer = $timeout(function () {
                                    $timeout.cancel(_timer);
                                    _timer = null;
                                    return _this._eventController.call(_this, e);
                                }, 300);
                            });
                            var oTools = document.getElementById($ctrl.tools);
                            oTools.addEventListener('click', function (event) {
                                return _this._toolsHandler.call(_this, event);
                            }, false);

                            /*
                             $scope.$on('$destroy', function () {
                                 clipImage();
                                 clipImage = null;
                                 
                                 addImage();
                                 addImage = null;
                             });
                            */
                        }
                    }
                }();
                MonitorController.init();
                $scope.MonitorController = MonitorController;
            }
        };
        return directive;
    }]);
