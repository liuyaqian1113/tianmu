var express = require('express');
var router = express.Router();
var sql = require('../service/sql');
var request = require('request');
var formidable = require('formidable');
var remote = require('../service/remote.js');
var session = require('express-session');
console.log('api service start with /api/tmu!!!');
var obj2Arr = function (obj, type, uname) {
    if (!!obj instanceof Array) {
        return obj;
    }
    var arr = {
        key: [],
        val: [],
        source: obj
    };
    for (var o in obj) {
        if (!o.hasOwnProperty(o) && !/^(\$|\_)/i.test(o)) {
            arr.key.push('`' + o + '`');
            var values = obj[o];
            if (values instanceof Array) {
                values = (values.length && typeof values[0] === 'string') ? values.join('|') : '';
            }
            if (typeof values === 'object') {
                values = JSON.stringify(values);
            }
            arr.val.push('' + values + '');
        }
    }
    if (type === 'post' && !obj.updatetime) {
        arr.key.push('updatetime');
        arr.val.push(new Date());
        uname && (arr.key.push('editor'), arr.val.push(uname));
    }
    return arr;
};
var json = function (res, status, ret) {
    var result = {
        status: status || 0,
        msg: status === 0 ? 'success' : 'fail',
        data: ret
    }
    return res.json(result);
};
/**
 * 主题操作
 */
