/**
 * @file 统一异步远程接口
 * @author panjian01
 */
angular.module(window.ProjectName)
    .factory('fetchService', function ($http, $q, $rootScope, CONFIG) {
        return {
            get: function (params) {
                if (!params) {
                    return {};
                }
                if (!angular.isArray(params)) {
                    params = [params];
                }
                var promises = [];
                angular.forEach(params, function (param) {
                    if (!param.url) {
                        return;
                    }
                    var getUrl = param.url;
                    if (typeof getUrl === 'string' && !!CONFIG.getApi) {
                        getUrl = CONFIG.getApi(getUrl);
                    }
                    if (!!CONFIG.noCache && param.data && !param.data._v) {
                        param.data._v = CONFIG.version;
                    }
                    var fetchData = (!!param.type && param.type.toLowerCase()) === 'post' ? {
                        url: getUrl,
                        method: 'POST',
                        data: param.data || {}
                    } : {
                        url: getUrl,
                        method: 'GET',
                        params: param.data || {}
                    };
                    var promise = $http(fetchData);
                    promises.push(promise);
                });
                return $q.all(promises);
            },
            upload: function (params) {
                if (!params || (!!params && !params.url)) {
                    return {};
                }
                var url = params.url;
                if (!!CONFIG.noCache && params.data && !params.data._v) {
                    params.data._v = CONFIG.version;
                }
                var fd = new FormData();
                angular.forEach(params.data, function (v, k) {
                    fd.append(k, (v || ''));
                });
                // fd.append('uploadImage', params.data);
                var args = {
                    method: 'POST',
                    url: url,
                    data: fd,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                };
                return $http(args);
            },
            remote: function (params) {
                if (!params) {
                    return {};
                }
                if (!angular.isArray(params)) {
                    params = [params];
                }
                var promises = [];
                angular.forEach(params, function (param) {
                    if (!param.url) {
                        return;
                    }
                    var api = 'api/tmu/tables/getRemoteApi';
                    param.data.url = param.url;
                    if (!!CONFIG.noCache && param.data && !param.data._v) {
                        param.data._v = CONFIG.version;
                    }
                    var fetchData = (!!param.type && param.type.toLowerCase()) === 'post' ? {
                        url: api,
                        method: 'POST',
                        data: param.data || {}
                    } : {
                        url: api,
                        method: 'GET',
                        params: param.data || {}
                    };
                    var promise = $http(fetchData);
                    promises.push(promise);
                });
                return $q.all(promises);
            }
        };
    });

