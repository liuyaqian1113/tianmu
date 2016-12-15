var express = require('express');
var router = express.Router();
var sql = require('../service/sql');
var formidable =require('formidable');
console.log('api service start with /api/tmu!!!');
var obj2Arr = function (obj) {
    if (!!obj instanceof Array) {
        return obj;
    }
    var arr = [];
    for (var o in obj) {
        if (!o.hasOwnProperty(o) && !/^(\$|\_)/i.test(o)) {
            arr.push(obj[o]);
        }
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
    /* GET users listing. */
router.post('/tmu/theme/saveCategory', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args);
    sql.set('saveCategory', args, function (status, result) {
        if (!!status) {
            return json(res, 1, '数据库操作失败');
        }
        return json(res, 0, '操作成功');
    });
});
router.get('/tmu/theme/getCategory', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args);
    sql.get('getCategory', args, function (status, result) {
        if (!!status) {
            return json(res, 1, '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
router.post('/tmu/theme/saveTheme', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args);
    console.log(args, '========');
    sql.set('saveTheme', args, function (status, result) {
        if (!!status) {
            return json(res, 1, '数据库操作失败');
        }
        return json(res, 0, '操作成功');
    });
});
//图片上传
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
router.get('/tmu/theme/themeList', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args);
    console.log(args, '========');
    sql.get('themeList', args, function (status, result) {
        if (!!status) {
            return json(res, 1, '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
router.get('/tmu/scene/getThemeConfig', function (req, res, next) {
    var args = req.body || req.query || req.params;
    args = obj2Arr(args);
    console.log(args, req.body || req.query || req.params, '============');
    sql.get('getThemeConfig', args, function (status, result) {
        if (!!status) {
            return json(res, 1, '数据库操作失败');
        }
        return json(res, 0, result);
    });
});
module.exports = router;

