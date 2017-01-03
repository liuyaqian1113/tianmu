/**
 * Created by panjian01 on 2016/12/21.
 */
angular.module(window.ProjectName)
    .directive('sfComponents', function ($timeout, CONFIG, fetchService) {
        return {
            scope: true,
            restrict: 'AE',
            replace: true,
            templateUrl: CONFIG.webRoot + 'modules/common/tables/components.html',
            controller: function ($scope) {
                this.componentsFactory = {
                    searchs: [
                        {
                            name: 'dateTime',
                            order: 1,
                            title: '时间',
                            tmpl: 'tmpl/tables/searchs/dateTime.html',
                            data: {}
                        },
                        {
                            name: 'dateTimeRange',
                            order: 2,
                            title: '时间范围',
                            tmpl: 'tmpl/tables/searchs/dateTimeRange.html',
                            data: {}
                        }
                    ],
                    tables: [
                        {
                            name: 'talbe',
                            order: 1,
                            title: '数据表格',
                            tmpl: CONFIG.webRoot + 'modules/common/tables/table.html',
                            data: {
                                id: 0,
                                cols: 12,
                                api: '',
                                apiRate: 0,
                                title: '数据报表名称',
                                tables: {
                                    headers: []
                                },
                                showpage: false
                            }
                        },
                        {
                            name: 'line',
                            order: 2,
                            title: '折线图',
                            tmpl: '',
                            data: {
                                id: 0,
                                cols: 12,
                                api: '',
                                apiRate: 0,
                                title: '折线图名称'
                            }
                        },
                        {
                            name: 'scotter',
                            order: 3,
                            title: '飞行图',
                            tmpl: '',
                            data: {
                                id: 0,
                                cols: 12,
                                api: '',
                                apiRate: 0,
                                title: '飞行图名称'
                            }
                        }
                    ]
                };
                this.getSource = function (key, source) {
                    var data = null;
                    angular.forEach(source, function (v) {
                        if (v.name === key) {
                            return data = v;
                        }
                    });
                    return data;
                };
            },
            link: function (scope, element, attrs, ctrl) {
                $timeout(function () {
                    scope.componentsFactory = ctrl.componentsFactory;
                    scope.createSearchs = function (category) {
                        var factory = ctrl.getSource(category, ctrl.componentsFactory.searchs);
                        if (factory) {
                            factory.data.type = category;
                            factory.data.key = category + '_' + Math.floor(Math.random() * 1000000 + 1);
                            factory.data.order = scope.tablesDataSource.searchsPanel.length + 1;
                            var newSource = angular.copy(factory);
                            scope.tablesDataSource.searchsPanel.push(newSource);
                        }
                    };
                    scope.createTables = function (category) {
                        var factory = ctrl.getSource(category, ctrl.componentsFactory.tables);
                        if (factory) {
                            var source = factory.data;
                            factory.data.type = category;
                            factory.data.key = category + '_' + Math.floor(Math.random() * 1000000 + 1);
                            factory.data.order = scope.tablesDataSource.tablesPanel.length + 1;
                            var newSource = angular.copy(factory);
                            scope.tablesDataSource.tablesPanel.push(newSource);
                            console.log(scope.tablesDataSource);
                        }
                    };
                });
            }
        }
    });

