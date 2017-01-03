/**
 * Created by panjian01 on 2016/12/21.
 */
angular.module(window.ProjectName)
    // 组件面板
    .directive('sfComponentsPanel', ['$timeout', 'CONFIG', 'skyfallController', function ($timeout, CONFIG, skyfall) {
        return {
            scope: true,
            restrict: 'AE',
            replace: true,
            template: '<div ng-include="directiveContainer"></div>',
            compile: function (element, attrs) {
                return {
                    pre: function preLink(scope, element, attrs) {
                        var hash = 'components';
                        var getSource = function (key, source) {
                            var d = null;
                            angular.forEach(source, function (v) {
                                if (v.type === key) {
                                    return d = v;
                                }
                            });
                            return d;
                        };

                        function createSearchs(category) {
                            var factory = getSource(category, scope.componentsFactory.searchs);
                            if (factory) {
                                factory.key = category + '_' + Math.floor(Math.random() * 1000000 + 1);
                                factory.order = scope.tablesDataSource.searchsPanel.length + 1;
                                var newSource = angular.copy(factory);
                                // scope.$emit('Tables:createSearchs', newSource);
                               // scope.$root.$broadcast('Sortable:updateEvent', true);
                                scope.tablesDataSource.searchsPanel.push(newSource);
                            }
                        }

                        function createTables(category) {
                            var factory = getSource(category, scope.componentsFactory.tables);
                            if (factory) {
                                factory.key = category + '_' + Math.floor(Math.random() * 1000000 + 1);
                                factory.order = scope.tablesDataSource.tablesPanel.length + 1;
                                var newSource = angular.copy(factory);
                                // scope.$emit('Tables:createTables', newSource);
                                // scope.$root.$broadcast('Sortable:updateEvent', true);
                                scope.tablesDataSource.tablesPanel.push(newSource);
                            }
                        }
                        var oDir = new skyfall(scope, hash);
                        oDir.loadView('directiveContainer')
                            .then(function (data) {
                                scope.componentsFactory = data;
                                oDir.$on('createSearchs', createSearchs);
                                oDir.$on('createTables', createTables);
                            });
                    },
                    post: function postLink(scope, element, attrs) {}
                };
            }
        };
    }])
    // 属性面板
    .directive('sfProps', function ($timeout, CONFIG, fetchService, $q) {
        return {
            scope: true,
            restrict: 'AE',
            replace: true,
            template: '<div id="tables-table-props" class="tables-props" ng-include="templateUrl"></div>',
            link: function (scope, element, attrs) {
                var oContainer = $('#page-container');
                scope.propsData = {};
                scope.templateUrl = '';
                var fetchRemote = function (args) {
                    var defer = $q.defer();
                    fetchService.remote({
                            url: args.url,
                            type: args.method || 'get',
                            data: args.data || {
                                type: 1,
                                end_date: '20161031',
                                event: {
                                    "exposure": ["DEF_ALL_PV", "DEF_ALL_UV"],
                                    "liveusers": ["LIVE_RATE", "LIVE_UV"]
                                },
                                exp_id: 106,
                                start_date: '20160923'
                            }
                        })
                        .then(function (ret) {
                            ret = !!ret.length ? ret[0].data : ret.data;
                            if (ret.status - 0 === 0 || ret.errno - 0 === 0) {
                                defer.resolve(ret);
                            }
                        });
                    return defer.promise;
                };
                scope.ok = function (source) {
                    if (scope.propsData.type === 'table' && (!scope.propsData.headers.length || !scope.propsData.headers[scope.propsData.headers.length - 1].subs.length)) {
                        return scope.$root.poplayer = {
                            type: 'error',
                            content: '请先添加表头'
                        };
                    }
                    scope.propsData.api = !!source ? source.api : 'http://cq02-mco-sumeru475.cq02.baidu.com:8083/aunceladmin/singlestattable';
                    var api = $.trim(scope.propsData.api);
                    if (api !== '' && !!/^http(s)?:\/\//i.test(api)) {
                        fetchRemote({
                                url: api
                            })
                            .then(function (result) {
                                var data = result.data;
                                data.shift();
                                scope.$root.$broadcast('Tables:Preview', {
                                    data: data,
                                    source: source || scope.propsData
                                });
                            });
                    }
                };
                var showProps = function () {
                    oContainer.addClass('showprops');
                };
                var hideProps = function () {
                    oContainer.removeClass('showprops');
                };
                scope.cancel = function () {
                    hideProps();
                };
                scope.inputSource = {};
                var sourceCache = {};
                scope.testApi = function (source) {
                    scope.propsData.api = 'http://cq02-mco-sumeru475.cq02.baidu.com:8083/aunceladmin/singlestattable';
                    var api = $.trim(scope.propsData.api);
                    var key = (!!source) ? source.key : scope.propsData.key;
                    fetchRemote({
                            url: api
                        })
                        .then(function (result) {
                            var data = result.data;
                            data.shift();
                            data = data.slice(0, 10);
                            angular.forEach(data, function (v) {
                                scope.addDataSource(v[0], v[1], key);
                            });
                        });
                    scope.previewData[key] = {};
                };
                scope.destroyList[scope.destroyList.length - 1] = scope.$on('Props:getRemoteApi', function (event, data) {
                    if (!!data) {
                        data.type === 'table' ? scope.ok(data) : scope.testApi(data);
                    }
                });
                scope.addDataSource = function (key, val, token) {
                    token = token || scope.propsData.key;
                    if (!scope.previewData[token]) {
                        scope.previewData[token] = {};
                    }
                    if (!scope.previewData[token].source) {
                        scope.previewData[token].source = [];
                    }
                    if (!key || !val) {
                        return;
                    }
                    scope.previewData[token].source.push({
                        key: key,
                        val: val
                    });
                    if (scope.propsData.dataOrigin === 'static') {
                        scope.propsData.source = scope.previewData[token].source;
                        scope.inputSource.key = '';
                        scope.inputSource.val = '';
                    }
                };
                scope.destroyList[scope.destroyList.length - 1] = scope.$watch('propsData.dataOrigin', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        if (!sourceCache[scope.propsData.key]) {
                            sourceCache[scope.propsData.key] = {};
                        }
                        if (newVal === 'static') {
                            scope.propsData.api = '';
                            sourceCache[scope.propsData.key][newVal] && (scope.propsData.source = sourceCache[scope.propsData.key][newVal]);
                            scope.previewData[scope.propsData.key].source && (sourceCache[scope.propsData.key]['remote'] = scope.previewData[scope.propsData.key].source);
                            scope.previewData[scope.propsData.key].source = scope.propsData.source || [];
                        } else {
                            sourceCache[scope.propsData.key]['static'] = scope.propsData.source;
                            scope.propsData.source = [];
                            (scope.previewData[scope.propsData.key].source = sourceCache[scope.propsData.key][newVal]);
                        }
                    }
                });
                scope.destroyList[scope.destroyList.length - 1] = scope.$on('Props:setProps', function (event, data) {
                    if (!!data) {
                        var url = CONFIG.webRoot + 'modules/common/tables/components/' + data.data.type + '/props.html';
                        if (scope.templateUrl !== url) {
                            scope.templateUrl = url;
                        }
                        $timeout(function () {
                            var cls = 'showprops';
                            if (!scope.previewData[data.data.key]) {
                                scope.previewData[data.data.key] = {};
                            }
                            if (oContainer.hasClass(cls) && scope.propsData && data.data.key === scope.propsData.key) { //隐藏属性面板
                                hideProps();
                            } else {
                                showProps();
                                if (window.sfController && sfController[data.data.type]) {
                                    var ctrl = new sfController[data.data.type]({
                                        scope: scope,
                                        $timeout: $timeout,
                                        CONFIG: CONFIG
                                    });
                                    var def = ctrl.getDefaultProps ? ctrl.getDefaultProps() : {};
                                    angular.forEach(def, function (v, k) {
                                        if (!data.data[k]) {
                                            data.data[k] = v;
                                        }
                                    });
                                    scope.propsData = data.data;
                                } else {
                                    scope.propsData = data.data;
                                }
                                if (sourceCache[scope.propsData.key] && sourceCache[scope.propsData.key][scope.propsData.dataOrigin]) {
                                    scope.previewData[scope.propsData.key].source = sourceCache[scope.propsData.key][scope.propsData.dataOrigin];
                                }
                                if (!scope.previewData[scope.propsData.key].source && scope.propsData.dataOrigin === 'remote' && scope.propsData.api !== '') {
                                    scope.testApi();
                                }
                            }
                        }, 100);
                    }
                });
            }
        }
    })
    // 主体区域
    .directive('sfTables', ['$timeout', 'CONFIG', 'fetchService', 'PY', function ($timeout, CONFIG, fetchService, py) {
        return {
            scope: true,
            restrict: 'AE',
            // templateUrl: 'tmpl/tables.html',
            link: function (scope, element, attrs) {
                var tableConf = scope.$eval(attrs.sfTables);
                var oElement = $(element);
                scope.tablesModel = tableConf.model || 'edit';
                scope.isEditModel = (tableConf.model === 'edit');
                var pScope = scope.$parent;
                scope.destroyList[scope.destroyList.length - 1] = scope.$on('Tables:setController', function (event, data) {
                    if (!!data) {
                        if (!!sfController && typeof sfController === 'function') {
                            sfController = new data.fn({
                                scope: scope,
                                $timeout: $timeout,
                                py: py,
                                CONFIG: CONFIG
                            });
                            if (sfController.bind) {
                                sfController.bind('toolsCtrl');
                                sfController.bind('pickerOptions');
                                sfController.bind('pickerConf');
                            }
                        }
                        scope.$root.$broadcast('Sortable:updateEvent', true);
                    }
                });
                scope.destroyList[scope.destroyList.length - 1] = scope.$watch('tablesConf.model', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.tablesModel = newVal;
                        scope.isEditModel = (newVal === 'edit');
                    }
                }, true);
                scope.editRowsContent = function (e, rowData) {
                    var el = $(e.target || e.srcElement);
                    var type = e.type;
                    switch (type) {
                        case 'dblclick':
                            if (tableConf.model !== 'edit') {
                                return;
                            }
                            (el.length) && el.attr('contenteditable', true);
                            el.css({
                                'background-color': '#FFE793'
                            });
                            el[0].focus();
                            break;
                        case 'blur':
                            (el.length) && el.removeAttr('contenteditable');
                            var text = $.trim(el.text());
                            if (text !== '') {
                                text = text.replace(/(<[^>]*>)|(javascript)/ig, '');
                                rowData.text = text;
                                rowData.py = py.get(text);
                                el.text(text);
                            }
                            el.css({
                                'background-color': ''
                            });
                            break;
                    }
                };
                scope.putSelect = function (key, val, oSource) {
                    if (!oSource[oSource.type]) {
                        oSource[oSource.type] = {};
                    }
                    oSource[oSource.type].key = key;
                    oSource[oSource.type].val = val;
                };

                function setTableOrder(key, order, type) {
                    var data = CONFIG.getDataById(key, (type === 'search' ? scope.tablesDataSource.searchsPanel : scope.tablesDataSource.tablesPanel));
                    if (data) {
                        data.item.order = order + 1;
                    }
                };
                scope.destroyList[scope.destroyList.length - 1] = scope.$on('Tables:Preview', function (event, data) {
                    if (!!data) {
                        switch (data.source.type) {
                            case 'table':
                                sfController.render(data.data, data.source);
                                break;
                        }
                    }
                });
                scope.destroyList[scope.destroyList.length - 1] = scope.$on('Tables:setOrder', function (event, data) {
                    if (data) {
                        var newTables = [];
                        var order = data.order;
                        var type = data.type;
                        angular.forEach(order, function (v, i) {
                            setTableOrder(v, i, type);
                        });
                    }
                });
            }
        }
    }])
    // 组件模板代理
    .directive('sfComponentsTmplProxy', ['$timeout', 'CONFIG', function ($timeout, CONFIG) {
        return {
            scope: true,
            restrict: 'AE',
            replace: true,
            //  transclusion: true,
            // template: '<div class="{{components}}-panel" ng-sortable="sortableSearchConf" sf-tables="tablesConf"></div>',
            template: '<div ng-include="templateUrl"></div>',
            link: function (scope, element, attrs) {
                var data = attrs.options ? scope.$eval(attrs.options) : {
                    type: attrs.type
                };
                scope.templateUrl = '';
                var urls = [
                        CONFIG.webRoot + 'modules/common/tables/controller.js'
                    ];
                if (data.resolve && !!data.resolve.length) {
                    var resolve = data.resolve.map(function (item) {
                        return CONFIG.webRoot + item;
                    })
                    urls = resolve.concat(urls);
                }
                scope.templateUrl = CONFIG.webRoot + 'modules/common/tables/components/' + data.type + '/template.html';
                angular.loadJsCss(urls, function (res) {
                    if (!!window.sfController && res.type !== 'error') {
                        return $timeout(function () {
                            scope.$root.$broadcast('Tables:setController', {
                                type: data.type,
                                fn: window.sfController
                            });
                        });
                    }
                    console.log('请添加' + data.type + '控制器!');
                });
            }
        };
    }])
    // 日期组件指令
    .directive("dateRangePicker", function ($timeout, $compile) {
        var directive = {
            restrict: 'AE',
            scope: true,
            compile: function (element, attrs) {
                return function (scope, element, attrs) {
                    $timeout(function () {
                        var oType = attrs.dateType;
                        var start = oType === 'dateTime' ? moment() : moment()
                            .subtract(6, 'days');
                        var end = moment();

                        function cb(start, end) {
                            if (!scope.searchsData) {
                                scope.searchsData = {};
                            }
                            scope.searchsData.dateTimeRange = start.format('YYYY.MM.DD') + ' - ' + end.format('YYYY.MM.DD');
                        }
                        $(element)
                            .daterangepicker({
                                autoApply: true,
                                startDate: start,
                                singleDatePicker: oType === 'dateTime' ? true : false,
                                endDate: end,
                                maxDate: moment(),
                                ranges: oType === 'dateTime' ? {} : {
                                    '今天': [moment(), moment()],
                                    '前一天': [moment()
                                        .subtract(1, 'days'), moment()],
                                    '前一周': [moment()
                                        .subtract(6, 'days'), moment()],
                                    '前30天': [moment()
                                        .subtract(29, 'days'), moment()],
                                    '本月': [moment()
                                        .startOf('month'), moment()
                                        .endOf('month')],
                                    '上月': [moment()
                                        .subtract(1, 'month')
                                        .startOf('month'), moment()
                                        .subtract(1, 'month')
                                        .endOf('month')]
                                },
                                locale: {
                                    "format": "YYYY.MM.DD",
                                    "separator": " - ",
                                    "customRangeLabel": "自定义",
                                    "weekLabel": "周",
                                    "daysOfWeek": [
                                        "日",
                                        "一",
                                        "二",
                                        "三",
                                        "四",
                                        "五",
                                        "六"
                                    ],
                                    "monthNames": [
                                        "一月",
                                        "二月",
                                        "三月",
                                        "四月",
                                        "五月",
                                        "六月",
                                        "七月",
                                        "八月",
                                        "九月",
                                        "十月",
                                        "十一月",
                                        "十二月"
                                    ],
                                    "firstDay": 1
                                },
                            }, cb);
                        cb(start, end);
                    }, 300);
                };
            }
        };
        return directive;
    });

