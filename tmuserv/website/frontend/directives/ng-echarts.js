/**
 * Created by liekkas.zeng on 2015/1/7.
 */
angular.module(window.ProjectName)
    .directive('echarts', function ($timeout, CONFIG) {
        return {
            link: function (scope, element, attrs) {
                var runOnce = false;
                var config = scope.CONFIG.config || {
                    type: 'skyfall',
                    size: {
                        width: 500,
                        height: 200
                    }
                };
                var option = scope.CONFIG.option || scope.CONFIG.options || {};
                if (config.pixelRatio) {
                    config.size.width = config.size.width / CONFIG.pixelRatio;
                    config.size.height = config.size.height / CONFIG.pixelRatio;
                }
                var theme = (config && config.theme) ? config.theme : 'default';
                var oCanvas = document.createElement('canvas');
                var ctx = oCanvas.getContext('2d');
                /*var devicePixelRatio = window.devicePixelRatio || CONFIG.pixelRatio;
                var backingStorePixelRatio = ctx.dpr || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 2;
                var ratio = devicePixelRatio / backingStorePixelRatio;
                */
                var chart = echarts.init(element.parent()[0] || oCanvas, theme, {
                    width: config.size.width,
                    height: config.size.height,
                    devicePixelRatio: CONFIG.pixelRatio
                });
                var _resize = chart.resize;
                var refreshChart = function (val) {
                    var w = config.size.width;
                    var h = config.size.height;
                    (config && !config.dataLoaded) && chart.showLoading();
                    if (config && !!config.dataLoaded) {
                        chart.setOption(option);
                        if (!runOnce) {
                            chart.resize(config.size);
                            // 设置虚拟canvas属性
                            ctx.dpr = CONFIG.pixelRatio;
                            oCanvas.innerHTML = '';
                            oCanvas.removeAttribute('style');
                            scope.CONFIG.sourceCanvas = oCanvas;
                            oCanvas.width = w * CONFIG.pixelRatio;
                            oCanvas.height = h * CONFIG.pixelRatio;
                            oCanvas.style.width = w + 'px';
                            oCanvas.style.height = h + 'px';
                            scope.CONFIG.echarts = chart;
                        }
                        /*if (!!val.size) {
                            chartresize(attrs.size);
                        } else {
                          //  chartresize();
                        }*/
                        console.log(config, option);
                        chart.hideLoading();
                        scope.$emit('Monitor:rtEcharts', scope.CONFIG);
                        $timeout(function () {
                            //  chart.clear();
                        });
                        runOnce = true;
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
                scope.$watch('CONFIG.option', refreshChart, true);
                // scope.$on('Monitor:renewEcharts', refreshChart);
            },
            scope: {
                CONFIG: '=ecConfig'
            },
            replace: true,
            restrict: 'EA'
        }
    });

