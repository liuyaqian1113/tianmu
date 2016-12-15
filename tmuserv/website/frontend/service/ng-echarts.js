/**
 * Created by liekkas.zeng on 2015/1/7.
 */
angular.module(window.ProjectName)
    .directive('echarts', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                //var runOnce = false;
                var config = scope.CONFIG.config;
                var option = scope.CONFIG.option;
                var theme = (config && config.theme) ? config.theme : 'default';
                if (config.pixelRatio) {
                    config.size.width = config.size.width / 2;
                    config.size.height = config.size.height / 2;
                }
                var oCanvas = document.createElement('canvas');
                var chart = {};
                chart[scope.CONFIG.id] = echarts.init(element[0], theme, {
                    width: config.size.width,
                    height: config.size.height,
                    devicePixelRatio: 2
                });
                var refreshChart = function (val) {
                    if (!val) {
                        return;
                    }
                    (config && !config.dataLoaded) && chart[scope.CONFIG.id].showLoading();
                    if (config && !!config.dataLoaded) {
                        chart[scope.CONFIG.id].setOption(option);
                        /*if (!!val.size) {
                            chart.resize(attrs.size);
                        } else {
                          //  chart.resize();
                        }*/
                        chart[scope.CONFIG.id].hideLoading();
                        scope.CONFIG.echarts = chart[scope.CONFIG.id];
                        scope.$emit('Monitor:rtEcharts', scope.CONFIG);
                        $timeout(function () {
                           //  chart[scope.CONFIG.id].clear();
                        });
                    }
                    if (config && config.event) {
                        if (angular.isArray(config.event)) {
                            angular.forEach(config.event, function (value, key) {
                                for (var e in value) {
                                    chart[scope.CONFIG.id].on(e, value[e]);
                                }
                            });
                        }
                    }
                    return this;
                };
                //自定义参数 - config
                // event 定义事件
                // theme 主题名称
                // dataLoaded 数据是否加载
                scope.$watch('CONFIG.option', refreshChart, true);
                // scope.$on('Monitor:renewEcharts', refreshChart);
            },
            scope: {
                CONFIG: '=ecConfig'
            },
            restrict: 'EA'
        }
    });

