/**
 * @file tables_controller the file
 */
'use strict';
angular.module(window.ProjectName)
    .controller('tables_controller', function ($rootScope, $scope, $state, $stateParams, $timeout, CONFIG, fetchService) {
        var api = CONFIG.api[$state.current.name];
        $scope.destroyList = [];
        $scope.sortableSearchConf = {
            config: [
                {
                    dom: 'this',
                    items: '.components',
                    handle: '.colsTools-drag',
                    connectWith: '.components',
                    cancel: 'input,select'
                }
            ]
        };
        $scope.sortableTableConf = {
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
                    handle: '.rows-tools-drag',
                    connectWith: ''
                },
                {
                    dom: '.table .tr',
                    items: '.th',
                    handle: '.cols-tools-drag',
                    connectWith: ''
                }
               // {dom: '.sortable-row', items: '.panel', handle: '.panel-heading', connectWith: '.sortable-row'}
            ]
        };
        $scope.tablesConf = {
            model: 'edit'
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
            console.log($scope.tablesDataSource, JSON.stringify($scope.tablesDataSource));
        };
        $scope.destroyList[$scope.destroyList.length - 1] = $scope.$on('Tables:createSearchs', function (event, data) {
            if (!!data) {
                return $scope.tablesDataSource.searchsPanel.push(data);
            }
        });
        $scope.destroyList[$scope.destroyList.length - 1] = $scope.$on('Tables:createTables', function (event, data) {
            if (!!data) {
                return $scope.tablesDataSource.tablesPanel.push(data);
            }
        });
        $scope.tablesDataSource = {};
        $scope.tablesDataSource.tablesName = '新建数据报表';
        $scope.tablesDataSource.searchsPanel = [];
        $scope.tablesDataSource.tablesPanel = [];
        $scope.previewData = {};
        $scope.sourceData = {};

        fetchService.get({
            url: api.getTablesConfig,
            type: 'get',
            data: {}
        }).then(function (ret) {
            ret = !!ret.length ? ret[0].data : ret.data;
            if (ret.status - 0 === 0 || ret.errno - 0 === 0) {
                angular.forEach(ret.data.searchsPanel, function (v) {
                    if (v.dataOrigin === 'static' && v.source.length) {
                        if (!$scope.previewData[v.key]) {
                            $scope.previewData[v.key] = {};
                        }
                        $scope.previewData[v.key].source = v.source;
                    }
                    if (v.dataOrigin === 'remote' && v.api !== '') {
                        $scope.$root.$broadcast('Props:getRemoteApi', v);
                    }
                });
                angular.forEach(ret.data.tablesPanel, function (v) {
                    if (v.api !== '') {
                        $scope.$root.$broadcast('Props:getRemoteApi', v);
                    }
                });
                $scope.tablesDataSource.tablesName = ret.data.tablesName;
                $scope.tablesDataSource.searchsPanel = ret.data.searchsPanel;
                $scope.tablesDataSource.tablesPanel = ret.data.tablesPanel;
            }
        });
        $scope.$on('$destroy', function () {
            //destroyList[destroyList.length - 1]
            angular.forEach($scope.destroyList, function (/** Function */unwatch) {
                (typeof unwatch === 'function') && unwatch();
            });
        });
    });

