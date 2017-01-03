/**
 * @file 基于express的UUAP sso 登录
 * @author zhaojun04
 */
var http = require('http');
var https = require('https');
var url = require('url');
var express = require('express');
var xml2js = require('xml2js');
var router = express.Router();
var uuapConfig = require('./uuap.config.js');
var querystring = require('querystring');
var crypto = require('crypto');
// 加密字符串
var superStr = 'skyfall';
var superKey = '';
/**
*   @param   str 字符串 
    @param   key 秘钥
*/
function md5(str, key) {
    var decipher = crypto.createHash('md5', key);
    if (key) {
        return decipher.update(str)
            .digest();
    }
    return decipher.update(str)
        .digest('hex');
}
console.log('remote_api starting~~~~~~~~~~~~~~~~~~~~~~~~~~');
var json = function (res, status, ret) {
    var result = {
        status: status || 0,
        msg: status === 0 ? 'success' : 'fail',
        data: ret
    }
    return res.json(result);
};
// 第一次用户请求url
var remoteService = 'http://cq02-mco-sumeru475.cq02.baidu.com:8083/aunceladmin/singlestatchar?type=1&end_date=20160831&event=exposure&lables_name=DEF_ALL_PV&exp_id=106&start_date=20160725&_v=1.1.0';
var uuapUrl = uuapConfig.protocol + '//' + uuapConfig.hostname + (uuapConfig.port - 0 === 80 ? '' : (':' + uuapConfig.port));

function clone(objs) {
    if (typeof objs !== 'object') {
        return objs;
    }
    var dest = {};
    for (var key in objs) {
        if (typeof objs === "object") {
            dest[key] = clone(objs[key]);
        } else {
            dest[key] = objs[key];
        }
    }
    return dest;
}

function parseUrl(query) {
    var args = [];
    query = clone(query);
    var url = query.url;
    delete query.url;
    args.push('ak=' + md5(superStr, superKey));
    for (var q in query) {
        args.push(q + '=' + encodeURIComponent(query[q]));
    }
    return url + '?' + args.join('&');
}
router.all('*', function (req, res, next) {
    var query = req.query;
    var remoteUrl = parseUrl(query);
    remoteUrl = url.parse(remoteUrl);
    console.log(query, remoteUrl);
    if (!remoteUrl.protocol && remoteUrl.hostname) {
        return next();
    }
    var options = {
        hostname: remoteUrl.hostname,
        port: remoteUrl.port,
        path: remoteUrl.path, // '/aunceladmin/singlestatchar?type=1&end_date=20160831&event=exposure&lables_name=DEF_ALL_PV&exp_id=106&start_date=20160725&_v=1.1.0',
        method: 'GET',
        headers: {
            cookie: 'PHPSESSID=9383333646734393039316334693835303635313363366662346535636562326;',
            host: remoteUrl.host // cq02-mco-sumeru475.cq02.baidu.com:8083'
        }
    };
    var req1 = http.request(options, function (resp) {
        console.log('STATUS: ' + resp.statusCode);
        console.log('HEADERS: ' + JSON.stringify(resp.headers));
        resp.setEncoding('utf8');
        var responseText = '';
        resp.on('data', function (chunk) {
            responseText += chunk;
        });
        resp.on('end', function () {
            console.log('BODY: ' + responseText);
            // json(res, 0, chunk);
            responseText = JSON.parse(responseText);
            res.json(responseText);
        });
    });
    req1.on('error', function (e) {
        console.log('98:problem with request: ' + e.message);
    });
    req1.end();
});
module.exports = router;

