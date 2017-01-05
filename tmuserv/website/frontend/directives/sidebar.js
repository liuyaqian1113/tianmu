/**
 * Created by panjian01 on 2016/12/16.
 */
angular.module(window.ProjectName)
    .directive('sidebar', function ($timeout, CONFIG, $templateCache, fetchService) {
        return {
            scope: true,
            restrict: 'A',
            template: '\
                <li ng-repeat="item in $root.menuItems" ng-class="item.type" ng-if="item.permission <= bar.userInfo.level">\
                    <a ng-href="{{item.href}}" ng-if="item.permission <= bar.userInfo.level" data-id="{{item.id}}" class="sort-handle nav-header source">{{item.name}}</a>\
                    <ul ng-if="(item.subs && item.subs.length > 0) && item.permission <= bar.userInfo.level" class="root-menu">\
                        <li ng-repeat="tm in item.subs" ng-class="{\'has-sub active\': (tm.subs && tm.subs.length > 0) && tm.active, \'has-sub\': (tm.subs && tm.subs.length > 0) && tm.active != true, \'active\': tm.active}" ng-if="tm.permission <= bar.userInfo.level" class="sort-handle">\
                            <a ng-if="(!tm.subs || (!!tm.subs && !tm.subs.length)) && tm.permission <= bar.userInfo.level" ng-href="{{tm.url}}" data-id="{{tm.id}}" class="source">\
                                <i class="{{tm.icons}}"></i>\
                                <span ng-bind="tm.name"></span>\
                            </a>\
                            <a ng-if="(tm.subs && tm.subs.length > 0) && tm.permission <= bar.userInfo.level" href="javascript:;" data-id="{{tm.id}}" class="source">\
                                <b class="caret pull-right"></b>\
                                <i class="{{tm.icons}}"></i>\
                                <span>{{tm.name}}</span>\
                            </a>\
                            <ul ng-if="(tm.subs && tm.subs.length > 0) && tm.permission <= bar.userInfo.level" class="sub-menu" ng-style="{\'display\': status == \'sortable\' ? \'block\': \'none\'}" ng-include="\'sidebarTree\'">\
                            </ul>\
                        </li>\
                    </ul>\
                </li>\
            ',
            controller: function ($scope) {
                this.userInfo = {
                    level: CONFIG.USERINFOS.level,
                    bussiness: CONFIG.USERINFOS.bussiness
                };
                $templateCache.put('sidebarTree', '\
                    <li ng-repeat="sub in tm.subs" ng-class="{\'has-sub active\': (sub.subs && sub.subs.length > 0) && sub.active, \'has-sub\': (sub.subs && sub.subs.length > 0) && sub.active != true, \'active\': (!sub.subs || (sub.subs && sub.subs.length == 0)) && sub.active, \'expand\': status == \'sortable\'}" ng-if="sub.permission <= bar.userInfo.level" class="sort-handle ">\
                        <a ng-if="(!sub.subs || (sub.subs && sub.subs.length == 0)) && sub.permission <= bar.userInfo.level" data-id="{{sub.id}}" href="{{sub.url}}" class="source">{{sub.name}}</a>\
                        <a ng-if="(sub.subs && sub.subs.length > 0) && sub.permission <= bar.userInfo.level" href="javascript:;" data-id="{{sub.id}}" class="source">\
                            <span>{{sub.name}}</span>\
                        </a>\
                        <ul ng-if="(sub.subs && sub.subs.length > 0)" class="sub-menu" ng-if="sub.permission <= bar.userInfo.level" ng-style="{\'display\': status == \'sortable\' ? \'block\': \'none\'}" ng-include="\'sidebarTree\'"  ng-init="tm=sub"></ul>\
                    </li>\
                ');
                /*$scope.$root.menuItems = [
                    {type: 'nav-group', id: 1, pid: 1, name: '配置管理', url: 'javascript:;', editable: 2, permission: true, hasSub: true, subs: [
                            {type: 'has-sub', id: 4, pid: 1, name: '业务管理', icons: 'fa fa-star', url: 'javascript:;', hasSub: true, active: false, permission: true, subs: [
                                {type: 'last-sub', id: 5, pid: 4, name: '我的业务线', url: '#/business', active: false, hasSub: false, permission: true},
                                {type: 'last-sub', id: 6, pid: 4, name: '我的产品', url: '#/product', active: false, hasSub: false, permission: true}
                                ]
                            },
                            {type: 'has-sub', id: 21, pid: 1, name: '用户权限管理', icons: 'fa fa-key', url: 'javascript:;', hasSub: true, active: false, permission: true, subs: [
                                {type: 'last-sub', id: 7, pid: 21, name: '用户管理', url: '#/power/user', active: false, hasSub: false, permission: true},
                                {type: 'last-sub', id: 8, pid: 21, name: '用户组配置', url: '#/power/group', active: false, hasSub: false, permission: true},
                                {type: 'last-sub', id: 9, pid: 21, name: '权限配置', url: '#/power/author', active: false, hasSub: false, permission: true}
                                ]
                            }
                        ]
                    },
                    {type: 'nav-group', id: 2, pid: 2, name: '数据监控', url: 'javascript:;', editable: 2, permission: true, hasSub: true, subs: [
                            {type: 'has-sub', id: 10, pid: 2, name: '监控管理', icons: 'fa fa-th', url: 'javascript:;', hasSub: true, active: false, permission: true, subs: [
                                {type: 'last-sub', id: 11, pid: 10, name: '我的报表', url: '#/report/list', active: true, hasSub: false, permission: true},
                                {type: 'last-sub', id: 12, pid: 10, name: '聚合监控', url: '#/report/dashboard', active: false, hasSub: false, permission: true},
                                {type: 'last-sub', id: 13, pid: 10, name: '大屏监控', url: '#/report/theme', active: false, hasSub: false, permission: true}
                            ]}
                        ]
                    },
                    {type: 'nav-group', id: 3, pid: 3, name: '平台管理', url: 'javascript:;', editable: 1, permission: true, hasSub: true, subs: [
                            {type: 'has-sub', id: 14, pid: 3, name: '组件管理', icons: 'fa fa-cogs', url: 'javascript:;', hasSub: true, active: false, permission: true, subs: [
                                {type: 'last-sub', id: 15, pid: 14, name: '查询组件', url: '#/manager/modules/search', active: false, hasSub: false, permission: true},
                                {type: 'last-sub', id: 16, pid: 14, name: '图表组件', url: '#/manager/modules/echarts', active: false, hasSub: false, permission: true},
                                {type: 'last-sub', id: 17, pid: 14, name: '大屏组件', url: '#/manager/modules/canvas', active: false, hasSub: false, permission: true}
                            ]},
                            {type: 'last-sub', id: 18, pid: 3, name: '菜单管理', icons: 'fa fa-align-justify', url: '#/manager/menu', hasSub: false, active: false, permission: true},
                            {type: 'last-sub', id: 19, pid: 3, name: '通知管理', icons: 'fa fa-comment', url: '#/manager/notify', hasSub: false, active: false, permission: true},
                            {type: 'last-sub', id: 20, pid: 3, name: '超级管理员设置', icons: 'fa fa-user', url: '#/manager/admin', hasSub: false, active: false, permission: true}
                        ]
                    }
                ]
                */
            },
            controllerAs: 'bar',
            link: function (scope, element, attrs) {
                // $scope.setActive($state.current.url);
                scope.status = attrs.sidebar;
                scope.userInfo = {
                    level: CONFIG.USERINFOS.level,
                    bussiness: CONFIG.USERINFOS.bussiness
                };
                if (scope.status !== 'sortable') {
                    element = $(element);
                    element.on('click', function (evt) {
                        var _this = $(evt.srcElement || evt.target).closest('a');
                        switch (true) {
                            case _this.is($(".root-menu > .has-sub > a", this)):
                                var e = _this.next(".sub-menu"),
                                    a = ".sidebar .nav .root-menu li.has-sub > .sub-menu";
                                !$(".page-sidebar-minified").length && ($(a).not(e).slideUp(250, function () {
                                    $(this).closest("li").removeClass("expand")
                                }), 
                                e.slideToggle(250, function () {
                                    var e = $(this).closest("li");
                                    e.hasClass("expand") ? e
                                        .removeClass("expand") : e
                                        .addClass("expand")
                                }));
                                break;
                            case _this.is($(".root-menu .has-sub .sub-menu li.has-sub > a", this)):
                                if (!$(".page-sidebar-minified").length) {
                                    var e = _this.next(".sub-menu");
                                    e.slideToggle(250, function () {
                                        var e = $(this).closest("li");
                                        e.hasClass("expand") ? e
                                            .removeClass("expand") : e
                                            .addClass("expand")
                                    });
                                }
                                break;
                            case _this.is($(".root-menu .has-sub .sub-menu li:not(.has-sub) a", this)):
                                _this.parents('li:not(.active)').addClass('active').siblings('.active')
                                .removeClass('active').find('.active').removeClass('active');
                                break;
                            case _this.is($(".root-menu :not(.has-sub) > a", this)):
                                var oMenu = _this.parent('li:not(.has-sub)');
                                var oSib = oMenu.siblings('.has-sub.expand');
                                oMenu.addClass('active').siblings('.active')
                                .removeClass('active').find('.active').removeClass('active');
                                oSib.find('.sub-menu').slideUp(250, function () {
                                    $(this).closest("li").removeClass("expand")
                                });
                                break;
                        }

                    });
                    var e = !1;
                    element.on("click touchstart", function (a) {
                        0 !== $(a.target).closest(".sidebar").length ? e = !0 : (e = !1, a.stopPropagation())
                    }),
                    $(document).on("click touchstart", function (a) {
                        0 === $(a.target).closest(".sidebar")
                            .length && (e = !1), a.isPropagationStopped() || e === !0 || ($("#page-container")
                                .hasClass("page-sidebar-toggled") && (e = !0, $("#page-container")
                                    .removeClass("page-sidebar-toggled")), $("#page-container")
                                .hasClass("page-right-sidebar-toggled") && (e = !0, $("#page-container")
                                    .removeClass("page-right-sidebar-toggled")))
                    }), 
                    $("[data-click=right-sidebar-toggled]").click(function (a) {
                        a.stopPropagation();
                        var t = "#page-container",
                            i = "page-right-sidebar-collapsed";
                        i = $(window)
                            .width() < 979 ? "page-right-sidebar-toggled" : i, $(t)
                            .hasClass(i) ? $(t)
                            .removeClass(i) : e !== !0 ? $(t)
                            .addClass(i) : e = !1, $(window)
                            .width() < 480 && $("#page-container")
                            .removeClass("page-sidebar-toggled")
                    }),
                    $("[data-click=sidebar-toggled]").click(function (a) {
                        a.stopPropagation();
                        var t = "page-sidebar-toggled",
                            i = "#page-container";
                        $(i).hasClass(t) ? $(i)
                            .removeClass(t) : e !== !0 ? $(i)
                            .addClass(t) : e = !1, $(window)
                            .width() < 480 && $("#page-container")
                            .removeClass("page-right-sidebar-toggled")
                    });
                    scope.$root.$on('Sidebar:updateMenu', function (event, data) {
                        if (!!data) {
                            console.log('Sidebar:updateMenu');
                            $timeout(function () {
                                scope.$root.menuItems = data;
                            });
                        }
                    });
                   /* CONFIG.bindData('sidebar', scope.$root.menuItems, function (data) {
                        console.log(data, '-----------');
                        if (data) {
                            scope.$root.menuItems = data;
                        }
                    });*/
                }
            }
        }
    });

