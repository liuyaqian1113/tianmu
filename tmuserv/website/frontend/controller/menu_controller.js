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
            delete: api.delete
        };
        $scope.toolStatus = true;

        $timeout(function () {
          /*  var oSort = angular.element('[sidebar="sortable"]');

            Sortable.create(oSort[0], {
                animation: 150,
                draggable: '.nav-group, .root-menu>li',
                handle: '.sort-handle'
            });
            var oMenu = oSort.find('.root-menu>li');
            console.log(oMenu);
            angular.forEach(oMenu, function (el){
                Sortable.create(el, {
                    group: 'menus',
                  //  draggable: '.nav-group',
                  //  handle: '.sort-handle',
                    animation: 150
                });
            });*/
        }, 100);
    });

