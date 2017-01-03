window.sfController = window.sfController || {};
window.sfController.dateTime = function (opts) {
    this.scope = opts.scope;
    this.py = opts.py;
    this.$timeout = opts.$timeout;
    this.CONFIG = opts.CONFIG;
};
window.sfController.dateTime.prototype = {
    bind: function (key) {
        var that = this;
        this[key] && (this.scope[key] = function () {
            return that[key].apply(that, [].slice.call(arguments, 0));
        });
    },
    render: function (data, source) {
        this.scope.sourceData = angular.extend(this.scope.sourceData, source);
        var fields = data;
        if (!this.scope.previewData[source.key]) {
            this.scope.previewData[source.key] = {};
        }
        if (!!source.showpage) {
            fields = data.slice(0, 10);
            this.scope.previewData[source.key].total = data.length;
            this.scope.previewData[source.key].perpage = 10;
            this.scope.previewData[source.key].currentpage = 1;
        }
        this.scope.previewData[source.key].bodys = fields;
    },
    setProps: function (data, source) {
        return this.scope.$root.$broadcast('Props:setProps', {
            data: data,
            source: source || this.scope.sourceData
        });
    },
    /**
    表格操作
    e  点击对象
    data   操作数据对象
    source  操作数据对象的源数据
    oParent 操作数据对象的上级数据对象
    */
    toolsCtrl: function (e, data, source, oParent) {
        var el = $(e.target || e.srcElement).closest('li.btn');
        var oHead = el.closest('.thead');
        var oSource = source || this.scope.tablesPanel;
        var dataMap = this.CONFIG.getDataById(data.key, oSource);
        var $timeout = this.$timeout;
        var that = this;
        switch (el.attr('data-id')) {
            case 'setProps': // 配置表格属性
                this.setProps(data, oSource);
                break;
            case 'addWidth': // 增加表格宽度
                data.cols = data.cols < 12 ? ++data.cols : 12;
                break;
            case 'minusWidth': // 减少表格宽度
                data.cols = data.cols > 3 ? --data.cols : 3;
                break;
            case 'removeTable': // 移除表格
            case 'removeComponents': // 移除组件
                if (confirm('\n\n确定移除表格 【' + data.title + '】?\n\n\n')) {
                    angular.forEach(oSource, function (v, k) {
                        if (data.key === v.key) {
                            oSource.splice(k, 1);
                        }
                    });
                }
                break;
            case 'preview': // 预览模式
                if (this.scope.tablesModel === 'edit') {
                    this.scope.$root.$broadcast('Tables:setEditModel', {model: 'preview'});
                    el.attr('title', '编辑模式')
                        .find('.icon-eye-open')
                        .removeClass('icon-eye-open')
                        .addClass('icon-pencil');
                } else {
                    this.scope.$root.$broadcast('Tables:setEditModel', {model: 'edit'});
                    el.attr('title', '预览模式')
                        .find('.icon-pencil')
                        .removeClass('icon-pencil')
                        .addClass('icon-eye-open');
                }
                break;
            case 'addDashboard': // 添加到聚合页
                if (!data.headers.length || !this.scope.previewData[source.key]) {
                    return this.scope.$root.poplayer = {
                        type: 'error',
                        content: '请先完善数据报表'
                    };
                }
                return this.scope.$root.poplayer = {
                    type: 'succ',
                    content: '操作成功!'
                };
                break;
        }
    },
    getDefaultProps: function (scope) {
        return {
            varname: '',
            dataOrigin: 'static',
            api: ''

        };
    },
    setOrder: function () {
        return this.scope.$root.$broadcast('Props:setProps', {
            data: this.data,
            source: this.sourceData
        });
    }
};

