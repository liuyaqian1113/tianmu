/**
 * Created by panjian01 by 2016/12/29.
 */
angular.module(window.ProjectName)
    .directive('ngSearch', function ($timeout, CONFIG) {
        return {
            scope: true,
            restrict: 'A',
            templateUrl: 'tmpl/search.html',
            link: function (scope, element, attrs) {
                var tableConf = scope.$eval(attrs.ngSearch);
                var oElement = $(element);
                scope.tablesModel = tableConf.model || 'edit';
                console.log(scope.tablesModel)
            }
        }
    });

