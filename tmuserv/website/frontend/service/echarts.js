angular.module(window.ProjectName)
    .factory('tmuEcharts', function ($http, $q, $rootScope, CONFIG) {
        var eChartCache = {};
        return {
            create: function (node, opts) {
                var theme = (node.config && node.config.theme) ? node.config.theme : 'default';
                var canvas = node.canvas;
                eChartCache[node.id] = echarts.init(canvas, theme, {
                    width: node.config.size.width,
                    height: node.config.size.height,
                    devicePixelRatio: CONFIG.pixelRatio || 2
                });
                eChartCache[node.id].setOption(node.option);
                node.echarts = eChartCache[node.id];
                return node;
            },
            update: function (params) {

            }
        };
    });

