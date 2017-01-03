/**
 * @file tables_controller the file
 */
'use strict';
angular.module(window.ProjectName).controller('user_controller',
    function($rootScope, $scope, $state, $log, $stateParams, $timeout, CONFIG, fetchService) {
        var api = CONFIG.api[$state.current.name];
        $scope.user = {};
        // 默认加载用户数据
        function indexUser() {
            fetchService.get({
                url: api.getUser
            }).then(function(ret) {
                ret = !!ret.length ? ret[0].data : ret.data;
                console.log(ret.data);
                $scope.user.tabJson = ret.data;
                $scope.user.myTabSelectValue = {};
                for (var i = 0; i < $scope.user.tabJson.length; i++) {
                    $scope.user.myTabSelectValue[i] = $scope.user.tabJson[i].level;
                };
            });
        }
        indexUser();
        // 修改用户的权限
        $scope.user.tabSelectChange = function(ev) {
            var myId = $scope.user.myTabSelectValue[ev];
            var obj = document.getElementById('tabSelect' + ev);
            var index = obj.selectedIndex;
            var id = obj.options[index].getAttribute('evid');
            fetchService.get({
                type: 'post',
                url: api.updateUser,
                data: {
                    id: id,
                    level: myId
                }
            }).then(function(ret) {
                ret = !!ret.length ? ret[0].data : ret.data;
                console.log(ret.data);
            });
            indexUser();
        };
        // 删除用户
        $scope.user.tablesDele = function(ev) {
            var target = $(ev.target);
            var evid = target.closest('tr').attr('id');
            fetchService.get({
                type: 'post',
                url: api.deleteUser,
                data: {
                    id: evid
                }
            }).then(function(ret) {
                ret = !!ret.length ? ret[0].data : ret.data;
                console.log(ret.data);
            });
            indexUser();
        };
    });
