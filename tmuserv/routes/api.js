var express = require('express');
var router = express.Router();
var sql = require('../service/sql');
var formidable =require('formidable');
console.log('api service start with /api/tmu!!!');
var obj2Arr = function (obj, type) {
    if (!!obj instanceof Array) {
        return obj;
    }
    var arr = {
        key: [],
        val: []
    };
    for (var o in obj) {
        if (!o.hasOwnProperty(o) && !/^(\$|\_)/i.test(o)) {
            arr.key.push(o);
            arr.val.push(obj[o]);
        }
    }
    if (type === 'post' && !obj.updatetime) {
        arr.key.push('updatetime');
        arr.val.push(new Date());
    }
    return arr;
};
var json = function (res, status, ret) {
    var result = {
        status: status || 0,
        msg: typeof ret === 'string' ? ret : '',
        data: ret
    }
    return res.json(result);
};
/**
* 主题操作
*/
router.post('/tmu/theme/saveCategory', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'post');
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
    args = obj2Arr(args, 'post');
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

router.post('/tmu/menu/save', function (req, res, next) {
    var args = req.body || req.query || req.params;
    if (!!args && args.id === '') {
        delete args.id;
    }
    args = obj2Arr(args, 'post');
    console.log(args, '========save');
    sql.set('saveMenu', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        var lastId = result.insertId;
        sql.get('getMenuById', {key: ['id'], val: [lastId]}, function (status, result) {
            if (!!status) {
                return json(res, 1, result || '数据库操作失败');
            }
            return json(res, 0, result);
        });
       // return json(res, 0, result);
    });
});
router.post('/tmu/menu/update', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args, 'post');
    console.log(args, '========update');
    sql.set('updateMenu', args, function (status, result) {
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
            files.file.path = path.replace(/^website(\\+|\/+)/ig, '').replace(/\\+/ig, '/');     
        }
        return json(res, 0, files);
    }); //bind event handler
    form.on("progress", function (err) {})
    form.on("complete", function (err) {})
});
module.exports = router;

