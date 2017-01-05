var skyfall = angular.module('skyfall', []);
/**
 * Login Controller
 */

skyfall.controller('LoginCtrl', function ($rootScope, $scope) {
    $scope.year = new Date().getFullYear();
    var path = location.pathname.match(/^.*\//);
    // $scope.uuap_callback_url = "http://" + location.host + path + 'run.html#/index';
    $scope.uuap_callback_url = "http://" + location.host + '/searchboxbi/api/login';
    $scope.goRun = function ($event) {
        if (!!window.isLocal) {
            $event.preventDefault();
            $event.stopPropagation();
            location.replace('./run.html#/index');
        }
    };
});
