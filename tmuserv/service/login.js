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
console.log('uuap config');
console.log(uuapConfig);
// 第一次用户请求url
var service;
/**
 * HTTP验证
 * @param req   当前请求request
 * @param res   当前请求response
 * @param ops   http.request参数
 * @param postData UUAP请求数据
 * @param callback  uuap验证请求回调
 */
function validateByHttp(req, res, next, ops, postData, callback) {
    // var vUrl = url.format(ops);
    var uurapReq = http.request(ops, function (uuapRes) {
        callback(req, res, next, uuapRes);
    });
    uurapReq.write(postData);
    uurapReq.end();
}
/**
 * HTTPS验证
 * @param req   当前请求request
 * @param res   当前请求response
 * @param ops   https.request参数
 * @param postData UUAP请求数据
 * @param callback  uuap验证请求回调
 */
function validateByHttps(req, res, next, ops, postData, callback) {
    // var vUrl = url.format(ops);
    var uurapReq = https.request(ops, function (uuapRes) {
        callback(req, res, next, uuapRes);
    });
    uurapReq.write(postData);
    uurapReq.end();
}
/**
 * 验证ticket回调
 * @param req   当前请求request
 * @param res   当前请求response
 * @param uuapRes   uuap验证请求response
 */
function validateTicket(req, res, next, uuapRes) {
    var redirType = (req.headers['x-requested-with'] && req.headers['x-requested-with'] === 'xmlhttprequest');
    var responseText = '';
    uuapRes.on('error', function (e) {
        res.send(e.message);
    });
    uuapRes.on('data', function (chunk) {
        responseText += chunk;
    });
    uuapRes.on('end', function () {
        var parser = new xml2js.Parser();
        var statusCode = res.statusCode;
        var userName;
        if (statusCode === 200) {
            parser.parseString(responseText, function (error, data) {
                if (error) {
                    res.send(error.message);
                } else {
                    console.log('--------login info-------------login');
                    console.log(data);
                    // 解析UUAP用户名
                    var oSucc = data['cas:serviceResponse']['cas:authenticationSuccess'];
                    if (!!oSucc) {
                        userName = data['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:user'][0];
                        var userInfo = data['cas:serviceResponse']['cas:authenticationSuccess'];
                        // 放入session
                        req.session.views.userName = userName;
                        // req.session.views.userInfo = userInfo;
                    }
                    // 重定向
                    var params = url.parse(req.originalUrl, true);
                    var query = params.query;
                  //  global_ticket = query.ticket;
                    // delete query.ticket;
                    console.log('--------user info-------------', userName);
                    if (!!redirType) { // ajax访问
                        var redirecturl = {
                            status: 0,
                            uname: userName,
                            msg: 'success'
                        };
                        res.json(redirecturl);
                    } else {
                        /*  var redirecturl = url.format({
                              pathname: params.pathname,
                              query: query
                          });*/
                        var redirecturl = url.format({
                            pathname: params.pathname, // params.pathname,
                            query: '' // query : 是否携带ticket参数
                        });
                        res.redirect(redirecturl || '/');
                    }
                    // res.redirect(redirecturl || '/');
                }
            });
        } else {
            res.send('UUAP validate fail：' + statusCode);
        }
    });
}
// UUAP登录认证 三步骤
// 1. URL访问如果未登录       跳转到UUAP登录界面   eg: http://127.0.0.1/test ->  http://uuad.baidu.com/login
// 2. UUAP登录成功           跳转到带ticket的URL访问页  eg: http://uuad.baidu.com/login ->  http://127.0.0.1/test?ticket=xxxxxx
// 3. 去UUAP验证ticket成功   跳转到URL  http://127.0.0.1/test?ticket=xxxxxx -> http://127.0.0.1/test
router.all('*', function (req, res, next) {
    var query = req.query;
    var views = req.session && req.session.views;
    var ticket = query.ticket;
    var urlOps;
    var redirType = (req.headers['x-requested-with'] && req.headers['x-requested-with'] === 'xmlhttprequest');
    console.log('service: ' + decodeURIComponent(service));
    // session 验证
    if (views && views.userName) {
        var pathname = url.parse(req.originalUrl)
            .pathname;
        console.log('----------session longin--------------', pathname);
        // next();
        if (!!redirType && pathname === '/login') {
            var redirecturl = {
                status: 0,
                uname: views.userName,
                msg: 'success'
            };
            res.json(redirecturl);
        } else {
            // UUAPTGC: ticket
            console.log(ticket, req.headers.cookie, '=================================ticket');
            if (pathname === '/login') {
                return res.redirect('/');
                // return res.redirect(uuapConfig.protocol + '//' + uuapConfig.hostname + (uuapConfig.port - 0 !== 80 && (':' + uuapConfig.port)) + uuapConfig.login);
              //  req.body.ticket = ticket;
            }
            next();
        }
    } else if (ticket) {
        // ticket 验证
        !views && (req.session.views = {});
        var postData = querystring.stringify({
            ticket: ticket,
            service: service,
            appKey: uuapConfig.appKey
        });
        urlOps = {
            protocol: uuapConfig.protocol,
            hostname: uuapConfig.hostname,
            port: uuapConfig.port,
            path: uuapConfig.validateMethod,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        console.log('----------ticket validate--------------');
        if (uuapConfig.protocol === 'http:') {
            validateByHttp(req, res, next, urlOps, postData, validateTicket);
        } else {
            validateByHttps(req, res, next, urlOps, postData, validateTicket);
        }
    } else {
        var pathname = url.parse(req.originalUrl).pathname;
        var host = req.headers.host;
        service = url.format({
            protocol: req.protocol,
            host: host,
            pathname: pathname,
            query: req.query
        });
        // service = 'http://cq02-mco-sumeru475.cq02.baidu.com:8083/aunceladmin/singlestatchar?type=1&end_date=20160831&event=exposure&lables_name=DEF_ALL_PV&exp_id=106&start_date=20160725&_v=1.1.0';
        /*  service = url.format({
              protocol: req.protocol,
              host: host,
              pathname: '/api/tmu/tables/getRemoteApi',
              query: {
                  url: 'http://cq02-mco-sumeru475.cq02.baidu.com:8083/aunceladmin/singlestatchar?type=1&end_date=20160831&event=exposure&lables_name=DEF_ALL_PV&exp_id=106&start_date=20160725&_v=1.1.0'
              }
          });*/
        var redirecturl = url.format({
            protocol: uuapConfig.protocol,
            hostname: uuapConfig.hostname,
            port: uuapConfig.port,
            query: {
                service: service,
                appKey: uuapConfig.appKey
            }
        });
        console.log('-----------redirect uuap-------------------', redirecturl);
        // res.redirect(redirecturl);
        if (!!redirType) {
            var result = {
                status: -1,
                msg: '未登录',
                data: redirecturl
            };
            return res.json(result);
        } else {
            res.redirect(redirecturl);
        }
    }
});
module.exports = router;