router.post('/tmu/theme/saveCategory', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'post', req.session.views.userName);
    sql.set('saveCategory', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, '操作成功');
    });
});
router.get('/tmu/theme/getCategory', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'get');
    sql.get('getCategory', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
router.post('/tmu/theme/saveTheme', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'post', req.session.views.userName);
    console.log(args, '========');
    sql.set('saveTheme', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, '操作成功');
    });
});
router.get('/tmu/theme/themeList', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'get');
    console.log(args, '========');
    sql.get('themeList', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
/**
菜单操作
*/
router.post('/tmu/menu/saveMenu', function (req, res, next) {
    var args = req.body || req.query || req.params;
    if (!!args && args.id === '') {
        delete args.id;
    }
    args = obj2Arr(args, 'post', req.session.views.userName);
    console.log(args, '========save');
    sql.set('saveMenu', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        var lastId = result.insertId;
        sql.get('getMenuById', {
            key: ['id'],
            val: [lastId]
        }, function (status, result) {
            if (!!status) {
                return json(res, 1, result || '数据库操作失败');
            }
            return json(res, 0, result);
        });
        // return json(res, 0, result);
    });
});
router.post('/tmu/menu/updateMenu', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'post', req.session.views.userName);
    console.log(args, '========update');
    sql.set('updateMenu', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
// 用户管理
router.get('/tmu/menu/getUser', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'get');
    console.log(args, '========getUser');
    sql.set('getUser', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
// 删除用户
router.post('/tmu/menu/deleteUser', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'post', req.session.views.userName);
    console.log(args, '========deleteUser');
    sql.set('deleteUser', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
// 修改用户权限
router.post('/tmu/menu/updateUser', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'post', req.session.views.userName);
    console.log(args, '========updateUserupdateUser');
    sql.set('updateUser', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
// 删除菜单, 假如为系统菜单则需要超级管理员权限认证
router.post('/tmu/menu/deleteMenu', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'post', req.session.views.userName);
    console.log(args, '========delete\n');
    sql.set('deleteMenu', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
router.get('/tmu/menu/getMenus', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'get');
    console.log(args, '========getMenus');
    sql.get('getMenus', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库读取失败');
        }
        return json(res, 0, result);
    });
});
router.get('/tmu/menu/getMenuById', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'get');
    console.log(args, '========getMenuById');
    sql.get('getMenuById', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库读取失败');
        }
        return json(res, 0, result);
    });
});
/**
数据报表操作
*/
// 拉取远程数据API
router.all('/tmu/tables/getRemoteApi', remote);
// 拉取数据报表配置文件
router.get('/tmu/tables/getTablesConfig', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'get');
    console.log(args, req.body || req.query || req.params, '============');
    return json(res, 0, {
        "tablesName": "新建数据报表",
        "searchsPanel": [{
            "type": "dateTimeRange",
            "title": "日期范围",
            "resolve": ["modules\/common\/daterangepicker\/daterangepicker.css", "modules\/common\/daterangepicker\/daterangepicker.min.js"],
            "cols": 4,
            "key": "dateTimeRange_870536",
            "order": 1
    }, {
            "type": "dateTime",
            "title": "日期",
            "resolve": ["modules\/common\/daterangepicker\/daterangepicker.css", "modules\/common\/daterangepicker\/daterangepicker.min.js"],
            "cols": 3,
            "key": "dateTime_830137",
            "order": 2
    }, {
            "type": "singleSelect",
            "title": "单选下拉框",
            "cols": 3,
            "key": "singleSelect_947368",
            "order": 4,
            "varname": "",
            // "dataOrigin": "static",
            "dataOrigin": "remote",
            "api": "http:\/\/cq02-mco-sumeru475.cq02.baidu.com:8083\/aunceladmin\/singlestattable",
            "source": [],
            "singleSelect": {
                "key": "singleSelect_947368",
                "val": "留存-留存率"
            }
            /* "source": [{
                "key": "1",
                "val": "a"
        }, {
                "key": "2",
                "val": "b"
        }]*/
    }],
        "tablesPanel": [{
            "type": "table",
            "api": "http:\/\/cq02-mco-sumeru475.cq02.baidu.com:8083\/aunceladmin\/singlestattable",
            "apiRate": 0,
            "cols": 12,
            "showpage": true,
            "options": [{
                "key": "table_761869_1",
                "order": 1,
                "subs": [{
                    "text": "请输入列名",
                    "py": "QSRLM",
                    "cols": 1,
                    "rows": 1,
                    "order": 1,
                    "hasOrder": false,
                    "hasDrag": false,
                    "key": "table_761869_0_0"
            }, {
                    "text": "请输入列名",
                    "py": "QSRLM1",
                    "cols": 1,
                    "rows": 1,
                    "order": 2,
                    "hasOrder": false,
                    "hasDrag": false,
                    "key": "table_761869_0_1"
            }, {
                    "text": "请输入列名",
                    "py": "QSRLM2",
                    "cols": 1,
                    "rows": 1,
                    "order": 3,
                    "hasOrder": false,
                    "hasDrag": false,
                    "key": "table_761869_0_2"
            }, {
                    "text": "请输入列名",
                    "py": "QSRLM3",
                    "cols": 1,
                    "rows": 1,
                    "order": 4,
                    "hasOrder": false,
                    "hasDrag": false,
                    "key": "table_761869_0_3"
            }, {
                    "text": "请输入列名",
                    "py": "QSRLM4",
                    "cols": 1,
                    "rows": 1,
                    "order": 5,
                    "hasOrder": false,
                    "hasDrag": false,
                    "key": "table_761869_0_4"
            }]
        }],
            "title": "数据报表",
            "key": "table_761869",
            "order": 1
        }]
    });
    sql.get('getTablesConfig', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
router.post('/tmu/tables/saveTablesConfig', function (req, res, next) {
    var args = req.body || req.query || req.params;
    var master_val = {
        tablesName: args.tablesName,
        editor: args.editor,
        businessId: args.businessId,
        productId: args.productId
    };
    var responseData = {};
    master_val = obj2Arr(master_val, 'post', req.session.views.userName);
    console.log(master_val, '============主数据入库开始');
    sql.set('saveTablesConfig', master_val, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '主数据入库操作失败');
        }
        var lastId = result.insertId;
        responseData.tablesId = lastId;
        responseData.searchs = {};
        responseData.tables = {};
        for (var i = 0, l = args.searchsPanel.length; i < l; i++) {
            var searchs_val = args.searchsPanel[i];
            var keys = searchs_val.key;
            searchs_val.editor = args.editor;
            searchs_val.tablesId = lastId;
            searchs_val = obj2Arr(searchs_val, 'post', req.session.views.userName);
            console.log(searchs_val, '============查询条件' + i + '准备入库');
            sql.set('saveSearchs', searchs_val, function (status, result) {
                if (!!status) {
                    return json(res, 1, result || '事务数据入库操作失败');
                }
                responseData.searchs[keys] = result.insertId;
                console.log(result);
                // return json(res, 0, result);
            });
        }
        for (var j = 0, len = args.tablesPanel.length; j < len; j++) {
            var tables_val = args.tablesPanel[j];
            var keys = tables_val.key;
            tables_val.editor = args.editor;
            tables_val.tablesId = lastId;
            tables_val = obj2Arr(tables_val, 'post', req.session.views.userName);
            console.log(tables_val, '============数据报表' + j + '准备入库');
            sql.set('saveTables', tables_val, function (status, result) {
                if (!!status) {
                    return json(res, 1, result || '事务数据入库操作失败');
                }
                responseData.tables[keys] = result.insertId;
                console.log(result);
            });
        }
        return json(res, 0, '操作成功!');
    });
});
/**
场景操作
*/
router.get('/tmu/scene/getThemeConfig', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'get');
    console.log(args, req.body || req.query || req.params, '============');
    sql.get('getThemeConfig', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
// 图片上传
router.post('/tmu/imageUpload', function (req, res, next) {
    var args = req.query || req.params || req.body;
    var type = args.type;
    console.log(args, type, '========', req.files);
    // args = obj2Arr(args);
    var form = new formidable.IncomingForm({
        keepExtensions: true, //keep .jpg/.png
        uploadDir: "website/upload/" + type + '/' //upload path
    });
    form.parse(req, function (err, fields, files) {
        if (!!err) {
            return json(res, 1, '图片上传失败');
        }
        if (!!files && files.file) {
            var path = files.file.path;
            files.file.path = path.replace(/^website(\\+|\/+)/ig, '')
                .replace(/\\+/ig, '/');
        }
        return json(res, 0, files);
    }); //bind event handler
    form.on("progress", function (err) {})
    form.on("complete", function (err) {})
});
module.exports = router;

