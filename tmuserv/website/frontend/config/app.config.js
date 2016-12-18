'@file: app.config';
'use strict';
angular.module(window.ProjectName, ['ngRoute', 'ui.router', 'ngCookies', 'oc.lazyLoad', 'ui.bootstrap']).constant('CONFIG', {
    debuger: false, // 是否开启debugger模式
    noCache: true,
    version: window.ProjectVersion || '1.0.1',
    webRoot: './frontend/',
    pixelRatio: 2, //window.devicePixelRatio || 2, //canvas分辨率
    getApi: function (online) {
        var isLocal = !!(/((kent|tianbin|liuyaqian|localhost)\.baidu\.com|\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3})/i
            .test(location.hostname)) && location.port === 80;
        var uri = online.match(/[^\/]+$/);
        uri = (!!isLocal) ? this.webRoot + '/api/api_' + uri[0] + '.json' : online;
        return uri;
    },
    transferKbit: function (num) {
        if (!num) {
            return '';
        }
        var output = num.toString();
        if (!!/^\d{4,}$/.test(output)) {
            output = output.replace(/(\d{1,2})(?=(\d{3})+\b)/g, '$1,');
        }
        return output;
    },
    isEmptyObj: function (obj) {
        if (typeof obj !== 'object') {
            return null;
        }
        var flag = true;
        var newObj = {};
        angular.forEach(obj, function (o) {
            return flag = false;
        });
        return flag;
    },
    bindData: function (act, data, fn) {
        var _this = this;
        return this.$scope.$on('Data:' + act, function (event, args) {
            if (!!fn) {
                if (!_this._setData) {
                    _this._setData = {};
                }
                _this._setData[act] = fn;
            }
            if (args && args.data) {
             // data.pop();
            }
            (args.callback) && args.callback(data);
        });
    },
    getData: function (act) {
        var me = this;
        var fn = function () {
            var args = {};
            var _this = this;
            this._data = {};
            this.then = function (a) {
                // 可以复制给一个变量然后delete _this._data[act];
                var _ret = _this._data[act];
               // delete _this._data[act];
                return a(_ret);
            };
            args.callback = function (data) {
                _this._data[act] = data;
            };
            me.$scope.$emit('Data:' + act, args);
        };
        var ret = new fn();
        return ret;
    },
    setData: function (act, data) {
        if (!this._setData || !this._setData[act]) {
            return null;
        }
        return this._setData[act](data);
    },
    getToken: function () {
        var date = new Date().getMilliseconds();
        var hash = Math.floor(Math.random() * 100000 + 1);
        var code = date + hash - 0;
        code = hex_md5(code);
        return code;
    },
    getFormData: function (form) {
        var data = {};
        if (!form) {
            return data;
        }
        angular.forEach(form, function (v, k) {
            if (!/^(\$|\_)/i.test(k)) {
                data[k] = v;
            }
        });
        return data;
    },
    getFixedSize: function (ratio, size) {
        var rt = ratio.split(':');
        var w = rt[0],
            h = rt[1];
        return Math.floor(size / w * h);
    },
    tmpl: {
        homepage: '/',
        index: '/',
        login: 'http://' + location.host + '/searchboxbi/api/login'
    },
    api: {
        common: {
            getMenus: 'api/tmu/menu/getMenus'
        },
        index: { //首页
            list: 'api/list'
        },
        monitor: { //实时监控(RTA)
            sceneConf: 'api/monitorData'
        },
        theme: { //风格主题配置
            sceneConf: 'api/monitorData',
            list: 'api/tmu/theme/themeList'
        },
        themeCategory: { // 主题分类
            save: 'api/tmu/theme/saveCategory',
            edit: 'api/tmu/theme/getCategory'
        },
        themeAdd: { // 创建新风格主题
            get: 'api/tmu/theme/getCategory',
            save: 'api/tmu/theme/saveTheme'
        },
        scene: {
            getCategory: 'api/tmu/theme/getCategory',
            getThemeConf: 'api/tmu/scene/getThemeConfig'
        },
        menu: {
            save: 'api/tmu/menu/save',
            getById: 'api/tmu/menu/getById',
            delete: 'api/tmu/menu/delete'
        }
    }
}).filter('transferHtml', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    }
}).run(function ($rootScope, $ocLazyLoad, $state, CONFIG) {
    CONFIG.$scope = $rootScope;
    CONFIG.USERINFOS = {
        uname: typeof USERINFOS !== 'undefined' ? USERINFOS.user : 'user01',
        permission: ['all']
    };
    $rootScope.poplayer = {};
    $ocLazyLoad.__load = $ocLazyLoad.load;
    $ocLazyLoad.load = function (files) {
        if (!!angular.isArray(files)) {
            files = files.map(function (item) {
                return (item.indexOf(CONFIG.webRoot) < 0 && item.indexOf('http://') < 0) ? CONFIG.webRoot + item : item;
            });
        } else {
            files = (files.indexOf(CONFIG.webRoot) < 0 && item.indexOf('http://') < 0) ? CONFIG.webRoot + files : files;
        }
        var conf = (!!CONFIG.noCache) ? {
            cache: true,
            version: CONFIG.version
        } : {};
        return $ocLazyLoad.__load(files, conf);
    };

    $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
        $rootScope.poplayer = {
            type: 'loading'
        };
    });
    $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
        //  $rootScope.params = toParams;
        $rootScope.poplayer.type === 'loading' && ($rootScope.poplayer.type = '');
        $rootScope.$state.fromState = fromState;
        $rootScope.$state.toState = toState;
        $rootScope.$state.fromParams = fromParams;
        $rootScope.$state.toParams = toParams;
    });
    // 系统全局参数
    $rootScope.webRoot = CONFIG.webRoot;
    $rootScope.$state = $state;
    $rootScope.commParams = {};
    $rootScope.commCache = {};

    /*去掉iphone手机滑动默认行为*/
    /*$('html, body').on('touchmove', function (e) {
        if (!!$(this).is('.index, .canvas')) {
            return e.preventDefault();
        }
    });
    $rootScope.checkPermission = function (key, aid) {
     aid = aid || $rootScope.params.aid;
     return permissionService.permissionCheck(key, aid);
     };*/
});

