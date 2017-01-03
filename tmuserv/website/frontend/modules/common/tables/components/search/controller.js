window.sfController = window.sfController || {};
window.sfController.search = function (opts) {
    this.scope = opts.scope;
    this.py = opts.py;
    this.$timeout = opts.$timeout;
    this.CONFIG = opts.CONFIG;
};
window.sfController.search.prototype = {
    bind: function (key) {
        var that = this;
        this[key] && (this.scope[key] = function () {
            return that[key].apply(that, [].slice.call(arguments, 0));
        });
    },
    render: function (data, source) {
    },
    setProps: function (data, source) {
    },
    toolsCtrl: function (e, data, source, oParent) {
    },
    setOrder: function () {
    }
};

