/**
 * Created by panjian01 on 2016/12/21.
 */
angular.module(window.ProjectName)
    .directive('ngTables', function ($timeout, $modal, CONFIG) {
        return {
            scope: true,
            restrict: 'A',
            templateUrl: 'tmpl/tables.html',
            controller: function ($scope) {
            },
            controllerAs: 'tableManager',
            link: function (scope, element, attrs) {
                var tableConf = scope.$eval(attrs.ngTables);
                scope.tablesModel = tableConf.model;
                var pScope = scope.$parent;
                var pageContainer = $('#page-container');
                scope.sourceData = {};
                var dataFactory = {
                    id: '',
                    key: 0,
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
                scope.tablesEdit = function (oTab) {
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
                
            }
        }
    });

