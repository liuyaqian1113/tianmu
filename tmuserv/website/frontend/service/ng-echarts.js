/**
 * Created by liekkas.zeng on 2015/1/7.
 */
angular.module('ng-echarts', [])
    .directive('echarts', function ($timeout, CONFIG) {
        return {
            link: function (scope, element, attrs, ctrl) {
                var options = scope.option;
                var echartsCache = null;
                function refreshChart() {
                    var theme = (scope.config && scope.config.theme) ? scope.config.theme : 'default';
                    var chart = echarts.init(element[0], theme, scope.config.size);
                    if (scope.config && scope.config.dataLoaded === false) {
                        chart.showLoading();
                    }
                    if (scope.config && scope.config.dataLoaded) {
                        chart.setOption(options.options || options);
                        chart.resize();
                        chart.hideLoading();
                    }
                    if (scope.config && scope.config.event) {
                        if (angular.isArray(scope.config.event)) {
                            angular.forEach(scope.config.event, function (value, key) {
                                for (var e in value) {
                                    chart.on(e, value[e]);
                                }
                            });
                        }
                    }
                };
                //自定义参数 - config
                // event 定义事件
                // theme 主题名称
                // dataLoaded 数据是否加载
                scope.$watch(function () {
                    return scope.config;
                }, function (value, old) {
                    if (value && !!old) {
                        refreshChart();
                    }
                }, true);
                $timeout(function () {
                    //图表原生option
                    scope.$watch(function () {
                        return options.options;
                    }, function (value, old) {
                        if (value && !!old) {
                            refreshChart();
                        }
                    }, true);
                    scope.$watch(function () {
                        return options.cols;
                    }, function (value, old) {
                        if (value && !!old) {
                            $timeout.cancel(echartsCache);
                            echartsCache = $timeout(refreshChart);
                        }
                    });
                    scope.config.dataLoaded = true;
                }, 500);
            },
            scope: {
                option: '=ecOption',
                config: '=ecConfig'
            },
            replace: true,
            restrict: 'EA'
        }
    });

