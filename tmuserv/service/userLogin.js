/**
 * @file 基于express的UUAP sso 登录
 * @author zhaojun04
 */
var url = require('url');
var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var session = require('express-session');
var sql = require('./sql');
var uuapConfig = require('./uuap.config.js');
console.log('get userinfo');

var json = function (res, status, ret) {
    var result = {
        status: status || 0,
        msg: status === 0 ? 'success' : 'fail',
        data: ret
    }
    return res.json(result);
};
router.all('*', function (req, res, next) {
    var query = req.query;
    var views = req.session && req.session.views;
    var redirType = (req.headers['x-requested-with'] && req.headers['x-requested-with'] === 'xmlhttprequest');
    console.log(views, '=================== userInfo session');
    if (!views || !views.userName) {
        var redirecturl = url.format({
            protocol: uuapConfig.protocol,
            hostname: uuapConfig.hostname,
            port: uuapConfig.port,
            query: {
                service: service,
                appKey: uuapConfig.appKey
            }
        });
        if (!!redirType) {
            var result = {
                status: -1,
                msg: '未登录',
                data: redirecturl
            };
            return res.json(result);
        } else {
            return res.redirect(redirecturl);
        }
    }
    var args = {
        key: ['name'],
        val: [views.userName]
    };
    sql.get('getUser', args, function (status, result) {
        if (!!status) {
            return json(res, 1, result || '数据库操作失败');
        }
        result = result[0];
        if (!result) {
            return res.json({
                status: 1,
                uname: views.userName
                msg: '请先申请接入平台'
            });
        }
        req.session.views.userInfo = {
            level: result.level,
            bussinessname: result.level == 100 ? 'all' : result.bussinessname
        };
        var pathname = url.parse(req.originalUrl).pathname;
        if (!!redirType && pathname === '/login') {
            var redirecturl = {
                status: 0,
                uname: views.userName,
                uinfo: req.session.views.userInfo,
                msg: 'success'
            };
            return res.json(redirecturl);
        }
        next();
    });
});
module.exports = router;

