/**
 * @file theme_controller the file
 */
'use strict';
angular.module(window.ProjectName)
    .controller('theme_controller', function ($rootScope, $scope, $state, $log, $stateParams, $timeout, $interval, CONFIG, fetchService) {
        var currentName = $state.current.name;
        var api = CONFIG.api[currentName];
        $scope.theme = {};
        $scope.theme.formData = {};
        $scope.theme.formData.themeType = 1;
        $scope.theme.saveCategory = function () {
            var data = CONFIG.getFormData($scope.themeForm);
            if (!!CONFIG.isEmptyObj(data)) {
                return $rootScope.poplayer = {
                    type: 'error',
                    content: '表单数据为空!'
                };
            }
            $rootScope.poplayer.type = 'loading';
            fetchService.get({
                type: 'post',
                url: api.save,
                data: data
            })
            .then(function (ret) {
                ret = !!ret.length ? ret[0].data : ret.data;
                $rootScope.poplayer = {
                    type: 'succ',
                    content: '主题分类创建成功',
                    redirect: function () {
                        return $state.go('theme', {});
                    }
                };
            });
        };
        $scope.theme.saveTheme = function () {
            var data = CONFIG.getFormData($scope.themeForm);
            data.themeId = CONFIG.getToken();
            if (!!CONFIG.isEmptyObj(data)) {
                return $rootScope.poplayer = {
                    type: 'error',
                    content: '表单数据为空!'
                };
            }
            // $rootScope.poplayer.type = 'loading';
            fetchService.get({
                    type: 'post',
                    url: api.save,
                    data: data
                })
                .then(function (ret) {
                    ret = !!ret.length ? ret[0].data : ret.data;
                    $rootScope.poplayer = {
                        type: 'succ',
                        content: '风格主题创建成功',
                        redirect: function () {
                            return $state.go('theme', {});
                        }
                    };
                });
        };
        $scope.theme.category = [];
        $scope.theme.setCategory = function (key, val) {
            $scope.theme.formData.themeCategoryId = key;
            $scope.theme.formData.themeCategoryName = val;
        };
        (function () {
            if (currentName !== 'themeAdd') {
                return;
            }
            fetchService.get({
                    url: api.get,
                    data: {}
                })
                .then(function (ret) {
                    ret = !!ret.length ? ret[0].data : ret.data;
                    $timeout(function () {
                        $scope.theme.category = ret.data;
                    });
                });
        })();
        $scope.theme.themeList = [];
        (function () {
            if (currentName !== 'theme') {
                return;
            }
            fetchService.get({
                    url: api.list,
                    data: {}
                })
                .then(function (ret) {
                    ret = !!ret.length ? ret[0].data : ret.data;
                    $timeout(function () {
                        $scope.theme.themeList = ret.data;
                        console.log(ret, $scope.theme.themeList);
                    });
                });
        })();
        // $scope.$parent.$broadcast('canvas:setBg');
    });

