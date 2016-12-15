angular.module(window.ProjectName).factory('dialog', function ($rootScope, $http, $q, CONFIG) {
    var fetch = function (args) {
        var promises = [];
        angular.forEach(args, function (param) {
            if (!param.url) return;
            if (!param.params) {
                param.params = {};
            }
            if (typeof param.url === 'string') {
                param.url = CONFIG.getApi(param.url);
            }
            if (!!CONFIG.noCache && !param.params._v) {
                param.params._v = CONFIG.version;
            }
            var promise = $http(param);
            promises.push(promise);
        });
        return $q.all(promises);
    };
    return {
        layer: (function () {
            var oLayer = document.getElementById('dialog_container');
            if (!oLayer) {
                oLayer = document.createElement('div');
                oLayer.id = 'dialog_container';
                oLayer.className = 'dialog';
                var html = '<hgroup>\
                                <header>\
                                    <em></em>\
                                    <div class="loader">\
                                        <span></span><span></span><span></span><span></span><span></span>\
                                    </div>\
                                </header>\
                                <article>{{poplayer.content||"正在加载..."}}</article>\
                                <footer></footer>\
                            </hgroup>';
                oLayer.innerHTML = html;
                document.body.appendChild(oLayer);
            }
            return angular.element(oLayer);
        })(),
        /*
        dialog.open({
            template: '<div>',
            templateUrl: '',
            remote: {
                url: '',
                data: {}
            }
        }).then(function (data) {
    
        });
         */
        open: function (params) {
            /*              return $ocLazyLoad.load([
                              'theme/default/css/monitor.css',
                              'controller/monitor_controller.js',
                              // 'modules/common/monitor/jtopo-0.4.8-min.js',
                              'modules/common/canvas/canvas.css',
                              'modules/common/canvas/jtopo-0.4.8.js',
                              'modules/common/canvas/canvas.js',
                              'directives/ng-echarts.js'
                          ]);*/
            if (!params) return {};
            var args = [],
                tmpl,
                result;
            if (params.template) {
                tmpl = params.template;
            } else if (!!params.templateUrl) {
                args.push({
                    url: params.templateUrl,
                    params: {}
                });
            }
            if (params.remote) {
                if (typeof params.remote.url === 'string') {
                    args.push({
                        url: params.remote.url,
                        params: params.remote.data || {}
                    });
                }
            }

            var defer = $q.defer();
            if (!!args.length) {
                fetch(args).then(function () {
                    if (arguments.length === 1) {
                        var data = arguments[0][0].data;
                        if (typeof data === 'string') {
                            tmpl = data;
                        } else if (typeof data === 'object') {
                        console.log(data, arguments);
                            result = data;
                        }
                    } else if (arguments.length === 2) {
                        tmpl = arguments[0][0].data;
                        result = arguments[1][0].data;
                    }
                    defer.resolve({tmpl: tmpl, result: result});
                });
            } else {
                defer.resolve({tmpl: tmpl, result: result});
            }
            return defer.promise;
        }
    };
});
