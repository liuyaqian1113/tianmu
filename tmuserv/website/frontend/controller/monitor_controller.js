/**
 * @file monitor_controller the file
 */
'use strict';
angular.module(window.ProjectName).controller('monitor_controller',
    function ($rootScope, $scope, $state, $log, $stateParams, $timeout, $interval, CONFIG, fetchService) {
        var api = CONFIG.api[$state.current.name];
        $scope.monitor = {};
        $scope.canvasConf = {
            canvas: 'monitor-scene',
            mode: 'edit', //normal, edit
            bg: '' // CONFIG.webRoot + 'modules/common/monitor/img/bg.jpg',
        };
        $scope.monitor.renderToMonitor = function (data) {
            return $timeout(function () {
                $scope.$parent.$broadcast('Monitor:echarts', data);
            }, 100);
        };
        $scope.eChartOptions = {
            bar: {
                option: {
                    title: {
                        text: '动态数据',
                        subtext: '纯属虚构'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['最新成交价', '预购队列']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: { readOnly: false },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    dataZoom: {
                        show: false,
                        start: 0,
                        end: 100
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: true,
                        data: (function () {
                            var now = new Date();
                            var res = [];
                            var len = 10;
                            while (len--) {
                                res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                                now = new Date(now - 2000);
                            }
                            return res;
                        })()
                    }, {
                        type: 'category',
                        boundaryGap: true,
                        data: (function () {
                            var res = [];
                            var len = 10;
                            while (len--) {
                                res.push(len + 1);
                            }
                            return res;
                        })()
                    }],
                    yAxis: [{
                        type: 'value',
                        scale: true,
                        name: '价格',
                        max: 30,
                        min: 0,
                        boundaryGap: [0.2, 0.2]
                    }, {
                        type: 'value',
                        scale: true,
                        name: '预购量',
                        max: 1200,
                        min: 0,
                        boundaryGap: [0.2, 0.2]
                    }],
                    series: [{
                        name: '预购队列',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: (function () {
                            var res = [];
                            var len = 10;
                            while (len--) {
                                res.push(Math.round(Math.random() * 1000));
                            }
                            return res;
                        })()
                    }, {
                        name: '最新成交价',
                        type: 'line',
                        data: (function () {
                            var res = [];
                            var len = 0;
                            while (len < 10) {
                                res.push((Math.random() * 10 + 5).toFixed(1) - 0);
                                len++;
                            }
                            return res;
                        })()
                    }]
                }
            },
            line: {
                option: {
                    title: {
                        text: '未来一周气温变化(5秒后自动轮询)',
                        subtext: '纯属虚构'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['最高气温', '最低气温']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    }],
                    yAxis: [{
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} °C'
                        }
                    }],
                    series: [{
                        name: '最高气温',
                        type: 'line',
                        data: [11, 11, 15, 13, 12, 13, 10],
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    }, {
                        name: '最低气温',
                        type: 'line',
                        data: [1, -2, 2, 5, 3, 2, 0],
                        markPoint: {
                            data: [
                                { name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    }]
                }
            }
        };
        $scope.monitor.addNode = function () {
            // _this._createNode(v.x, v.y, v.text, ($ctrl.Image[v.level] || v.Image), v.textPosition, v.level, v.larm);
            return $scope.$parent.$broadcast('Monitor:addNode');
        };
        $scope.monitor.addEcharts = function (type) {
            return $scope.$parent.$broadcast('Monitor:createEcharts', type);
        };
        $scope.monitor.save = function () {
            return $scope.$parent.$broadcast('Monitor:save');
        };
        /*

                this.screenSize = {
                    'small': [1366, 768],
                    'normal': [1920, 1080],
                    'large':[]
                };

        */
        $scope.monitor.normalStage = function () {
            return $scope.$parent.$broadcast('Monitor:setStage', 0);
        };
        $scope.monitor.largeStage = function () {
            return $scope.$parent.$broadcast('Monitor:setStage', 1);
        };


        // $scope.$parent.$broadcast('canvas:setBg');
    });
