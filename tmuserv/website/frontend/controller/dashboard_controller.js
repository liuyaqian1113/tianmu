/**
 * @file tables_controller the file
 */
'use strict';
angular.module(window.ProjectName)
    .controller('dashboard_controller', function ($rootScope, $scope, $state, $log, $stateParams, $timeout, CONFIG, fetchService) {
        var api = CONFIG.api[$state.current.name];
        $scope.sortableConf = {
            config: [
                {
                    dom: 'this',
                    items: '.sortable-row',
                    handle: '.panel-heading',
                    connectWith: '.sortable-row',
                    cancel: '.panel-heading-btn'
                },
                {
                    dom: '.table',
                    items: '.thead',
                    handle: '.rowsTools-drag',
                    connectWith: ''
                },
                {
                    dom: '.table .tr',
                    items: '.th',
                    handle: '.colsTools-drag',
                    connectWith: ''
                }
               // {dom: '.sortable-row', items: '.panel', handle: '.panel-heading', connectWith: '.sortable-row'}
            ]
        };
        $scope.tablesConf = {
            model: 'preview'
        };
        var tablesFactory = {
            table: function () {
                var type = 'table';
                var key = type + '_' + Math.floor(Math.random() * 1000000 + 1);
                return {
                    id: 1,
                    key: key,
                    type: type,
                    cols: 12,
                    order: $scope.tablesDataSource.tablesPanel.length + 1,
                    //   api: 'http://abtesting.baidu.com/aunceladmin/singlestattable',
                    api: '',
                    apiRate: 0,
                    title: '表格名称',
                    tables: {
                        headers: [
                            /*[
                                {text: 'id', cols: 1, rows: 1, hasOrder: false, hasdrag: false, key: key + '_0_0'},
                                {text: 'name', cols: 1, rows: 1, hasOrder: false, hasdrag: false, key: key + '_0_1'},
                                {text: 'email', cols: 1, rows: 1, hasOrder: false, hasdrag: false, key: key + '_0_2'}
                            ]*/
                        ]
                            /*,
                                                    bodys: [
                                                        [
                                                            {text: 1, cols: 1, rows: 1},
                                                            {text: 'Nicky Almera', cols: 1, rows: 1},
                                                            {text: 'nicky@hotamil', cols: 1, rows: 1}
                                                        ],
                                                        [
                                                            {text: 2, cols: 1, rows: 1},
                                                            {text: 'Edmund Wong', cols: 1, rows: 1},
                                                            {text: 'edmund@hotamil', cols: 1, rows: 1}
                                                        ],
                                                        [
                                                            {text: 3, cols: 1, rows: 1},
                                                            {text: 'Harvinder Singh', cols: 1, rows: 1},
                                                            {text: 'harvinder@hotamil', cols: 1, rows: 1}
                                                        ]
                                                    ]*/
                    },
                    showpage: false
                };
            }
        };
        $scope.createTables = function (category) {
            var factory = tablesFactory[category];
            if (factory) {
                $scope.tablesDataSource.tablesPanel.push(factory());
            }
        };
        $scope.editTablesName = function (e, data) {
            var el = $(e.target || e.srcElement)
                .closest('.tables-name-editor, .tables-name');
            var type = e.type;
            switch (type) {
                case 'click':
                    var oInput = el.siblings('.tables-name') || el;
                    (oInput.length) && oInput.attr('contenteditable', true);
                    oInput.css('background-color', '#FFE793');
                    oInput[0].focus();
                    break;
                case 'blur':
                    (el.length) && el.removeAttr('contenteditable');
                    var text = $.trim(el.text());
                    if (text !== '') {
                        text = text.replace(/(<[^>]*>)|(javascript)/ig, '');
                        data = text;
                        el.text(text);
                    }
                    el.css('background-color', '');
                    console.log($scope.tablesDataSource);
                    break;
            }
        };
        $scope.saveTables = function () {
            console.log($scope.tablesDataSource);
        };
        $scope.tablesDataSource = {};
        $scope.tablesDataSource.tablesName = '创建数据报表聚合页';
        $scope.tablesDataSource.tablesPanel = [];
    });

