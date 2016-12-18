/**
 * Created by liekkas.zeng on 2015/1/7.
 */
angular.module(window.ProjectName)
    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, opts) { //依赖于modalInstance
        $scope.items = opts.items;
        $scope.selected = {
            item : $scope.items[0]
        };
        var data = angular.copy(opts.data);
        var type = opts.type;
        var level = data.type;
        data.editable = '';
        if (type === 'child') { // 创建子菜单
            if (data.type === 'nav-group') {
            } else if (data.type === 'has-sub') {
                data.subs = [];
            } else if (data.type === 'last-sub') {
            }
            level = 'last-sub';
            delete data.editable;
            data.id = '';
            data.url = '';
            data.pid = opts.data.id | 0;
            data.name = '子菜单';
            data.type = level;
            data.icons = '';
        } else if (type === 'siblings') { // 创建同级菜单
            if (data.type === 'nav-group') {
                data.editable = 2;
                data.subs = [];
            } else if (data.type === 'has-sub') {
                level = 'last-sub';
                data.subs = [];
            } else if (data.type === 'last-sub') {
            } 
            data.id = '';
            data.pid = opts.data.pid || 0;
            data.name = '同级菜单';
            data.type = level;
            data.url = '';
            data.icons = '';          
        } else if (type === 'edit') { //编辑菜单
            console.log(data);
        }
        $scope.menus = data;
        $scope.modalTitle = opts.title;
        $scope.ok = function(){  
            $modalInstance.close($scope.menus, type); //关闭并返回当前选项
        };
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel'); // 退出
        }
    })
    .directive('editMenuTools', function ($rootScope, fetchService, $timeout, $modal, CONFIG) {
        return {
            scope: true,
          //  require: '?^sidebar',
            restrict: 'A',
            template: '\
                <a ng-repeat="tool in tools.toolsList" href="{{tool.url}}" data-id="{{tool.name}}" class="{{tool.name}}" title="{{tool.title}}"><i class="{{tool.icon}}"></i></a>\
            ',
            controller: function ($scope) {
                this.toolsList = [
                    {name: 'siblings', title: '创建同级菜单', url: '', icon: 'icon-trash'},
                    {name: 'child', title: '创建子菜单', url: '', icon: 'icon-trash'},
                    {name: 'edit', title: '编辑此菜单', url: '', icon: 'icon-edit'},
                    {name: 'delete', title: '删除此菜单', url: '', icon: 'icon-remove-sign'}
                ];
              //  CONFIG.bindData('toolsList', this.toolsList, function (data) {
               //     this.toolsList = data;
              //  });
            },
            controllerAs: 'tools',
            link: function (scope, element, attrs) {
                var items = scope.$root.menuItems;
                var config = scope.$eval(attrs.editMenuTools);
                var currentData = null;
                var toolsType = null;
                var dataMaps = function (id, newData) {
                    items = scope.$root.menuItems;
                    if (!items) {
                        return null;
                    };
                    var sourceItems = items;
                    var nod = null;
                    function getObj (data) {
                        var _thisObj = arguments.callee;
                        angular.forEach(data, function (v, k) {
                            if (v.id - 0 === id - 0) {
                                if (!!newData && !!toolsType) {
                                    switch (toolsType) {
                                        case 'child':
                                            if (!data[k].subs) {
                                                data[k].subs = [];
                                            }
                                            if (data[k].type === 'last-sub') {
                                                data[k].type = 'has-sub';
                                                !data[k].icons && (data[k].icons = 'fa fa-plus');
                                                data[k].hasSub = true;
                                            }
                                            data[k].subs.push(newData);
                                            break;
                                        case 'siblings':
                                            data.splice(k + 1, 0, newData);
                                            break;
                                        case 'edit':
                                            data[k] = angular.extend(v, newData, true);
                                           // data.splice(k, 1, newData);
                                            break;
                                    }
                                    return nod = sourceItems;
                                } else {
                                    return nod = v;
                                }
                            } else {
                                _thisObj(v.subs);
                            }
                        });
                        return nod;
                    }
                    var node = getObj(sourceItems);
                    return node;
                };
                var updateMenu = function (data, type) {
                    var node = scope.$parent.currentMenuNode;
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
                    fetchService.get({
                        type: 'post',
                        url: type === 'delete' ? config.delete : type === 'edit' ? config.update : config.save,
                        data: putData
                    }).then(function (ret) {
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
                                var newItems = dataMaps(currentData.id, result.data[0]);
                                console.log(newItems);
                                scope.$emit('Sidebar:updateMenu', newItems);
                                scope.$parent.$broadcast('Sortable:updateEvent', newItems);
                            }
                        };
                    });


                    
                };
                var modalOpen = function(cfg){  //打开模态 
                    if (!cfg) {
                        cfg = {};
                    }
                    cfg.items = items;
                    var modalInstance = $modal.open({
                        animation: false,
                        templateUrl: cfg.url || 'menuToolsEdit.html',  //指向上面创建的视图
                        controller : cfg.ctrl || 'ModalInstanceCtrl',// 初始化模态范围
                        size : cfg.size, //大小配置
                        resolve : {
                            opts : function(){
                                return cfg;
                            }
                        }
                    });
                    modalInstance.opened.then(function ($scope) {// 模态窗口打开之后执行的函数  
                        console.log($scope);  
                    });
                    modalInstance.result.then(function (data, type) { //点击确定回调函数
                        updateMenu(data, type);
                       // CONFIG.getData('sidebar', data);
                    },function(){
                       
                    });
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
                        var btn = $(e.target || e.srcElement).closest('a');
                        var node = scope.$parent.currentMenuNode;
                        toolsType = btn.attr('data-id');
                        if (!!node) {
                            var id = node.attr('data-id');
                            currentData = dataMaps(id);
                            if (!currentData || toolsType === 'delete') {
                                return;
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
                        modalOpen({
                            data: currentData,
                            title: btn.attr('title'),
                            type: toolsType,
                            size: ''
                        });
                    });
                });
            }
        };
    })
    .directive('editMenu', function ($timeout, CONFIG) {
        return {
            scope: true,
          //  require: '?^sidebar',
            restrict: 'A',
            link: function (scope, element, attrs) {
                var oDom = $(element);
                oDom.unbind().click('a', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                function setHover() {
                    var oEdit = oDom.find('a');
                    var menuOffset = oDom.offset();
                    oEdit.unbind().hover(function (e) {
                        var toolSize = scope.$parent.toolSize || {};
                        var dom = $(e.target || e.srcElement);
                        dom = dom.closest('.source');
                        var id = dom.attr('data-id');
                        var offset = dom.offset();
                        var size = {
                            width: dom.width(),
                            height: dom.height()
                        }
                        scope.$parent.styles = {
                            'left': offset.left + size.width - (toolSize.width || 0) / 2 + 'px',
                            'top': offset.top + size.height - (toolSize.height || 0) + 'px'
                        };
                        scope.$parent.currentMenuNode = dom;
                        !scope.$parent.toolStatus && (scope.$parent.toolStatus = true);
                        scope.$parent.$apply();
                    }, function (e) {

                    });

                }
                $timeout(setHover);
                scope.$watch(
                    function () {
                        return oDom.find('a').length;
                    },
                    function (newValue, oldValue) {
                      if (newValue !== oldValue) {
                        setHover();
                      }
                    }
                );
                scope.$on('Menus:resetHover', function (event, data) {
                    if (!!data) {
                        setHover();
                    }
                });
            }
        }
    });

