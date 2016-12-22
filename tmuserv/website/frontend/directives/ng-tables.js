/**
 * Created by panjian01 on 2016/12/21.
 */
angular.module(window.ProjectName)
    .directive('ngColumnsTools', function ($timeout, $modal, CONFIG) {
        return {
            scope: true,
            restrict: 'A',
            replace: true,
            templateUrl: 'tmpl/headersTools.html',
            link: function (scope, element, attrs) {
                scope.toolsConf = scope.$eval(attrs.ngColumnsTools);
                scope.tablesModel = scope.toolsConf.model;
                scope.toolsConf.oTools = $(element);
                scope.toolsConf.currentColmns = [];

            }
        };
    })
    .directive('ngTables', function ($timeout, $modal, CONFIG) {
        return {
            scope: true,
            restrict: 'A',
            templateUrl: 'tmpl/tables.html',
            controller: function ($scope) {
                this.talbeTools = [
                    {name: 'addCols', title: '新增表格项', url: '', icon: 'icon-plus'},
                    {name: 'splitCols', title: '拆分表格项', url: '', icon: 'icon-columns'},
                    {name: 'mergeCols', title: '合并表格项', url: '', icon: 'icon-link'},
                    {name: 'delete', title: '删除表格头', url: '', icon: 'icon-remove'}
                ];
                this.tableToolsTmpl = '\
                    <ul id="tableTools" class="panel-headers-tools" ng-if="tablesModel == \'edit\'">\
                        <li class="btn btn-xs btn-nonebg" data-id="addCols" ng-click="headersAddCols(header)" title="新增表格项"><i class="icon-plus"></i></li>\
                        <li class="btn btn-xs btn-nonebg" data-id="splitCols" ng-click="headersSplitCols(header)" title="拆分表格项"><i class="icon-cut"></i></li>\
                        <li class="btn btn-xs btn-nonebg" data-id="mergeCols" ng-click="heardersMergeCols(header)" title="合并表格项"><i class="icon-link"></i></li>\
                        <li class="btn btn-xs btn-nonebg" data-id="deleteRows" ng-click="heardersRemove(header)" title="删除表格行"><i class="icon-trash"></i></li>\
                    </ul>\
                ';

            },
            controllerAs: 'tableManager',
            link: function (scope, element, attrs, ctrl) {
                var tableConf = scope.$eval(attrs.ngTables);
                var oElement = $(element);
                scope.tablesModel = tableConf.model;
                if (scope.tablesModel !== 'edit') {
                    return;
                }
                var pScope = scope.$parent;
                var pageContainer = $('#page-container');
                scope.sourceData = {};
                var dataFactory = {
                    id: '',
                    key: 0,
                    type: 'table',
                    order: 0,
                    title: '',
                    showpage: 0,
                    api: ''
                };

                pScope.ok = function(){
                    pScope.dataConfig.showpage = pScope.dataConfig.showpage - 0;
                    scope.sourceData = angular.extend(scope.sourceData, pScope.dataConfig);
                };
                pScope.cancel = function(){
                    pageContainer.removeClass('showprops');
                };
                scope.tablesProps = function (oTab) {
                    var cls = 'showprops';
                    if (pageContainer.hasClass(cls) && oTab.key === scope.sourceData.key) { //隐藏属性面板
                        pageContainer.removeClass(cls);
                    } else {
                        pageContainer.addClass(cls);
                        var formData = angular.copy(dataFactory);
                        scope.sourceData = oTab;
                        pScope.dataConfig = angular.extend(formData, scope.sourceData, true);
                        console.log(pScope.dataConfig);
                    }
                };
                scope.tablesAddCols = function (tab) {
                    switch (tab.cols) {
                        case 3:
                            tab.cols = 4;
                            break;
                        case 4:
                            tab.cols = 6;
                            break;
                        case 6:
                            tab.cols = 12;
                            break;
                        default:
                            break;
                    }
                };
                scope.tablesMinusCols = function (tab) {
                    switch (tab.cols) {
                        case 12:
                            tab.cols = 6;
                            break;
                        case 6:
                            tab.cols = 4;
                            break;
                        case 4:
                            tab.cols = 3;
                            break;
                        default:
                            break;
                    }
                };
                scope.tablesRemove = function (tab) {
                    var key = tab.key;
                    if (confirm('\n\n确定移除表格 【'+ tab.title +'】?\n\n\n')) {
                        angular.forEach(scope.tablesPanel, function (v, k) {
                            if (key === v.key) {
                                scope.tablesPanel.splice(k, 1);
                                pScope.cancel();
                            }
                        });
                    }
                };
                var currentNumber = 0;
                scope.tablesAddHeader = function (panel, type) {
                    var oPanels = scope.tablesPanel;
                    if (!panel.tables) {
                        panel.tables = {};
                        if (!panel.tables.headers) {
                            panel.tables.headers = [];
                        }
                    }
                    var headers = panel.tables.headers;

                    /*
                    [
                        {text: 'id', cols: 1, rows: 1, hasOrder: false, hasdrag: false, key: key + '_0_0'},
                        {text: 'name', cols: 1, rows: 1, hasOrder: false, hasdrag: false, key: key + '_0_1'},
                        {text: 'email', cols: 1, rows: 1, hasOrder: false, hasdrag: false, key: key + '_0_2'}
                    ]*/
                    switch (type) {
                        case 'rows': //新增行
                            var rows = [
                                {text: '新增表头'+(++currentNumber), cols: 1, rows: 1, hasOrder: false, hasDrag: false, key: panel.key + '_'+ headers.length +'_0'}
                            ];
                            headers.push(rows);
                            break;
                        case 'cols': //新增列
                            break;
                    }
                    scope.$emit('Sortable:updateEvent', true);
                };
                var getDataById = function (id, source, destroy) {
                    var oSource = source || scope.tablesPanel;
                    if (!oSource) {
                        return null;
                    };
                    var result = {};
                    function getDataObj (data) {
                        var _thisObj = arguments.callee;
                        angular.forEach(data, function (v, k) {
                            if (v.id - 0 === id - 0 || v.key === id) {
                                return result = {
                                    source: oSource,
                                    parent: data,
                                    item: v,
                                    index: k,
                                    siblings: data.length
                                };
                            } else {
                                if (angular.isArray(v) && !v.length && !!destroy) {
                                    data.splice(k, 1);
                                   // continue;
                                }
                                if (!angular.isArray(v) && !v instanceof Object) {
                                    return v;
                                }
                                _thisObj(v.tables || v.headers || (!angular.isArray(v) ? [] : v));
                            }
                        });
                        return result;
                    }
                    var node = getDataObj(oSource);
                    return node;
                };
                scope.deleteHeaderCols = function (e, thData) {
                    var oEl = $(e.target || e.srcElement);
                    var oHead = oEl.closest('.thead');
                    if (!!confirm('确定删除表头?')) {
                        var oPanels = scope.tablesPanel;
                        $timeout(function () {
                            var index = oHead.index();
                            oHead.remove();
                            angular.isArray(thData) && thData.splice(index, 1);
                        });
                    }

                };
                scope.headerTools = function (e, colsData) {
                    var eType = e.type;
                    var oTh = $(e.target || e.srcElement);
                    var oHead = oTh.closest('.thead');
                    var oTools = $('#tableTools');
                    var oPanels = scope.tablesPanel;
                    var offset = {
                        top: oHead.offset().top - oTools.height() - 10,
                        left: oTh.offset().left - 1
                    };
                    oTools.css(offset).show();
                    oTools.unbind().on('click', 'li', function (e) {
                        var el = $(e.target || e.srcElement).closest('li.btn');
                        console.log(colsData, oPanels);
                        var dataMap = getDataById(colsData.key, oPanels);
                        switch(el.attr('data-id')) {
                            case 'addCols':
                                var rowsData = {text: '新增项', cols: 1, rows: 1, hasOrder: false, hasDrag: false, key: dataMap.parent.key + '_' + oHead.index() + '_' + oHead.children().length};
                                $timeout(function () {
                                    dataMap.parent.push(rowsData);
                                    scope.$emit('Sortable:updateEvent', true);
                                });
                                break;
                            case 'addFlex':
                                if (colsData.cols >= dataMap.siblings - 1) {
                                    return colsData.cols = dataMap.siblings - 1;
                                }
                                $timeout(function () {
                                    colsData.cols = colsData.cols + 1;
                                });
                                break;
                            case 'minusFlex':
                                if (colsData.cols <= 1) {
                                    return colsData.cols = 1;
                                }
                                $timeout(function () {
                                    colsData.cols = colsData.cols - 1;
                                });
                                break;
                            case 'deleteRows':
                               // var dataMap = getDataById(colsData.key, oPanels);
                                
                                break;
                        }
                    });
                };
                scope.enableColsTitle = function (e, data) {
                    var el = $(e.target || e.srcElement);
                    el = el.closest('.th');
                    el.prop('contenteditable', true);
                };
                scope.disableColsTitle = function (e, data) {
                    var el = $(e.target || e.srcElement);
                    el = el.closest('.th');
                    el.removeProp('contenteditable');
                };
            }
        }
    });

