/**
 * @file tables_controller the file
 */
'use strict';
angular.module(window.ProjectName).controller('dashboard_controller',
    function ($rootScope, $scope, $state, $log, $stateParams, $timeout, CONFIG, fetchService) {
        var api = CONFIG.api[$state.current.name];
        $scope.sortableConf = {
            config: [
                {dom: 'this', items: '.sortable-row', handle: '.panel-heading', connectWith: '.sortable-row'}
               // {dom: '.sortable-row', items: '.panel', handle: '.panel-heading', connectWith: '.sortable-row'}
            ]
        };
        $scope.tablesConf = {
            model: 'edit'
        };
        $scope.tablesPanel = [];
        $scope.tablesPanel.push({
            id: 1,
            cols: 12,
            order: 1,
            tables: {
                title: '测试表格',
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
            perpage: 10,
            total: 3,
            currentpage: 1,
        },
        {
            id: 2,
            cols: 12,
            order: 2,
            tables: {
                title: '测试表格2',
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
            perpage: 10,
            total: 3,
            currentpage: 1,
        });

    });
