/**
 * Created by liekkas.zeng on 2015/1/7.
 */
angular.module(window.ProjectName)
    .directive('ngSortable', function ($timeout, CONFIG) {
        return {
            scope: true,
            restrict: 'A',
            link: function (scope, element, attrs) {
                var destroyList = [];
                $timeout(function () {
                    var oDom = $(element);
                    if (!oDom.prop('tagName')) {
                        return;
                    }
                    var config = scope.$eval(attrs.ngSortable);
                    var setSortable = function () {
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
                                (v.element && v.element.length) && bindSorable(v);
                            });
                        }
                    };

                    function bindSorable(opts) {
                        opts.element.sortable({
                            cursor: 'move',
                            connectWith: opts.connectWith || '',
                            dropOnEmpty: true,
                            handle: opts.handle || '',
                            cancel: opts.cancel || '',
                            helper: 'clone',
                        //    forceHelperSize: true,
                            items: opts.items || "> li",
                            tolerance: "pointer",
                            zIndex: 9999,
                            update: updateMenusData
                        });
                       // .disableSelection();
                    }
                    var updateMenusData = function (e, ui) {
                        var dom = $(e.target || e.srcElement);
                        var container = $(this);
                        var item = container.sortable('option').items;
                        var newOrder = [];
                        $.each(container.find(item), function (i, v) {
                            var key = $(this).attr('data-id');
                            newOrder.push(key);
                        });
                        scope.$emit('Tables:setOrder', {order: newOrder, type: dom.attr('data-type')});
                    };
                    var refreshSortable = function () {
                        return setSortable();
                    };
                    setSortable();
                    destroyList[destroyList.length - 1] = scope.$on('Sortable:updateEvent', function (event, data) {
                        if (!!data) {
                            refreshSortable();
                        }
                    });
                    scope.$on('$destroy', function () {
                        //destroyList[destroyList.length - 1]
                        angular.forEach(destroyList, function (/** Function */unwatch) {
                            (typeof unwatch === 'function') && unwatch();
                        });
                    });
                   /* element.on('$destroy', function () {
                      scope.$destroy();
                    });*/
                });
            }
        }
    });

