/**
 * @file header_controller the file
 */
"use strict"
angular.module(window.ProjectName).controller('header_controller', function ($rootScope, $scope, $state, CONFIG) {
    $scope.username = CONFIG.USERINFOS.uname;
    var homepage = location.protocol + '//' + location.hostname + (location.port - 0 !== 80 ? (':' + location.port) : '') + '/';
    $scope.logout = function () {
        location.href = "/logout?service=" + homepage;
    };
    var from   = homepage;//'/frontend/loginSuccess.html';
    $scope.login    = from;
});