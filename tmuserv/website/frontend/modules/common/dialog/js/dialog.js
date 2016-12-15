'@file: loading';
angular.module(ProjectName)
    .directive('dialog', 
        ['$rootScope', '$timeout', '$q', 'fetchService', 'CONFIG', 'ui.bootstrap', 'dialogs.main', 'pascalprecht.translate',
        function ($rootScope, $timeout, $q, fetchService, CONFIG, $translate, dialogs) {
            var directive = {
                restrict: 'A',
                replace: true,
                scope: true,
                template: '\
                    <button class="btn btn-danger" ng-click="launch(\"error\")">Error Dialog</button>\
                ',
                controller: function ($scope) {
                    var _this = this;

                    //  this.echartsConfig = angular.copy(this._echartsConfig);
                },
                controllerAs: 'modal',
                link: function (scope, element, attrs, ctrl) {

                }
            };
            return directive;
        }
    ]);
