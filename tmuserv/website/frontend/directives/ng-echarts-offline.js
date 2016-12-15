/**
 * Created by liekkas.zeng on 2015/1/7.
 */
angular.module(window.ProjectName).directive('echarts', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                var runOnce = false;
                var attrs  = scope.CONFIG.attrs;
                var config = scope.CONFIG.config;
                var option = scope.CONFIG.option;
                var vCanvas = document.createElement('canvas');
                var w = attrs.size.width / attrs.pixelRatio;
                var h = attrs.size.height / attrs.pixelRatio;
                vCanvas.width = attrs.size.width;
                vCanvas.height = attrs.size.height;
                vCanvas.style.width = w + 'px';
                vCanvas.style.height = h + 'px';
             // {width: w, height: h}
                if (attrs.pixelRatio) {
                    attrs.size.width = attrs.size.width / attrs.pixelRatio;
                    attrs.size.height = attrs.size.height / attrs.pixelRatio;
                }
                console.log(attrs, vCanvas);
                var refreshChart = function (val) {
                    if (!!runOnce) {
                        return;
                    }
                    runOnce = true;
                    var theme = (config && config.theme) ? config.theme : 'default';
                    var chart = echarts.init(vCanvas, theme, (attrs.size || {}));
                    (config && !config.dataLoaded) && chart.showLoading();
                    if (config && !!config.dataLoaded) {
                        chart.setOption(option);
                        if (!!attrs.size) {
                          //  chart.resize(attrs.size);
                        } else {
                          //  chart.resize();
                        }
                        chart.hideLoading();
                        !!scope.CONFIG.command && $timeout(function () {
                            runOnce = false;
                            return scope.CONFIG.command(chart);
                        });
                    }
                    if (config && config.event) {
                        if (angular.isArray(config.event)) {
                            angular.forEach(config.event, function (value, key) {
                                for (var e in value) {
                                    chart.on(e, value[e]);
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
                scope.$watch('CONFIG.attrs.size', refreshChart, true);
                scope.$watch('CONFIG.config', refreshChart, true);
               // scope.$on('Monitor:renewEcharts', refreshChart);
            },
            scope: {
                CONFIG: '=ecConfig'
            },
            restrict: 'EA'
        }
    });

