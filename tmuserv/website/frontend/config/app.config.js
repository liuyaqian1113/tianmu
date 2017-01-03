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
    /**
        根据id获取对应的数据对象
        @params
            id  string 数据对象的唯一key
            source   object 数据对象的源数据
            destroy  boolean 是否清除空源数据中空对象, 空数组
        @return
            source   整个儿menu对象
            parent   对应数据对象的父对象
            item  对应的数据对象
            index 对应数据对象在当前层级的序号
            siblings  对应数据对象的同级对象个数
    */
    getDataById: function (id, source, destroy) {
        if (!id || !source) {
            return null;
        };
        var result = {};
        function getDataObj(data) {
            angular.forEach(data, function (v, k) {
                if (v.id - 0 === id - 0 || v.key === id || (v.key === id)) {
                    return result = {
                        source: source,
                        parent: data,
                        item: v,
                        index: k,
                        siblings: data.length
                    };
                } else {
                    if (angular.isArray(v) && !v.length && !!destroy) {
                        data.splice(k, 1);
                        // continue;
                    }
                    if (!angular.isArray(v) && !v instanceof Object) {
                        return v;
                    }
                    getDataObj(v.tables || v.headers || v.subs || (!angular.isArray(v) ? [] : v));
                }
            });
            return result;
        }
        var node = getDataObj(source);
        return node;
    },
    getToken: function () {
        var date = '';//new Date().getMilliseconds();
        var hash = 'skyfall';// Math.floor(Math.random() * 100000 + 1);
        var code = date + hash;
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
        tables: { // 数据报表
            getTablesConfig: 'api/tmu/tables/getTablesConfig'
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
            save: 'api/tmu/menu/saveMenu',
            getById: 'api/tmu/menu/getMenuById',
            delete: 'api/tmu/menu/deleteMenu',
            update: 'api/tmu/menu/updateMenu'
        },
        user: {
            getUser: 'api/tmu/menu/getUser',
            deleteUser: 'api/tmu/menu/deleteUser',
            updateUser: 'api/tmu/menu/updateUser'
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
    var api = isLocal ? '/login' : './frontend/api/permission.json';
    var loadCache = {};
    angular.loadJsCss = function (items, fn) {
        if (!angular.isArray(items)) {
            items = [items];
        }
        var oHead = document.getElementsByTagName('head')[0];
        var oBody = document.getElementsByTagName('body')[0];
        // var fragment = document.craeteDocumentFragment();
        (function runLoad() {
            var file = items.shift();
        //    console.log(file, loadCache[file], items.length);
            if (!file) {
                return;
            }
            if (!loadCache[file]) {
                loadCache[file] = true;
                var callback = function (res) {
                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        if (res.type === 'error') {
                            delete loadCache[file];
                        }
                        this.onload = this.onreadystatechange = oDom.onerror = null;
                        (!items.length) ? fn(res): runLoad();
                    }
                };
                var ext = file.toLowerCase().match(/\.(\w+)$/);
                ext = !!ext ? ext[1] : 'js';
                switch (ext) {
                    case 'css':
                        var oDom = document.createElement('link');
                        oDom.onload = oDom.onreadystatechange = oDom.onerror = callback;
                        oDom.type = 'text/css';
                        oDom.rel = 'stylesheet';
                        oDom.href = file;
                        break;
                    case 'js':
                        var oDom = document.createElement('script');
                        oDom.onload = oDom.onreadystatechange = oDom.onerror = callback;
                        oDom.type = 'text/javascript';
                        oDom.src = file;
                        break;
                }
                oBody.appendChild(oDom);
            }
        })();
    }
    if (!!isLocal) {
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
                if (ret && ret.status - 0 === -1 && typeof ret.data === 'string') {
                  //  return prjstart();
                  return location.replace(ret.data);
                } else {
                    if (typeof ret === 'string') {
                        ret = $.parseJSON(ret);
                    }
                    return ((ret.errorCode - 0) === 0 || (ret.status - 0) === 0) ? prjstart(ret) : prjstart();
                }
            });
        } catch (err) {
           // return prjstart();
        }
    } else {
        return prjstart();
    }

  //      <script type="text/javascript" src="./frontend/lib/js/ui-bootstrap-tpls-0.11.0.min.js"></script>
    function prjstart(args) {
        return angular.loadJsCss([
            './frontend/modules/common/loading/loading.css',
            './frontend/modules/common/loading/loading.js',
            './frontend/service/fetch.js',
            './frontend/service/firstPY.min.js',
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
