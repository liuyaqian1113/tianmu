/**
 * Created by panjian01 on 2016/12/16.
 */
angular.module(window.ProjectName)
    .controller('MenuModalInstanceCtrl', function ($scope, $modalInstance, opts) { //依赖于modalInstance
        $scope.items = opts.items;
        $scope.selected = {
            item: $scope.items[0]
        };
        var data = angular.copy(opts.data);
        var type = opts.type;
        var level = data.type;
        data.editable = '';
        if (type === 'child') { // 创建子菜单
            data.subs = [];
            level = 'last-sub';
            delete data.editable;
            data.id = '';
            data.url = '';
            data.pid = opts.data.id || 0;
            data.name = '子菜单';
            data.type = level;
            data.icons = '';
        } else if (type === 'siblings') { // 创建同级菜单
            if (data.type === 'nav-group') {
                data.editable = 2;
            } else if (data.type === 'has-sub') {
                level = 'last-sub';
            } else if (data.type === 'last-sub') {}
            data.subs = [];
            data.id = '';
            data.pid = opts.data.pid || 0;
            data.name = '同级菜单';
            data.type = level;
            data.url = '';
            data.icons = '';
        } else if (type === 'edit') { //编辑菜单
            console.log(data);
        }
        data.action = type;
        $scope.menus = data;
        $scope.modalTitle = opts.title;
        $scope.ok = function () {
            $modalInstance.close($scope.menus); //关闭并返回当前选项
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel'); // 退出
        }
    })
    .directive('editMenuTools', function ($rootScope, fetchService, $timeout, $modal, CONFIG) {
        return {
            scope: true,
            restrict: 'A',
            template: '\
                <a ng-repeat="tool in tools.toolsList" href="{{tool.url}}" data-id="{{tool.name}}" class="{{tool.name}}" title="{{tool.title}}">\
                    <i class="{{tool.icon}}"></i>\
                </a>\
            ',
            controller: function ($scope) {
                this.toolsList = [
                    {
                        name: 'siblings',
                        title: '创建同级菜单',
                        url: '',
                        icon: 'icon-arrow-left'
                    },
                    {
                        name: 'child',
                        title: '创建子菜单',
                        url: '',
                        icon: 'icon-arrow-down'
                    },
                    {
                        name: 'edit',
                        title: '编辑此菜单',
                        url: '',
                        icon: 'icon-pencil'
                    },
                    {
                        name: 'delete',
                        title: '删除此菜单',
                        url: '',
                        icon: 'icon-remove'
                    }
                ];
            },
            controllerAs: 'tools',
            link: function (scope, element, attrs) {
                var items = scope.$root.menuItems;
                var config = scope.$eval(attrs.editMenuTools);
                var currentData = null;
                var toolsType = null;
                var dataMaps = function (id, newData) {
                    if (!id) {
                        return null;
                    };
                    var sourceData = CONFIG.getDataById(id, scope.$root.menuItems);
                    if (!sourceData) {
                        return null;
                    }
                    var parent = sourceData.parent;
                    var item = sourceData.item;
                    var index = sourceData.index;
                    var siblings = sourceData.siblings;
                    if (!!newData && !!toolsType) {
                        switch (toolsType) {
                            case 'child':
                                if (!item.subs) {
                                    item.subs = [];
                                }
                                if (item.type === 'last-sub') {
                                    item.type = 'has-sub';
                                    !item.icons && (item.icons = 'icon-plus');
                                }
                                item.subs.push(newData);
                                break;
                            case 'siblings':
                                parent.splice(index + 1, 0, newData);
                                break;
                            case 'edit':
                                item = angular.extend(item, newData, true);
                                break;
                            case 'delete':
                                parent.splice(index, 1);
                                siblings--;
                                if (siblings.length === 0 && parent.type === 'has-sub') {
                                    parent.type === 'last-sub';
                                }
                                break;
                        }
                        return sourceData.source;
                    } else {
                        return item;
                    }
                };
                // 数据提交
                var updateMenu = function (data) {
                    var node = scope.$parent.currentMenuNode;
                    var act = data.action;
                    var type = data.type;
                    if (!!CONFIG.isEmptyObj(data) || !config) {
                        return $rootScope.poplayer = {
                            type: 'error',
                            content: '操作失败!'
                        };
                    }
                    $rootScope.poplayer.type = 'loading';
                    var putData = angular.copy(data);
                    delete putData.subs;
                    delete putData.hasSub;
                    delete putData.action;
                    fetchService.get({
                            type: 'post',
                            url: act === 'delete' ? config.delete : act === 'edit' ? config.update : config.save,
                            data: putData
                        })
                        .then(function (ret) {
                            var result = !!ret.length ? ret[0].data : ret.data;
                            if (result.status - 0 !== 0) {
                                return $rootScope.poplayer = {
                                    type: 'error',
                                    content: '操作失败'
                                };
                            }
                            return $rootScope.poplayer = {
                                type: 'succ',
                                content: '操作成功',
                                redirect: function () {
                                    var setData = (act === 'edit' || act === 'delete') ? putData : result.data[0];
                                    console.log(setData);
                                    if (!!setData) {
                                        var newItems = dataMaps(currentData.id, setData);
                                        scope.$emit('Sidebar:updateMenu', newItems);
                                    }
                                }
                            };
                        });
                };
                // 弹窗对象
                var modalOpen = function (cfg) { //打开模态 
                    if (!cfg) {
                        cfg = {};
                    }
                    cfg.items = scope.$root.menuItems;
                    var modalInstance = $modal.open({
                        animation: false,
                        templateUrl: cfg.url || 'menuToolsEdit.html', //指向上面创建的视图
                        controller: cfg.ctrl || 'MenuModalInstanceCtrl', // 初始化模态范围
                        size: cfg.size, //大小配置
                        resolve: {
                            opts: function () {
                                return cfg;
                            }
                        }
                    });
                    modalInstance.opened.then(function ($scope) { // 模态窗口打开之后执行的函数  
                        //  console.log(arguments);  
                    });
                    modalInstance.result.then(function (data) { //点击确定回调函数
                        updateMenu(data);
                        // CONFIG.getData('sidebar', data);
                    }, function () {});
                };
                $timeout(function () {
                    // element = $(element[0]);
                    scope.$parent.toolSize = {
                        width: element.width(),
                        height: element.height()
                    };
                    element.on('click', function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var btn = $(e.target || e.srcElement)
                            .closest('a');
                        var node = scope.$parent.currentMenuNode;
                        toolsType = btn.attr('data-id');
                        if (!!node) {
                            var id = node.attr('data-id');
                            currentData = dataMaps(id);
                            if (!currentData) {
                                return $rootScope.poplayer = {
                                    type: 'error',
                                    content: '请先选择菜单'
                                };
                            }
                        } else {
                            currentData = {
                                pid: 0,
                                type: 'nav-group',
                                url: '',
                                permission: 1,
                                editable: 2
                            };
                        }
                        switch (toolsType) {
                            case 'delete': //删除菜单
                                if (!!currentData.subs && currentData.subs.length > 0) {
                                    return $rootScope.poplayer = {
                                        type: 'error',
                                        content: '请先移除子菜单'
                                    };
                                }
                                currentData.action = toolsType;
                                updateMenu(currentData);
                                break;
                            case 'siblings': // 同级菜单
                            case 'child': // 子菜单
                            case 'edit': // 编辑菜单
                                modalOpen({
                                    data: currentData,
                                    title: btn.attr('title'),
                                    type: toolsType,
                                    size: ''
                                });
                                break;
                        }
                    });
                });
            }
        };
    })
    .directive('editMenu', function ($timeout, CONFIG) {
        return {
            scope: true,
            restrict: 'A',
            link: function (scope, element, attrs) {
                var oDom = $(element);
                var oTools = oDom.siblings('#menu-tools');
                oDom.unbind()
                    .click('a', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });

                function setHover() {
                    var oEdit = oDom.find('a');
                    var menuOffset = oDom.offset();
                    var oTools = $('#menu-tools');
                    oEdit.unbind()
                        .hover(function (e) {
                            var toolSize = scope.$parent.toolSize || {};
                            var dom = $(e.target || e.srcElement);
                            dom = dom.closest('.source');
                            var id = dom.attr('data-id');
                            var offset = dom.offset();
                            var size = {
                                width: dom.width(),
                                height: dom.height()
                            };
                            scope.$parent.styles = {
                                'left': offset.left + size.width - (toolSize.width || 0) / 2 + 'px',
                                'top': offset.top + size.height - (toolSize.height || 0) + 'px'
                            };
                            scope.$parent.currentMenuNode = dom;
                            !scope.$parent.toolStatus && (scope.$parent.toolStatus = true);
                            scope.$parent.$apply();
                            oTools.stop(true, true)
                                .fadeIn();
                        }, function (e) {
                            // oTools.stop(true, true).fadeOut(1000);
                            // if (!!checkContainer(oDom.add(oTools), toEl))
                        });
                    scope.$emit('Sortable:updateEvent', true);
                }
                $timeout(setHover);
                scope.$watch(function () {
                    return oDom.find('a').length;
                }, function (newValue, oldValue) {
                    (newValue !== oldValue) && setHover();
                });
                scope.$on('Menus:resetHover', function (event, data) {
                    (!!data) && setHover();
                });
            }
        }
    });

