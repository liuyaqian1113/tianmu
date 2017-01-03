/**
 * Created by panjian01 on 2016/12/21.
 */
angular.module("skyfall.components", [])
    .factory('skyfallController', function ($timeout, CONFIG, $q, fetchService) {
        var EventCache = {};
        var modelCache = {};
        var Base = function () {
            function Base(scope) {}
            Base.prototype = {
                $source: {},
                $on: function (act, fn, context) {
                    var that = this;
                    context = context || this.scope;
                    context[act] = function () {
                        return fn.apply(context, [].slice.call(arguments, 0));
                    };
                    return this;
                },
                $trigger: function (act, data, cb, context) {
                    context = context || this.scope;
                    var fn = context[act];
                    if (typeof fn === 'function') {
                        return fn.call(context, data, cb), this;
                    }
                },
                $off: function (act, context) {
                    context = context || this.scope;
                    var fn = context[act];
                    if (!!fn) {
                        delete context[act];
                    }
                    return this;
                },
                on: function (act, fn) {
                    var that = this;
                    EventCache[act] = function () {
                        return fn.apply(that, [].slice.call(arguments, 0));
                    };
                    return this;
                },
                trigger: function (act, data, cb) {
                    var fn = EventCache[act];
                    if (typeof fn === 'function') {
                        return fn.call(this, data, cb), this;
                    }
                },
                off: function (act) {
                    var fn = EventCache[act];
                    if (!!fn) {
                        delete EventCache[act];
                    }
                    return this;
                },
                view: function () {},
                controller: function () {},
                model: function (mod) {
                    var def = $q.defer();
                    if (!mod) {
                        fetchService.get({
                                url: this.path + '/data.json'
                            })
                            .then(function (ret) {
                                ret = !!ret.length ? ret[0].data : ret.data;
                                if (typeof ret === 'string') {
                                    ret = $.parseJSON(ret);
                                }
                                modelCache[this.hash] = ret;
                                def.resolve(ret);
                            });
                    } else if (mod instanceof Array) {
                        fetchService.get(mod)
                            .then(function (ret) {
                                ret = !!ret.length ? ret[0].data : ret.data;
                                if (typeof ret === 'string') {
                                    try {
                                        ret = $.parseJSON(ret);
                                    } catch (err) {
                                        ret = [];
                                    }
                                }
                                modelCache[this.hash] = ret;
                                def.resolve(ret);
                            });
                    } else if (typeof mod === 'object') {
                        modelCache[this.hash] = mod;
                        def.resolve(mod);
                    }
                    return def.promise;
                },
                Event: function () {}
            };
            return Base;
        }();
        var Tables = (function (base) {
            /*    if (!this instanceof Tables) {
                return new Tables([].slice.call(arguments, 0));
            }
*/
            function Tables(scope, act) {
                this.scope = scope;
                this.hashKey = act;
                this.path = CONFIG.webRoot + 'modules/common/tables/components/' + this.hashKey + '/';
            }
            Tables.prototype = new base();
            return Tables;
        })(Base);
        Tables.prototype.loadView = function (name) {
            var that = this;
            var defer = $q.defer();
            this.model()
                .then(function (data) {
                    that.scope[name] = that.path + 'template.html';
                    defer.resolve(data);
                });
            return defer.promise;
        };
        Tables.prototype.loadProps = function (name) {
            return this.scope[name] = that.path + 'props.html';
        };
        Tables.prototype.loadCtrl = function () {
            var that = this;
            var defer = $q.defer();
            angular.loadJsCss([
                that.path + 'controller.js'
            ], function () {
                return defer.resolve.call(that, that.scope);
            });
            return defer.promise;
        };
        /*var componetsPanel = (function (base) {

            function componetsPanel (scope, act) {
                this.scope = scope;
                this.hashKey = act;
                this.path = CONFIG.webRoot + 'modules/common/tables/components/' + this.hashKey + '/';
            };
            componetsPanel.prototype = new base();
            return componetsPanel;
        })(Tables);
        Tables.prototype.componetsPanel = componetsPanel;*/
        return Tables;
    });

