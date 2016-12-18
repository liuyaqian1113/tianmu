/**
 * Created by liekkas.zeng on 2015/1/7.
 */
angular.module(window.ProjectName)
    .directive('ngSortable', function ($timeout, CONFIG) {
        return {
            scope: true,
          //  require: '^sidebar',
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                var oDom = $(element);
                oDom.unbind().click('a', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                $timeout(function () {
                    var oMenu = oDom.find('.root-menu');
                    var oSub = oDom.find('.sub-menu');
                    var setSortable = function  () {
                        oDom.sortable({
                            appendTo: 'parent',
                            cursor: 'move',
                            handle: ".sort-handle",
                            helper: 'clone',
                            items: "> li",
                            tolerance: "pointer",
                            zIndex: 9999,
                            update: updateMenusData
                        }).disableSelection();
                        oMenu.sortable({
                            appendTo: 'parent',
                            connectWith: '.root-menu',
                            dropOnEmpty: true,
                            cursor: 'move',
                            helper: 'clone',
                            items: "> li",
                            tolerance: "pointer",
                            zIndex: 9999,
                            update: updateMenusData
                        }).disableSelection();
                        oSub.sortable({
                            appendTo: 'parent',
                            connectWith: '.sub-menu',
                            dropOnEmpty: true,
                            cursor: 'move',
                            helper: 'clone',
                            items: "> li",
                            tolerance: "pointer",
                            zIndex: 9999,
                            update: updateMenusData
                        }).disableSelection();
                    };
                    var updateMenusData = function (e, ui) {
                        console.log(e, ui);
                    };
                    var refreshSortable = function () {
                        oDom.sortable('destroy');
                        oMenu.sortable('destroy');
                        oSub.sortable('destroy');
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
                          //  refreshSortable();
                        }
                    });
                }, 500);
            }
        }
    });

