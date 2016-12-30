/**
 * @file sidebar_controller the file
 */
angular.module(window.ProjectName)
    .controller('sidebar_controller', function ($rootScope, $scope, $state, CONFIG, fetchService, $timeout) {
        var api = CONFIG.api[$state.current.name];
        $rootScope.menuItems = [];
        
        var updateItems = function (list, item) {
            if (!list || !item) {
                return null;
            };
            var sourceItems = angular.copy(list);
            var id = item.pid;
            function getDataObj (data) {
                var _thisObj = arguments.callee;
                if (!data) {
                    return sourceItems;
                }
                angular.forEach(data, function (v, k) {
                    if (!v.subs) {
                        v.subs = [];
                    }
                    if (v.id - 0 === id - 0) {
                        v.subs.push(item);
                        return;
                    } else {
                        _thisObj(v.subs);
                    }
                });
                return sourceItems;
            }
            var node = getDataObj(sourceItems);
            return sourceItems;
        };
        var formatDatas = function (data) {
            var items = [];
            angular.forEach(data, function (v) {
                delete v.updatetime;
                delete v.editor;
                if (!v.subs) {
                    v.subs = [];
                }
                if (v.pid - 0 === 0) {
                    items.push(v);
                } else {
                    items = updateItems(items, v);
                }
            });
            return items;
        };
        fetchService.get({
            url: CONFIG.api.common.getMenus,
            data: {}
        }).then(function (ret) {
            ret = !!ret.length ? ret[0].data : ret.data;
            if (ret.status - 0 === 0) {
                var data = formatDatas(ret.data);
                $timeout(function () {
                    $rootScope.menuItems = data || [];
                    !!data.length && $scope.$root.$broadcast('Menus:resetHover', data);
                    console.log(data);

                })
            }
           // $scope.$root.menuItems = ret.data;
          //  scope.$root.$broadcast('Menus:resetHover', ret.data);
        });
    });

