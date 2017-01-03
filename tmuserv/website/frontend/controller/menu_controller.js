/**
 * @file sidebar_controller the file
 */
"use strict"
angular.module(window.ProjectName)
    .controller('menu_controller', function ($rootScope, $scope, $state, CONFIG, $timeout) {
        var api = CONFIG.api[$state.current.name];
        $scope.menus = {};
        $scope.menus.menuConfig = {
            save: api.save,
            update: api.update,
            getById: api.getById,
            delete: api.delete,
            config: [
                {
                    dom: 'this',
                    handle: '.sort-handle',
                    connectWith: '',
                    items: '> li'
                },
                {
                    dom: '.root-menu',
                    handle: '',
                    connectWith: '.root-menu',
                    items: '> li'
                },
                {
                    dom: '.sub-menu',
                    handle: '',
                    connectWith: '.sub-menu',
                    items: '> li'
                }
            ]
        };
        $scope.toolStatus = true;
    });

