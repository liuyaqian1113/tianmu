/**
 * Created by liekkas.zeng on 2015/1/7.
 */
angular.module(window.ProjectName)
    .directive('ngSortable', function ($timeout, CONFIG) {
        return {
            scope: true,
            require: '?^ngTables',
            restrict: 'A',
            link: function (scope, element, attrs) {
                var oDom = $(element);
                var config = scope.$eval(attrs.ngSortable);
                console.log(oDom, config);
                $timeout(function () {
                    var sConf = [];
                    var setSortable = function  () {
                        if (config && angular.isArray(config.config)) {
                            angular.forEach(config.config, function (v) {
                                switch (v.dom) {
                                    case 'this':
                                        v.element = oDom;
                                        break;
                                    default:
                                        v.element = oDom.find(v.dom);
                                        break;
                                }
                                if (v.element && v.element.length) {
                                    sConf.push(v);
                                    bindSorable(v);
                                }
                                console.log(config.config, sConf, v);
                            });
                        }
                    };
                    function bindSorable (opts) {
                        opts.element.sortable({
                            cursor: 'move',
                            connectWith: opts.connectWith || '',
                            dropOnEmpty: true,
                            handle: opts.handle || '',
                            cancel: opts.cancel || '',
                         //   helper: 'clone',
                            items: opts.items || "> li",
                            tolerance: "pointer",
                            zIndex: 9999,
                            update: updateMenusData
                        }).disableSelection();
                    }
                    var updateMenusData = function (e, ui) {
                        console.log(e, ui);
                    };
                    var refreshSortable = function () {
                        angular.forEach(sConf, function (v) {
                            v.element.sortable('destroy');
                        });
                        sConf = [];
                        setSortable();
                    };
                    setSortable();
                   // CONFIG.setData('sidebar', 'aaa');
                   // CONFIG.getData('sidebar').then(function (data) {
                   //     console.log(data ,'========');
                   // });
                    scope.$on('Sortable:updateEvent', function (event, data) {
                        if (!!data) {
                            console.log(data);
                            refreshSortable();
                        }
                    });
                }, 500);
            }
        }
    });

