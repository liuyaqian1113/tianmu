'@file: canvas';
angular.module(ProjectName)
    .directive('canvasManager', ['$timeout', '$q', 'fetchService', '$compile', 'CONFIG', 'Upload', function ($timeout, $q, fetchService, $compile, CONFIG, Upload) {
        var directive = {
            restrict: 'AE',
            replace: true,
            scope: true,
            template: '\
                    <div id="canvas-toolsbar">\
                        <a type="button" class="btn btn-success btn-xs" ng-click="canvasManager.save()">保存 </a>\
                        <section class="model-14">\
                            <span>控制台：</span>\
                            <div class="checkbox">\
                            <input type="checkbox" ng-model="canvasManager.consolePanelStatus" ng-checked="canvasManager.consolePanelStatus">\
                            <label></label>\
                            </div>\
                        </section>\
                        <button type="button" class="btn btn-default btn-xs" ng-click="canvasManager.addNode()"> 添加流程节点 </button>\
                        <div class="btn-group">\
                          <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">\
                            Echarts图表 <span class="caret"></span>\
                          </button>\
                          <ul class="dropdown-menu" role="menu">\
                            <li><a href="javascript:;" ng-click="canvasManager.addEcharts(\'line\')">折线图</a></li>\
                            <li><a href="javascript:;" ng-click="canvasManager.addEcharts(\'bar\')">柱状图</a></li>\
                            <li class="divider"></li>\
                            <li><a href="javascript:;" ng-click="canvasManager.addEcharts(\'scatter\')">线路图</a></li>\
                          </ul>\
                        </div>\
                        <div id="console-panel" ng-class="{true: \'show\', false: \'\'}[canvasManager.consolePanelStatus]" class="form-horizontal console-panel">\
                            <h1>{{canvasManager.elementType}}控制面板</h1>\
                            <form id="console-list" class="form-horizontal" name="panelForm">\
                            </form>\
                        </div>\
                    </div>',
            link: function ($scope, $element, $attrs, $ctrl) {
                var canvasConf = $scope.$parent.canvasConf;
                $scope.canvasManager = {
                    elementType: 'scene',
                    consolePanelStatus: true,
                    update: function (act, data) {
                        return $scope.$parent.$broadcast(act, data);
                    },
                    getThemeCategory: function () {
                        var category = $scope.$parent.scene.themeCategory;
                        return !!category ? category : [];
                    },
                    setThemeCategory: function (category) {
                        $scope.formsData.scene.themeCategoryId = category.id;
                        $scope.formsData.scene.themeCategoryName = category.name;
                    },
                    panelTemplates: {
                        'common': '\
                            <!--<div class="form-group">\
                                <label class="col-sm-12 control-control">&nbsp;</label>\
                                <div class="col-sm-12"></div>\
                            </div>\
                            <div class="form-group">\
                                <div class="col-sm-offset-2 col-sm-10">\
                                    <button class="btn btn-success" ng-disabled="themeForm.$invalid" ng-click="canvasManager.saveManager()">保存</button>&nbsp;&nbsp;\
                                    <button class="btn btn-default" ng-click="canvasManager.cancelManager()">取消</button>\
                                </div>\
                            </div>-->\
                        ',
                        'scene': { //场景
                            tmpl: '\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">编辑场景比例</label>\
                                    <div class="col-sm-12">\
                                        <div class="radio">\
                                            <label>\
                                                <input type="radio" name="sceneRatio" value="4:3" ng-model="formsData.scene.sceneRatio" ng-checked="formsData.scene.sceneRatio == \'4:3\'"> 4:3\
                                            </label>\
                                        </div>\
                                        <div class="radio">\
                                            <label>\
                                                <input type="radio" name="sceneRatio" value="16:9" ng-model="formsData.scene.sceneRatio" ng-checked="formsData.scene.sceneRatio == \'16:9\'"> 16:9\
                                            </label>\
                                        </div>\
                                        <div class="radio">\
                                            <label>\
                                                <input type="radio" name="sceneRatio" value="16:10" ng-model="formsData.scene.sceneRatio" ng-checked="formsData.scene.sceneRatio == \'16:10\'"> 16:10\
                                            </label>\
                                        </div>\
                                        <div class="radio">\
                                            <label>\
                                                <input type="radio" name="sceneRatio" value="" ng-model="formsData.scene.sceneRatio" ng-checked="formsData.scene.sceneRatio == formsData.scene.otherRatio"> 其他比例{{\'(\'+ formsData.scene.otherRatio +\')\'}}\
                                            </label>\
                                        </div>\
                                        <div class="radio" ng-show="formsData.scene.sceneRatio != \'4:3\' && formsData.scene.sceneRatio != \'16:9\' && formsData.scene.sceneRatio != \'16:10\'">\
                                            <label>\
                                                (高度:宽度) <input type="text" ng-model="formsData.scene.otherRatio" ng-blur="canvasManager.transferRatio($event)">\
                                            </label>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">风格主题分类</label>\
                                    <div class="col-sm-12">\
                                        <div class="input-group input-group-sm">\
                                            <input type="hidden" class="form-control" ng-model="formsData.scene.themeCategoryId">\
                                            <input type="text" class="form-control" ng-model="formsData.scene.themeCategoryName" readonly>\
                                            <div class="input-group-btn">\
                                                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">选择分类\
                                                    <span class="caret"></span>\
                                                </button>\
                                                <ul class="dropdown-menu pull-right">\
                                                    <li ng-repeat="cat in canvasManager.getThemeCategory()"><a href="javascript:;" ng-click="canvasManager.setThemeCategory(cat)">{{cat.name}}</a></li>\
                                                </ul>\
                                            </div><!-- /btn-group -->\
                                        </div><!-- /input-group -->\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">场景背景颜色</label>\
                                    <div class="col-sm-12">\
                                        <div class="input-group input-group-sm">\
                                            <input type="text" class="form-control" color-picker set-color="formsData.scene.backgroundColor" ng-model="formsData.scene.backgroundColor">\
                                            <span class="input-group-addon" ng-style="{\'background-color\': formsData.scene.backgroundColor, \'width\': \'50%\'}"></span>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">场景背景图片</label>\
                                    <div class="col-sm-12">\
                                        <div class="textarea">\
                                            <button type="file" class="btn btn-success btn-sm" ngf-select ng-model="formsData.scene.background" name="file" ngf-accept="\'image/*\'" ng-change="canvasManager.imageUpload(formsData.scene.background)">上传图片</button> <span class="imgPreview" ng-show="formsData.scene.background" title="{{formsData.scene.background}}">IMG<em class="delete" ng-click="canvasManager.removeBackground(formsData.scene.background)"></em></span>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">场景主题配置</label>\
                                    <div class="col-sm-12">\
                                        <div class="textarea">\
                                            <textarea class="form-control" style="height: 100px;resize: none;" ng-model="formsData.scene.echartsTheme"></textarea>\
                                        </div>\
                                    </div>\
                                </div>'
                        },
                        'echart': { //echarts图表
                            tmpl: '\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">echarts背景颜色</label>\
                                    <div class="col-sm-12">\
                                        <div class="input-group input-group-sm">\
                                            <input type="text" class="form-control" color-picker set-color="formsData.echart.backgroundColor" ng-model="formsData.echart.backgroundColor">\
                                            <span class="input-group-addon" ng-style="{\'background-color\': formsData.echart.backgroundColor, \'width\': \'50%\'}"></span>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">echarts背景图片</label>\
                                    <div class="col-sm-12">\
                                        <div class="textarea">\
                                            <button type="file" class="btn btn-success btn-sm" ngf-select ng-model="formsData.echart.background" name="file" ngf-accept="\'image/*\'" ng-change="canvasManager.imageUpload(formsData.echart.background)">上传图片</button> <span class="imgPreview" ng-show="formsData.echart.background" title="{{formsData.echart.background}}">IMG<em class="delete" ng-click="canvasManger.removeBackground(formsData.echart.background)"></em><!--<img ng-src="{{formsData.echart.background}}">--></span>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">设置数据接口</label>\
                                    <div class="col-sm-12">\
                                        <div class="textarea">\
                                            <textarea class="form-control" style="height: 50px;resize: none;" ng-model="formsData.echart.echartsApi" placeholder="每个接口一行或者用英文;分隔"></textarea>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">接口更新频率</label>\
                                    <div class="col-sm-12">\
                                        <div class="input-group input-group-sm">\
                                            <input type="number" class="form-control" ng-model="formsData.echart.echartsApiInterval" maxlength="8">\
                                            <span class="input-group-addon">秒</span>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">自定义Echarts</label>\
                                    <div class="col-sm-12">\
                                        <div class="textarea">\
                                            <textarea class="form-control" style="height: 100px;resize: none;" ng-model="formsData.echart.echartsTheme" placeholder="自定义配置会覆盖全局配置"></textarea>\
                                        </div>\
                                    </div>\
                                </div>\
                            '
                        },
                        'node': {
                            tmpl: '\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">节点文字</label>\
                                    <div class="col-sm-12">\
                                        <div class="textarea">\
                                            <input class="form-control" ng-model="formsData.node.nodeName"></textarea>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">设置文字位置</label>\
                                    <div class="col-sm-12">\
                                        <div class="input-group input-group-sm">\
                                            <input type="hidden" class="form-control" ng-model="formsData.node.textPosition">\
                                            <input type="text" class="form-control" ng-model="formsData.node.textPositionValue" readonly>\
                                            <div class="input-group-btn">\
                                                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">请选择位置\
                                                    <span class="caret"></span>\
                                                </button>\
                                                <ul class="dropdown-menu pull-right">\
                                                    <li ng-repeat="pos in canvasManager.getTextPosition"><a href="javascript:;" ng-click="canvasManager.setTextPosition(pos)">{{pos.value}}</a></li>\
                                                </ul>\
                                            </div><!-- /btn-group -->\
                                        </div><!-- /input-group -->\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">文字颜色</label>\
                                    <div class="col-sm-12">\
                                        <div class="input-group input-group-sm">\
                                            <input type="text" class="form-control" color-picker set-color="formsData.node.textColor" ng-model="formsData.node.textColor">\
                                            <span class="input-group-addon" ng-style="{\'background-color\': formsData.node.textColor, \'width\': \'50%\'}"></span>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">节点背景图片</label>\
                                    <div class="col-sm-12">\
                                        <div class="textarea">\
                                            <button type="file" class="btn btn-success btn-sm" ngf-select ng-model="formsData.node.background" name="file" ngf-accept="\'image/*\'" ng-change="canvasManager.imageUpload(formsData.node.background)">上传图片</button> <span class="imgPreview" ng-show="formsData.node.background" title="{{formsData.node.background}}">IMG<em class="delete" ng-click="canvasManger.removeBackground()"></em><!--<img ng-src="{{formsData.node.background}}">--></span>\
                                        </div>\
                                    </div>\
                                </div>\
                            '
                        },
                        'link': { //连线
                            tmpl: '\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">连线名称</label>\
                                    <div class="col-sm-12">\
                                        <div class="textarea">\
                                            <input class="form-control" ng-model="formsData.link.linkName"></textarea>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="form-group">\
                                    <label class="col-sm-12 control-control">连线颜色</label>\
                                    <div class="col-sm-12">\
                                        <div class="input-group input-group-sm">\
                                            <input type="text" class="form-control" color-picker set-color="formsData.link.linkColor" ng-model="formsData.link.linkColor">\
                                            <span class="input-group-addon" ng-style="{\'background-color\': formsData.link.linkColor, \'width\': \'50%\'}"></span>\
                                        </div>\
                                    </div>\
                                </div>'
                        },
                        'number': { //数字展现
                            tmpl: ''
                        },
                        'rank': { //排行榜
                            tmpl: ''
                        }
                    },
                    getTextPosition: [
                        {
                            key: 'Middle_Center',
                            value: '中'
                        },
                        {
                            key: 'Top_Center',
                            value: '上'
                        },
                        {
                            key: 'Bottom_Center',
                            value: '下'
                        },
                        {
                            key: 'Middle_Left',
                            value: '左'
                        },
                        {
                            key: 'Middle_Right',
                            value: '右'
                        }
                    ],
                    setTextPosition: function (pos) {
                        $scope.formsData[this.elementType].textPosition = pos.key;
                        $scope.formsData[this.elementType].textPositionValue = pos.value;
                        return this.update('Monitor:setTextPosition', {
                            elementType: this.elementType,
                            textPosition: pos.key
                        });
                    },
                    getPanelTemplate: function (n, o) {
                        if (!this.consolePanelStatus) {
                            return '';
                        }
                        //ng-bind-html="canvasManager.showPanelTemplate.call(canvasManager, $event)|transferHtml"
                        var nodeType = this.elementType;
                        var tmpl = this.panelTemplates[nodeType].tmpl + '\n' + this.panelTemplates['common'];
                        if (!this.showPanelTemplate) {
                            this.showPanelTemplate = '';
                        }
                        if (this.showPanelTemplate.toString()
                            .replace(/\s+|\n/g, '') !== tmpl.toString()
                            .replace(/\s+|\n/g, '')) {
                            var ele = $compile(tmpl)($scope);
                            var cont = angular.element('#console-list');
                            cont.empty()
                                .append(ele);
                            this.showPanelTemplate = tmpl; // cont.html();
                        }
                    },
                    transferRatio: function (e) {
                        var node = e.target || e.srcElement;
                        var val = node.value;
                        var transfer = function (num) {
                            num = num.replace(/\s/g, '')
                                .split(':');
                            var a = num[0],
                                b = num[1],
                                r;
                            while (b != 0) {
                                r = a % b;
                                a = b;
                                b = r;
                            }
                            return Math.floor(num[0] / a) + ':' + Math.floor(num[1] / a);
                        };
                        if (val !== '' && val.indexOf(':') > -1) {
                            val = transfer(val);
                            //this.sceneRatio = val;
                            $scope.formsData.scene.sceneRatio = val;
                            $scope.formsData.scene.otherRatio = val;
                        }
                    },
                    checkRadio: function (e) {
                        var ratio = this.sceneRatio;
                        var el = e.target || e.srcElement;
                        return (el.value === ratio) ? true : false;
                    },
                    setPanelStatus: function (status) {
                        this.consolePanelStatus = typeof status !== 'undefinded' ? status : !this.consolePanelStatus;
                        return this.getPanelTemplate();
                    },
                    removeBackground: function (src) {
                        var type = this.elementType;
                        var key = 'background';
                        delete $scope.formsData[type][key];
                        this.update('Monitor:removeBackground', src);
                    },
                    addNode: function () {
                        return this.update('Monitor:addNode');
                    },
                    addEcharts: function (type) {
                        return this.update('Monitor:createEcharts', type);
                    },
                    save: function () {
                        return this.update('Monitor:save', $scope.formsData);
                    }
                };
                $scope.formsData = {
                    scene: {
                        sceneRatio: '16:9',
                        otherRatio: '',
                        backgroundColor: '',
                    },
                    node: {
                        textPositiont: 'Middle_Center',
                        textPositionValue: '中'
                    },
                    echart: {},
                    link: {}
                };
                var imagesCache = {};
                $scope.canvasManager.imageUpload = function (file) {
                    return Upload.upload({
                            url: '/api/tmu/imageUpload?type=' + $scope.canvasManager.elementType,
                            data: {
                                file: file
                            }
                        })
                        .then(function (resp) {
                            resp = resp.data;
                            console.log(resp);
                            if (resp.status - 0 === 0) {
                                var type = $scope.canvasManager.elementType;
                                var key = 'background';
                                $scope.formsData[type][key] = resp.data.file.path;
                                // canvas:setSceneBackground
                                $scope.$parent.$broadcast('Monitor:setSceneBackground', resp.data.file.path);
                            }
                            //  console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data);
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        });
                };
                $scope.$on('colorPicked', function (event, color) {
                    var type = $scope.canvasManager.elementType;
                    var key = '';
                    switch (type) {
                        case 'scene':
                        case 'echart':
                            key = 'backgroundColor';
                            break;
                        case 'node':
                            key = 'textColor';
                            break;
                        case 'link':
                            key = 'linkColor';
                            break;
                    }
                    (key !== '') && ($scope.formsData[type][key] = color, $scope.$parent.$broadcast('Monitor:setSceneBackgroundColor', {
                        type: type,
                        key: key,
                        color: color
                    }));
                });
                $scope.$on('Manager:setPanelStatus', function (e, data) {
                    $scope.canvasManager.elementType = data.elementType || 'scene';
                    return $scope.canvasManager.setPanelStatus.call($scope.canvasManager, true);
                });
                $scope.$on('Manager:cancelPanelStatus', function (e, data) {
                    $scope.canvasManager.elementType = 'scene';
                    return $scope.canvasManager.setPanelStatus.call($scope.canvasManager, false);
                });
                $scope.$on('Manager:updateElementType', function (e, data) {
                    return $scope.canvasManager.elementType = !!data && data.elementType ? data.elementType : 'scene';
                });
                $scope.$watch('canvasManager.consolePanelStatus + canvasManager.elementType', function (newValue, oldValue) {
                    return $scope.canvasManager.getPanelTemplate.apply($scope.canvasManager, [].slice.call(arguments, 0));
                });
                $scope.$watch('formsData.node.nodeName', function (newValue, oldValue) {
                    if (!!newValue && newValue !== oldValue) {
                        $scope.canvasManager.update('Monitor:setMonitorText', {
                            text: newValue
                        });
                    }
                });
                $scope.$watch('formsData.link.linkName', function (newValue, oldValue) {
                    if (newValue !== null && newValue !== oldValue) {
                        $scope.canvasManager.update('Monitor:setMonitorText', {
                            text: newValue
                        });
                    }
                });
            }
        };
        return directive;
    }])
    .directive('canvas', ['$timeout', '$q', 'fetchService', 'CONFIG', function ($timeout, $q, fetchService, CONFIG) {
        var directive = {
            restrict: 'A',
            // replace: true,
            scope: true,
            //    require: '?^canvasManager',
            template: '\
                <canvas id="canvas-scene"></canvas>\
                <div class="canvas-background" id="canvas-scene-background"></div>\
                <div class="canvas-background" id="canvas-scene-backgroundColor"></div>\
                <div class="canvas-manager" ng-show="radarMonitor.canvasManager.status" style="left:{{radarMonitor.canvasManager.x}};top:{{radarMonitor.canvasManager.y}}"  ng-click="MonitorController.setManager($event)">\
                    <a ng-repeat="item in radarMonitor.canvasManager.items" href="{{item.url}}" class="{{item.name}}" title="{{item.title}}"><i class="{{item.icon}}"></i></a>\
                </div>\
                <div id="echartsContainer">\
                    <echarts ng-repeat="list in radarMonitor.EchartsList" ec-config="list"></echarts>\
                </div>\
            ',
            controller: function ($scope) {
                var _this = this;
                this.consolePanelStatus = 0; //控制台开关
                this.loopType = 1; //1: 同步同线程, 2: 异步多线程
                this.canvas = $scope.$parent.canvasConf.canvas;
                this.editor = 'canvas-editor';
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
                oCorner.src = CONFIG.webRoot + 'modules/common/canvas/img/scale.png';
                this.canvasManager = {
                    status: false,
                    x: '0px',
                    y: '0px',
                    items: []
                };
                this.pixelRatio = CONFIG.pixelRatio; //屏幕分辨率
                this.EchartsList = [];
                var eChartOptions = $scope.$parent.eChartOptions || {};
                this.MonitorFactory = function (type, data) {
                    var echarts = angular.copy(eChartOptions[type]) || {};
                    if (!data) {
                        data = {};
                    }
                    var factory = {};
                    var defaultSize = {
                        width: 800
                    };
                    factory = angular.extend(factory, data, true);
                    if (!echarts) {
                        factory.elementType = factory.elementType || type;
                        factory.id = factory.id || type + '_' + Math.floor(Math.random() * 100000 + 1);
                        factory.config = factory.config || {
                            size: {
                                width: factory.width || defaultSize.width,
                                height: factory.height || CONFIG.getFixedSize($scope.globalRatio || '4:3', defaultSize.width)
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
                                width: factory.width || defaultSize.width,
                                height: factory.height || CONFIG.getFixedSize($scope.globalRatio || '4:3', defaultSize.width)
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
                var conf = $scope.$eval($attrs.canvas);
                var getFixedSize = CONFIG.getFixedSize;
                var currentNode;
                var MonitorController = function () {
                    var win = $(window),
                        endNode,
                        tmpx,
                        tmpy,
                        isDragging,
                        validation,
                        ratio = '4:3',
                        pixel = $ctrl.pixelRatio, //调整清晰度, 1: 普清, 2: 高清
                        strr = '';
                    return {
                        _nodesCache: {},
                        canvasManagerItems: {
                            echart: [
                                {
                                    name: 'remove',
                                    title: '删除',
                                    url: '',
                                    icon: 'icon-trash'
                                }
                               // { name: 'config', title: '配置', url: '', icon: 'icon-cog' }
                            ],
                            node: [
                                {
                                    name: 'remove',
                                    title: '删除',
                                    url: '',
                                    icon: 'icon-trash'
                                },
                              //  { name: 'config', title: '配置', url: '', icon: 'icon-cog' },
                                {
                                    name: 'addLine',
                                    title: '添加连线',
                                    url: '',
                                    icon: 'icon-link'
                                },
                                {
                                    name: 'cw',
                                    title: '顺时针旋转',
                                    url: '',
                                    icon: 'icon-repeat'
                                },
                                {
                                    name: 'ccw',
                                    title: '逆时针旋转',
                                    url: '',
                                    icon: 'icon-undo'
                                }

                            ],
                            link: [
                                {
                                    name: 'remove',
                                    title: '删除连线',
                                    url: '',
                                    icon: 'icon-trash'
                                },
                              //  { name: 'config', title: '配置', url: '', icon: 'icon-cog' },

                            ]
                        },
                        init: function (args) {
                            if (!args) {
                                args = {};
                            }
                            var _this = this;
                            this.config = conf;
                            $timeout(function () {
                                var rootDom = $($element[0]);
                                var w = rootDom.width();
                                var h = getFixedSize(ratio, w) || rootDom.height();
                                rootDom.height(h);
                                var x = rootDom.offset()
                                    .left;
                                var y = rootDom.offset()
                                    .top;
                                //生成canvas背景颜色层 
                                args.width = w;
                                args.height = h;
                                _this.createCanvasBgColor(args);
                                //生成canvas背景图片层
                                _this.createCanvasBg(args);
                                //生成大屏展现主canvas
                                var canvas = document.getElementById($ctrl.canvas);
                                canvas.height = h * 2;
                                canvas.width = w * 2;
                                canvas.style.zIndex = 9;
                                canvas.style.height = h + 'px';
                                canvas.style.width = w + 'px';
                                var scene = new JTopo.Scene();
                                var stage = new JTopo.Stage(canvas, {
                                    pixel: 2,
                                    x: x,
                                    y: y
                                });
                                _this.Scene = scene;
                                _this.Stage = stage;
                                _this.config.Container = rootDom[0];
                                _this.config.x = x;
                                _this.config.y = y;
                                _this.config.width = w;
                                _this.config.height = h;
                                //  _this.loadSceneConf();
                                _this._initEvent();
                                _this.render();
                                conf.mode && (_this.Stage.mode = conf.mode);
                                _this.rootDom = rootDom;
                                _this.currentNode = currentNode;
                                console.log('scene:', _this.Scene, '\nstage: ', _this.Stage);
                            }, 0);
                            return this;
                        },
                        createCanvasBgColor: function (args) {
                            if (!args.width) {
                                args.width = this.config.width;
                                args.height = this.config.height;
                            }
                            if (!this.SceneBgColor) {
                                var canvasBgColor = document.getElementById($ctrl.canvas + '-backgroundColor');
                                this.SceneBgColor = canvasBgColor;
                                canvasBgColor.style.zIndex = 0;
                            } else {
                                var canvasBgColor = this.SceneBgColor;
                            }
                            canvasBgColor.style.height = args.height + 'px';
                            canvasBgColor.style.width = args.width + 'px';
                            if (!!args.backgroundColor) {
                                this.SceneBgColor.style.backgroundColor = 'rgba(' + args.backgroundColor + ',' + (args.alpha || 1) + ')';
                            }
                            return canvasBgColor;
                        },
                        createCanvasBg: function (args) {
                            if (!args.width) {
                                args.width = this.config.width;
                                args.height = this.config.height;
                            }
                            if (!this.SceneBg) {
                                var canvasBg = document.getElementById($ctrl.canvas + '-background');
                                this.SceneBg = canvasBg;
                                canvasBg.style.zIndex = 1;
                            } else {
                                var canvasBg = this.SceneBg;
                            }
                            canvasBg.style.height = args.height + 'px';
                            canvasBg.style.width = args.width + 'px';
                            if (!!args.background) {
                                this.SceneBg.style.background = 'url(' + args.background + ') no-repeat center top';
                                this.SceneBg.style.backgroundSize = '80% auto';
                            } else {
                                this.SceneBg.style.background = 'none';
                            }
                            return canvasBg;
                        },
                        setSceneRatio: function (a) {
                            var args = {
                                background: this.SceneBg.style.background,
                                backgroundColor: this.SceneBgColor.style.backgroundColor
                            };
                            var _this = this;
                            ratio = a;
                            $scope.globalRatio = ratio;
                            var originSize = {
                                width: this.config.width,
                                height: this.config.height
                            };
                            var width = this.config.width;
                            var height = getFixedSize(ratio, width);
                            args.width = width;
                            args.height = height;
                            this.config.width = width;
                            this.config.height = height;
                            this.config.Container.style.height = height + 'px';
                            this.Stage.canvas.width = width * pixel;
                            this.Stage.canvas.height = height * pixel;
                            this.Stage.canvas.style.width = width + 'px';
                            this.Stage.canvas.style.height = height + 'px';
                            var nodes = this._nodesCache;
                            angular.forEach(nodes, function (v) {
                                _this.updateEcharts(v, {
                                    ratioW: width / originSize.width,
                                    ratioH: height / originSize.height
                                });
                            });
                            this.createCanvasBg({});
                            this.createCanvasBgColor({});
                        },
                        updateEcharts: function (node, opts) {
                            if (!opts) {
                                opts = node.option || {};
                            }
                            var cw = node.config.size.width * pixel;
                            var ch = node.config.size.height * pixel;
                            var w = opts.width || node.config.size.width * pixel;
                            var h = opts.height || node.config.size.height * pixel;
                            node.config.size.width = w / pixel;
                            node.config.size.height = h / pixel;
                            node.echarts.resize({
                                width: w / pixel,
                                height: h / pixel
                            });
                            node.width = w;
                            node.height = h;
                            node.sourceCanvas.width = w;
                            node.sourceCanvas.height = h;
                            node.sourceCanvas.style.width = w / pixel + 'px';
                            node.sourceCanvas.style.height = h / pixel + 'px';
                            // 坐标同步微调
                            /*   var step = ch / h;
                                 var cx = node.x / step;
                                 var cy = node.y / step;
                                 node.config.offset.x = node.x;
                                 node.config.offset.y = cy;
                                // node.x = cx;
                                 node.y = cy;
                             */
                            node.echarts.setOption(node.option);
                            //  this._realTimeEcharts(node);
                        },
                        setBackground: function (url) {
                            var _this = this;
                            var type = !!currentNode ? currentNode.elementType : 'scene';
                            switch (type) {
                                case 'scene':
                                    this.createCanvasBg({
                                        background: url
                                    });
                                    break;
                                case 'echart':
                                    currentNode.option.backgroundColor = 'transparent';
                                    currentNode.config.background = url;
                                    this.updateEchartBackground(currentNode);
                                    break;
                                case 'node':
                                    currentNode.setImage(url);
                                    currentNode.Image = url;
                                    break;
                            }
                        },
                        removeBackground: function () {
                            var type = !!currentNode ? currentNode.elementType : 'scene';
                            switch (type) {
                                case 'scene':
                                    this.createCanvasBg({
                                        background: null
                                    });
                                    break;
                                case 'echart':
                                    this.removeEchartBackground(currentNode);
                                    break;
                                case 'node':
                                    currentNode.setImage(url);
                                    currentNode.Image = url;
                                    break;
                            }
                        },
                        _getEchartBgLayer: function (node) {
                            var id = node.id + '_background';
                            var oLayer = document.getElementById(id);
                            if (!oLayer) {
                                oLayer = document.createElement('div');
                                oLayer.className = 'echart-background';
                                oLayer.id = id;
                                oLayer.node = node;
                                if (!this._echartsBackgroundCache) {
                                    this._echartsBackgroundCache = [];
                                }
                                this._echartsBackgroundCache[id] = oLayer;
                                this.rootDom.append(oLayer);
                            }
                            return oLayer;
                        },
                        removeEchartBackground: function (node) {
                            var oLayer = this._getEchartBgLayer(node);
                            oLayer = angular.element(oLayer);
                            delete node.config.background;
                            oLayer.remove();
                        },
                        updateEchartBackground: function (node) {
                            var oLayer = this._getEchartBgLayer(node);
                            oLayer = angular.element(oLayer);
                            var config = node.config;
                            if (config.background) {
                                oLayer.css({
                                    backgroundImage: 'url(' + config.background + ')'
                                });
                            }
                            oLayer.css({
                                width: config.size.width,
                                height: config.size.height,
                                left: node.x / CONFIG.pixelRatio + this.Scene.translateX / CONFIG.pixelRatio,
                                top: node.y / CONFIG.pixelRatio + this.Scene.translateY / CONFIG.pixelRatio,
                                display: 'block'
                            });
                            $timeout(function () {
                                node.echarts.setOption(node.option);
                            });
                        },
                        _Hex2RGB: function (hex) {
                            function hexToR(h) {
                                return parseInt((cutHex(h))
                                    .substring(0, 2), 16)
                            }

                            function hexToG(h) {
                                return parseInt((cutHex(h))
                                    .substring(2, 4), 16)
                            }

                            function hexToB(h) {
                                return parseInt((cutHex(h))
                                    .substring(4, 6), 16)
                            }

                            function cutHex(h) {
                                return h.charAt(0) == "#" ? h.substring(1, 7) : h
                            }
                            return hexToR(hex) + ',' + hexToG(hex) + ',' + hexToB(hex);
                        },
                        setBackgroundColor: function (data) {
                            var type = data.type,
                                key = data.key,
                                color = data.color ? this._Hex2RGB(data.color) : '0, 0, 0',
                                alpha = data.color ? 1 : 0;
                            switch (type) {
                                case 'scene':
                                    this.SceneBg.style.backgroundColor = 'rgba(' + color + ', ' + alpha + ')';
                                    break;
                                case 'echart':
                                    currentNode.option.backgroundColor = color ? 'rgba(' + color + ', ' + alpha + ')' : 'transparent';
                                    this.updateEcharts(currentNode);
                                    break;
                                case 'node':
                                    currentNode.fontColor = color;
                                    break;
                                case 'link':
                                    console.log(currentNode);
                                    currentNode.strokeColor = color;
                                    break;
                            }
                        },
                        loadSceneConf: function () {
                            var _this = this;
                            fetchService.get([{
                                    url: $ctrl.monitorApi,
                                    data: {}
                                }])
                                .then(function (ret) {
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
                                });
                        },
                        createEcharts: function (type, data) {
                            if (!data) {
                                data = {};
                            }
                            data.oCorner = $ctrl.oCorner;
                            var factory = $ctrl.MonitorFactory(type, data);
                            factory.canvas = this.Stage.canvas;
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
                            var oImg = oSource.echarts.getRenderedCanvas({
                                pixelRatio: (oSource.config.pixelRatio || 2)
                            });
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
                            }
                            return node;
                        },
                        _NodehandlerMouseup: function (event, node) {
                            currentNode = node;
                            tmpx = event.pageX - this.config.x + 30;
                            tmpy = event.pageY - this.config.y + 30;
                            $ctrl.nodeMenu.x = event.pageX - this.config.x + 10 + 'px';
                            $ctrl.nodeMenu.y = event.pageY - this.config.y - 20 + 'px';
                            $ctrl.nodeMenu.status = true;
                        },
                        _nodeHandlerClick: function (event, node) {
                            endNode = node;
                            $ctrl.canvasManager.status = false;
                            if (null != currentNode && currentNode != endNode && validation === true) {
                                strr = "";
                                this._createLink(currentNode, endNode, strr);
                                currentNode = null;
                                validation = false; //验证是否在当前节点上右键点击了添加节点
                            } else {
                                currentNode = node;
                                var item = this.canvasManagerItems[node.elementType];
                                if (!!item) {
                                    var menu = $ctrl.canvasManager.items || [];
                                    if (!this.compareArray(item, menu)) {
                                        $ctrl.canvasManager.items = item;
                                    }
                                    this.showManager(event, node);
                                    $scope.$parent.$broadcast('Manager:updateElementType', {
                                        elementType: currentNode.elementType
                                    });
                                }
                            }
                        },
                        _linkHandlerMouseup: function (event, link) {
                            currentNode = link;
                            this.showManager(event, link);
                            $scope.$parent.$broadcast('Manager:updateElementType', {
                                elementType: currentNode.elementType
                            });
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
                                    node.setImage(CONFIG.webRoot + 'modules/common/canvas/img/' + img, true);
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
                        render: function () {
                            return this.Stage.add(this.Scene);
                        },
                        remove: function () {
                            $ctrl.canvasManager.status = false;
                            this._nodesCache[currentNode.ecid] && delete this._nodesCache[currentNode.ecid];
                            if (currentNode.echarts) {
                                currentNode.echarts.dispose();
                                currentNode.echarts = {};
                            }
                            var id = currentNode.id + '_background';
                            var oBg = angular.element(document.getElementById(id));
                            if (oBg.length) {
                                oBg.remove();
                                delete this._echartsBackgroundCache[id];
                            }
                            this.Scene.remove(currentNode);
                            currentNode = null;
                        },
                        clear: function () {
                            this._nodesCache = {};
                            return this.Stage.clear();
                        },
                        compareArray: function (a, b) {
                            if (a.length !== b.length) {
                                return false;
                            }
                            var r = true;
                            angular.forEach(a, function (o, i) {
                                var item = b[i];
                                if (angular.isObject(o)) {
                                    angular.forEach(o, function (v, k) {
                                        if (v !== item[k]) {
                                            return r = false;
                                        }
                                    });
                                } else if (typeof o === 'string') {
                                    if (o !== item) {
                                        return r = false;
                                    }
                                }
                            });
                            return r;
                        },
                        showManager: function (evt, node) {
                            var el = currentNode || node;
                            var item = this.canvasManagerItems[currentNode.elementType];
                            if (item) {
                                var menu = $ctrl.canvasManager.items || [];
                                if (!this.compareArray(item, menu)) {
                                    $ctrl.canvasManager.items = item;
                                }
                                if (currentNode.elementType === 'link') {
                                    $ctrl.canvasManager.x = evt.pageX - this.config.x + 'px';
                                    $ctrl.canvasManager.y = evt.pageY - this.config.y - 30 + 'px';
                                } else {
                                    $ctrl.canvasManager.x = el.x / CONFIG.pixelRatio + (this.Scene.translateX / CONFIG.pixelRatio || 0) + 'px';
                                    $ctrl.canvasManager.y = el.y / CONFIG.pixelRatio + (this.Scene.translateY / CONFIG.pixelRatio || 0) - 27 + 'px';
                                }
                                $ctrl.canvasManager.status = true;
                            }
                        },
                        _echarthandlerMouseup: function (event, node) {
                            if (event.button === 0) {
                                currentNode = node;
                                $ctrl.canvasManager.status = false;
                                if (!!isDragging) {
                                    var opt = {
                                        width: node.width / pixel,
                                        height: node.height / pixel
                                            //  height: getFixedSize(ratio, node.width) / pixel
                                    };
                                    node.config.size = opt;
                                    node = angular.extend(node, opt, true);
                                    this.updateEcharts(node, {
                                        width: opt.width * pixel,
                                        height: opt.height * pixel
                                    });
                                    isDragging = null;
                                }
                                this.updateEchartBackground(currentNode);
                                $scope.$parent.$broadcast('Manager:updateElementType', {
                                    elementType: currentNode.elementType
                                });
                                this.showManager(event, node);
                            } else if (event.button === 2) {}
                            // $scope.$broadcast('Monitor:resetEcharts', opt);
                        },
                        _eventController: function (event) {
                            var type = event.type;
                            var e = event.target || event.srcElement;
                            switch (true) {
                                case (type === 'mouseup' && !e.elementType): //空白canvas单击事件
                                    $ctrl.canvasManager.status = false;
                                    currentNode = null;
                                    $scope.$parent.$broadcast('Manager:updateElementType');
                                    break;
                                case (type === 'mouseup' && e.elementType === 'echart'): //点击事件&& echart
                                    this._echarthandlerMouseup(event, e);
                                    break;
                                case (type === 'mouseup' && e.elementType === 'node'): //左键点击事件&& node
                                    event.button === 0 && this._nodeHandlerClick(event, e);
                                    break;
                                case (type === 'mouseup' && e.elementType === 'link'): //左键点击事件&& link
                                    event.button === 0 && this._linkHandlerMouseup(event, e);
                                    break;
                                    /* case (type === 'dblclick' && e.elementType === 'node'): //双击事件&& node
                                     case (type === 'dblclick' && e.elementType === 'link'): //双击事件&& link
                                         this.editElementValue.call(this, event, e);
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
                        setManager: function (e) {
                            e.preventDefault();
                            var dom = angular.element(e.target || e.srcElement)
                                .closest('a');
                            var node = currentNode;
                            switch (!0) {
                                case dom.hasClass('remove'):
                                    dom.siblings('.on')
                                        .removeClass('on');
                                    $scope.$parent.$broadcast('Manager:updateElementType');
                                    //   this._currentManager = null;
                                    this.remove();
                                    break;
                                case dom.hasClass('addLine'):
                                    if (dom.hasClass('on')) {
                                        return;
                                    }
                                    validation = true;
                                    dom.addClass('on')
                                        .siblings('.on')
                                        .removeClass('on');
                                    break;
                                case dom.hasClass('cw'):
                                    currentNode.rotate += 0.5;
                                    dom.siblings('.on')
                                        .removeClass('on');
                                    break;
                                case dom.hasClass('ccw'):
                                    currentNode.rotate -= 0.5;
                                    dom.siblings('.on')
                                        .removeClass('on');
                                    break;
                            }
                        },
                        getConsolePanelStatus: function () {
                            return $ctrl.consolePanelStatus;
                        },
                        setConsolePanelStatus: function () {
                            $scope.canvasConf.consolePanelStatus = ~~!$scope.canvasConf.consolePanelStatus;
                            return $ctrl.consolePanelStatus = $scope.canvasConf.consolePanelStatus;
                        },
                        _initEvent: function () {
                            var _this = this,
                                _timer;
                            /* this.Scene.dbclick(function (e) {
                                 $timeout.cancel(_timer);
                                 _timer = null;
                                 return _this._eventController.call(_this, e);
                             });*/
                            this.Scene.mousedrag(function (e) {
                                var node = e.target || e.srcElement;
                                if (!isDragging && !!node.selectedPoint) {
                                    isDragging = e;
                                }
                                $timeout(function () {
                                    if (node && node.option) {
                                        var id = node.id + '_background';
                                        if (!!_this._echartsBackgroundCache && _this._echartsBackgroundCache[id]) {
                                            _this._echartsBackgroundCache[id].style.display != 'none' && (_this._echartsBackgroundCache[id].style.display = 'none');
                                        }
                                    }!!$ctrl.canvasManager.status && ($ctrl.canvasManager.status = false);
                                });
                                // return _this._eventController.call(_this, e);
                            });
                            this.Scene.mouseup(function (e) {
                                return $timeout(function () {
                                    _this._eventController.call(_this, e);
                                });
                            });
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
                var _this = MonitorController;
                $scope.$on('Monitor:save', function (event, data) {
                    return _this._save.call(_this, event, data);
                });
                $scope.$on('Monitor:setStage', function (event, data) {
                    return $timeout(function () {
                        _this.setStage.call(_this, data);
                    });
                });
                $scope.$on('Monitor:setConsolePanelStatus', function (event, data) {
                    return $timeout(function () {
                        _this.setConsolePanelStatus.call(_this, data);
                    });
                });
                $scope.$on('Monitor:createEcharts', function (e, data) {
                    return _this.createEcharts.call(MonitorController, data);
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
                $scope.$on('Monitor:setTextPosition', function (event, data) {
                    return currentNode && (currentNode.textPosition = data.textPosition);
                });
                $scope.$on('Monitor:setMonitorText', function (event, data) {
                    if (currentNode) {
                        if (!!data.text) {
                            currentNode.text = data.text;
                        }
                        if (data.textColor) {
                            currentNode.fontColor = data.textColor;
                        }
                        if (data.textPosition) {
                            currentNode.textPosition = data.textPosition;
                        }
                    }
                });
                $scope.$on('Monitor:removeBackground', function (event, data) {
                    return _this.removeBackground.apply(_this, angular.isArray(data) ? data : [data]);
                });
                $scope.$on('Monitor:setSceneBackground', function (event, data) {
                    return _this.setBackground.apply(_this, angular.isArray(data) ? data : [data]);
                });
                $scope.$on('Monitor:setSceneBackgroundColor', function (event, data) {
                    return _this.setBackgroundColor.apply(_this, angular.isArray(data) ? data : [data]);
                });
                $scope.$on('Monitor:setSceneRatio', function (event, data) {
                    return _this.setSceneRatio.apply(_this, angular.isArray(data) ? data : [data]);
                });
            }
        };
        return directive;
    }]);

