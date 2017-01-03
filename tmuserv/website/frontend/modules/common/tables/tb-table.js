/**
 * Created by panjian01 on 2016/12/21.
 */
angular.module(window.ProjectName)
    .directive('sfTable', ['$timeout', '$modal', 'CONFIG', 'fetchService', 'PY',
        function ($timeout, $modal, CONFIG, fetchService, py) {
            return {
                scope: true,
                require: '?^sfTables',
                restrict: 'AE',
                templateUrl: CONFIG.webRoot + 'modules/common/tables/table.html',
                link: function (scope, element, attrs, ctrl) {
                    var tableConf = scope.$eval(attrs.sfTable);
                    var oElement = $(element);
                    scope.tablesModel = tableConf.model || 'edit';
                    var pScope = scope.$parent;
                    var pageContainer = $('#page-container');
                    scope.sourceData = {};
                    scope.previewData = {};
                    function renderTable (data, source) {
                        scope.sourceData = angular.extend(scope.sourceData, source);
                        var fields = data;
                        if (!scope.previewData[source.key]) {
                            scope.previewData[source.key] = {};
                        }
                        if (!!source.showpage) {
                            fields = data.slice(0, 10);
                            scope.previewData[source.key].total = data.length;
                            scope.previewData[source.key].perpage = 10;
                            scope.previewData[source.key].currentpage = 1;
                        }
                        scope.previewData[source.key].bodys = fields;
                    }
                    function setProps(data) {
                        scope.$root.$broadcast('Props:setTemplate', {type: 'table', url: CONFIG.webRoot + 'modules/common/tables/props-table.html', data: data});
                        $timeout(function () {
                            var cls = 'showprops';
                            if (pageContainer.hasClass(cls) && data.key === scope.sourceData.key) { //隐藏属性面板
                                pageContainer.removeClass(cls);
                            } else {
                                pageContainer.addClass(cls);
                                scope.sourceData = data;
                            }
                        }, 100);
                    }
                    /**
                    表格操作
                    e  点击对象
                    data   操作数据对象
                    source  操作数据对象的源数据
                    oParent 操作数据对象的上级数据对象
                    */
                    scope.toolsCtrl = function (e, data, source, oParent) {
                        var el = $(e.target || e.srcElement).closest('li.btn');
                        var oHead = el.closest('.thead');
                        var oSource = source || scope.tablesPanel;
                        var dataMap = CONFIG.getDataById(data.key, oSource);
                        switch (el.attr('data-id')) {
                            case 'addHeaderRows': // 新增表格行
                                if (!data.tables) {
                                    data.tables = {};
                                    if (!data.tables.headers) {
                                        data.tables.headers = [];
                                    }
                                }
                                var rowsData = {
                                    key: data.key + '_' + oSource.length,
                                    order: data.tables.headers.length + 1,
                                    subs: []
                                };
                                data.tables.headers.push(rowsData);
                                scope.$emit('Sortable:updateEvent', true);
                                break;
                            case 'addHeaderCols': // 新增表格列
                                var def_name = '请输入列名';
                                var colsData = {
                                    text: def_name,
                                    py: py.get(def_name),
                                    cols: 1,
                                    rows: 1,
                                    order: data.subs.length + 1,
                                    hasOrder: false,
                                    hasDrag: false,
                                    key: source.key + '_' + oHead.index() + '_' + data.subs.length
                                };
                                $timeout(function () {
                                    data.subs.push(colsData);
                                    scope.$emit('Sortable:updateEvent', true);
                                });
                                break;
                            case 'removeCols': // 删除表格列
                                dataMap = CONFIG.getDataById(source.key, oSource);
                                if (!!confirm('确定删除表格项【' + dataMap.item.text + '】? ')) {
                                    $timeout(function () {
                                        angular.isArray(dataMap.parent) && dataMap.parent.splice(dataMap.index, 1);
                                    });
                                }
                                break;
                            case 'removeRows':
                                if (!!confirm('确定删除表头?')) {
                                    $timeout(function () {
                                        var index = oHead.index();
                                        // oHead.remove();
                                        (oParent && angular.isArray(oParent)) && oParent.splice(index, 1);
                                    });
                                }
                                break;
                            case 'setProps': // 配置表格属性
                                setProps(data);
                                break;
                            case 'addWidth': // 增加表格宽度
                                switch (data.cols) {
                                    case 3:
                                        data.cols = 4;
                                        break;
                                    case 4:
                                        data.cols = 6;
                                        break;
                                    case 6:
                                        data.cols = 12;
                                        break;
                                }
                                break;
                            case 'minusWidth': // 减少表格宽度
                                switch (data.cols) {
                                    case 12:
                                        data.cols = 6;
                                        break;
                                    case 6:
                                        data.cols = 4;
                                        break;
                                    case 4:
                                        data.cols = 3;
                                        break;
                                }
                                break;
                            case 'addFlex': // 增加列宽度比例
                                if (dataMap.siblings <= 1) {
                                    return;
                                }
                                if (data.cols >= 12) {
                                    return data.cols = 12;
                                }
                                $timeout(function () {
                                    data.cols = data.cols + 1;
                                });
                                break;
                            case 'minusFlex': // 减少列宽度比例
                                if (dataMap.siblings <= 1) {
                                    return;
                                }
                                if (data.cols <= 1) {
                                    return data.cols = 1;
                                }
                                $timeout(function () {
                                    data.cols = data.cols - 1;
                                });
                                break;
                            case 'removeTable': // 移除表格
                                if (confirm('\n\n确定移除表格 【' + data.title + '】?\n\n\n')) {
                                    angular.forEach(oSource, function (v, k) {
                                        if (data.key === v.key) {
                                            oSource.splice(k, 1);
                                            pScope.cancel();
                                        }
                                    });
                                }
                                break;
                            case 'preview': // 预览模式
                                if (tableConf.model === 'edit') {
                                    tableConf.model = 'preview';
                                    el.attr('title', '编辑模式')
                                        .find('.icon-eye-open')
                                        .removeClass('icon-eye-open')
                                        .addClass('icon-pencil');
                                    console.log(scope.sourceData);
                                } else {
                                    tableConf.model = 'edit';
                                    el.attr('title', '预览模式')
                                        .find('.icon-pencil')
                                        .removeClass('icon-pencil')
                                        .addClass('icon-eye-open');
                                }
                                break;
                            case 'addDashboard': // 添加到聚合页
                                if (!data.tables.headers.length || !scope.previewData[source.key]) {
                                    return scope.$root.poplayer = {
                                        type: 'error',
                                        content: '请先完善数据报表'
                                    };
                                }
                                return scope.$root.poplayer = {
                                    type: 'succ',
                                    content: '操作成功!'
                                };
                                break;
                        }
                    };
                    scope.editRowsContent = function (e, rowData) {
                        var el = $(e.target || e.srcElement);
                        var type = e.type;
                        switch (type) {
                            case 'dblclick':
                                if (tableConf.model !== 'edit') {
                                    return;
                                }
                                (el.length) && el.attr('contenteditable', true);
                                el.css({'background-color': '#FFE793'});
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
                                el.css({'background-color': ''});
                                break;
                        }
                    };
                    scope.$on('Tables:tablePreview', function (event, data) {
                        if (!!data) {
                            console.log(data);
                            renderTable(data.data, data.source);
                        }
                    });
                }
            }
    }]);