(function () {
    var html = $('html');
    var isLocal = !!(/((kent|tianbin|liuyaqian)\.baidu\.com|\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3})/i
        .test(location.hostname));
    var api = isLocal ? './frontend/api/permission.json' : '/searchboxbi/api/login';

    function loadJsCss(items, fn) {
        if (!angular.isArray(items)) {
            items = [items];
        }
        var oHead = document.getElementsByTagName('head')[0];
        var oBody = document.getElementsByTagName('body')[0];
        // var fragment = document.craeteDocumentFragment();
        (function runLoad() {
            var callback = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    this.onload = this.onreadystatechange = null;
                    (!items.length) ? fn(): runLoad();
                }
            };
            var file = items.shift();
            var ext = file.toLowerCase().match(/\.(\w+)$/);
            ext = !!ext ? ext[1] : 'js';
            switch (ext) {
                case 'css':
                    var oDom = document.createElement('link');
                    oDom.onload = oDom.onreadystatechange = callback;
                    oDom.type = 'text/css';
                    oDom.rel = 'stylesheet';
                    oDom.href = file;
                    break;
                case 'js':
                    var oDom = document.createElement('script');
                    oDom.onload = oDom.onreadystatechange = callback;
                    oDom.type = 'text/javascript';
                    oDom.src = file;
                    break;
            }
            oBody.appendChild(oDom);
        })();
    }
    if (!isLocal) {
        try {
            var ajax = $.ajax({
                url: api,
                headers: {
                    'X-Requested-With': 'xmlhttprequest'
                },
                data: {
                    _v: window.ProjectVersion
                }
            });
            return ajax.always(function (ret, status) {
                if (status === 'error') {
                    return prjstart();
                } else {
                    if (typeof ret === 'string') {
                        ret = $.parseJSON(ret);
                    }
                    return ((ret.errorCode - 0) === 0 || (ret.errorno - 0) === 0) ? prjstart(ret) : prjstart();
                }
            });
        } catch (err) {
            return prjstart();
        }
    } else {
        return prjstart();
    }

  //      <script type="text/javascript" src="./frontend/lib/js/ui-bootstrap-tpls-0.11.0.min.js"></script>
    function prjstart(args) {
        return loadJsCss([
            './frontend/modules/common/loading/loading.css',
            './frontend/modules/common/loading/loading.js',
            './frontend/service/fetch.js',
            './frontend/lib/js/echarts3.js',
            './frontend/lib/js/ui-bootstrap-tpls-0.11.0.min.js'
        ], function () {
            args = args || {};
            window.USERINFOS = {
                user: args.uname || 'user01',
                permission: args.data || ['all']

            };
            angular.bootstrap(html[0], [ProjectName]);
        });
    }
    /*$.getScript('./frontend/modules/common/loading/loading.css', function () {
            console.log(1);
        $.getScript('./frontend/modules/common/loading/loading.js', function () {
            console.log(2);
            angular.bootstrap(html[0], [ProjectName]);
        });
    });*/
})();
