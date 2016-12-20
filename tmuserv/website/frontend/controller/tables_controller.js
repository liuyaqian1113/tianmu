/**
 * @file tables_controller the file
 */
'use strict';
angular.module(window.ProjectName).controller('tables_controller',
    function ($rootScope, $scope, $state, $log, $stateParams, $timeout, CONFIG, fetchService) {
        var api = CONFIG.api[$state.current.name];
        $scope.sortableConf = {
            config: [
                {dom: 'this', items: '.sortable-row', handle: '.panel-heading', connectWith: '.sortable-row', cancel: '.panel-heading-btn'}
               // {dom: '.sortable-row', items: '.panel', handle: '.panel-heading', connectWith: '.sortable-row'}
            ]
        };
        $scope.tablesConf = {
            model: 'edit'
        };
        var tablesFactory = {
            table: function () {
                return {
                    id: 1,
                    key: 'tables_' + Math.floor(Math.random() * 1000000 + 1),
                    cols: 12,
                    order: $scope.tablesPanel.length + 1,
                    api: 'api://',
                    title: '表格名称',
                    tables: {
                        headers: [
                            [
                                {text: 'id', cols: 1, rows: 1},
                                {text: 'name', cols: 1, rows: 1},
                                {text: 'email', cols: 1, rows: 1}
                            ]
                        ],
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
                        ]
                    },
                    showpage: 0,
                    perpage: 10,
                  //  total: 3,
                    currentpage: 1,
                };
            }

        };
        $scope.createTables = function (category) {
            var factory = tablesFactory[category];
            if (factory) {
                $scope.tablesPanel.push(factory());
            }
        };
        $scope.tablesPanel = [];
    });
