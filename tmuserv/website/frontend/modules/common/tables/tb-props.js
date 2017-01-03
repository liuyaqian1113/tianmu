/**
 * Created by panjian01 on 2016/12/21.
 */
angular.module(window.ProjectName)
    .directive('sfProps', function ($timeout, CONFIG, fetchService) {
        return {
           // scope: true,
            restrict: 'AE',
            replace: true,
            template: '<div id="tables-table-props" class="tables-props" ng-include="templateUrl"></div>',
            link: function (scope, element, attrs) {
                var pageContainer = $('#page-container');
                scope.templateUrl = '';
                scope.ok = function () {
                    if (scope.propsType === 'table' && !scope.propsData.tables.headers.length) {
                        return scope.$root.poplayer = {
                            type: 'error',
                            content: '请先添加表头'
                        };
                    }
                    scope.propsData.api = 'http://cq02-mco-sumeru475.cq02.baidu.com:8083/aunceladmin/singlestattable';
                    var api = $.trim(scope.propsData.api);
                    if (api !== '' && !!/^http(s)?:\/\//i.test(api)) {
                        fetchService.remote({
                                url: api,
                                type: 'get',
                                data: {
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
                                    var data = ret.data;
                                    data.shift();
                                    scope.$root.$broadcast('Tables:' + scope.propsType + 'Preview', {
                                        type: scope.propsType,
                                        data: data,
                                        source: scope.propsData
                                    });
                                }
                            });
                    }
                };
                scope.cancel = function () {
                    pageContainer.removeClass('showprops');
                };
                scope.$on('Props:setTemplate', function (event, data) {
                    if (!!data) {
                        if (data.data) {
                            scope.propsData = data.data;
                        }
                        scope.propsType = data.type;
                        if (scope.templateUrl !== data.url) {
                            scope.templateUrl = data.url;
                        }
                    }
                });
            }
        }
    });

