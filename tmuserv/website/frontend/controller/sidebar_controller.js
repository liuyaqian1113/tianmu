/**
 * @file sidebar_controller the file
 */
"use strict"
angular.module(window.ProjectName)
    .controller('sidebar_controller', function ($rootScope, $scope, $state, CONFIG) {
        var api = CONFIG.api[$state.current.name];
        $scope.items = [
            {
                type: 'header',
                name: 'MAIN'
            }, {
                type: 'menu',
                name: '首页',
                icons: 'glyphicon glyphicon-home',
                url: '#/index',
                active: true
            }, {
                type: 'header',
                name: '可视化配置'
            }, {
                type: 'menu',
                name: '表格配置',
                icons: 'glyphicon glyphicon-align-justify',
                url: '#/tables',
                active: false
            }, {
                type: 'menus',
                name: '大屏配置',
                icons: 'glyphicon glyphicon-plus',
                url: 'javascript:;',
                active: false,
                subs: [
                    {
                        name: '主题配置',
                        url: '#/theme',
                        active: false
                }]
            }
        ];
        $scope.showStates = function (item) {
            item.active = !item.active;
        };
        $scope.getMenuClass = function (item) {
            if (!item) {
                return;
            }
            var style = '';
            switch (item.type) {
                case 'header':
                    style = 'nav-header';
                    break;
                case 'menu':
                    if (!!item.active) {
                        style = 'active';
                    }
                    break;
                case 'menus':
                    style = 'accordion';
                    if (!!item.active) {
                        style += ' active';
                    }
                    break;
            }
            return style;
        };
        $scope.setActive = function (item) {
            if (typeof item === 'object') {
                item = item.url;
            }
            angular.forEach($scope.items, function (o, i) {
                o.url && (o.active = (item.replace(/#|\//g, '') === o.url.replace(/#|\//g, '')));
                angular.forEach(o.subs, function (v, k) {
                    var flag = (item.replace(/#|\//g, '') === v.url.replace(/#|\//g, ''));
                    v.active = flag;
                    if (!!flag) {
                        o.url && (o.active = flag);
                    }
                });
            });
        };
        $scope.setActive($state.current.url);
    });

