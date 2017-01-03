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
var request = require('request');
var uuapConfig = require('./uuap.config.js');
var querystring = require('querystring');
console.log('uuap config');
console.log(uuapConfig);
var json = function (res, status, ret) {
    var result = {
        status: status || 0,
        msg: status === 0 ? 'success' : 'fail',
        data: ret
    }
    return res.json(result);
};
// 第一次用户请求url
var remote_service,
    remote_ticket;
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
                    console.log('--------login info-------------');
                    console.log(data);
                    // 解析UUAP用户名
                    userName = data['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:user'][0];
                    var userInfo = data['cas:serviceResponse']['cas:authenticationSuccess'];
                    // 放入session
                    req.session.remote.userName = userName;
                    // req.session.views.userInfo = userInfo;
                    // 重定向
                    var params = url.parse(req.originalUrl, true);
                    var query = params.query;
                    remote_ticket = query.ticket;
                    // delete query.ticket;
                    console.log('--------headers info-------------', querystring.stringify(req.headers));
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
                            pathname: params.pathname,
                            query: query
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
    console.log('==================== remote start ===========================');
    var query = req.query;
    var remote = req.session && req.session.remote;
    var ticket = query.ticket || remote_ticket;
    var urlOps;
    var redirType = (req.headers['x-requested-with'] && req.headers['x-requested-with'] === 'xmlhttprequest');
    console.log('remote_service: ' + decodeURIComponent(remote_service));
    // session 验证
    if (remote && remote.userName) {
        var pathname = url.parse(req.originalUrl)
            .pathname;
        console.log('----------session longin--------------', pathname);
        // next();
        console.log(ticket, '=================================remote_ticket');
        if (ticket) {
            //  var cookie = request.cookie('UUAPTGC=' + args.ticket + ';Path=/');
            //  res.setHeader("Set-Cookie", cookie);
            // req.headers.cookie = req.headers.cookie + ';UUAPTGC=' + ticket;
            req.body.ticket = ticket;
        }
        next();
    } else if (ticket) {
        // ticket 验证
        !remote && (req.session.remote = {});
        var postData = querystring.stringify({
            ticket: ticket,
            service: remote_service,
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
        console.log('----------remote_ticket validate--------------');
        if (uuapConfig.protocol === 'http:') {
            validateByHttp(req, res, next, urlOps, postData, validateTicket);
        } else {
            validateByHttps(req, res, next, urlOps, postData, validateTicket);
        }
    } else {
        var pathname = url.parse(req.originalUrl)
            .pathname;
        var host = req.headers.host;
        /*  service = url.format({
              protocol: req.protocol,
              host: host,
              pathname: pathname,
              query: req.query
          });*/
        remote_service = 'http://cq02-mco-sumeru475.cq02.baidu.com:8083/aunceladmin/singlestatchar?type=1&end_date=20160831&event=exposure&lables_name=DEF_ALL_PV&exp_id=106&start_date=20160725&_v=1.1.0';
        /* service = url.format({
             protocol: req.protocol,
             host: host,
             pathname: '/tmu/tables/getRemoteApi',
             query: {
                 url: 'http://cq02-mco-sumeru475.cq02.baidu.com:8083/aunceladmin/singlestatchar?type=1&end_date=20160831&event=exposure&lables_name=DEF_ALL_PV&exp_id=106&start_date=20160725&_v=1.1.0'
             }
         });*/
        var redirecturl = url.format({
            protocol: uuapConfig.protocol,
            hostname: uuapConfig.hostname,
            port: uuapConfig.port,
            pathname: uuapConfig.login,
            query: {
                service: remote_service,
                appKey: uuapConfig.appKey
            }
        });
        var getRemoteParams = function (body) {
            if (!body) {
                return null;
            }
            var args = {};
            args.action = body.match(/action=\"([^\?]+)[^\"]+\"/)[1].replace(/JSESSIONID/i, 'JSESSIONID');
            var reg = body.match(/input\s+type="hidden"\s+name="lt"\s+value="([^"]+)"/im);
            args.form = {};
            args.form.lt = reg[1];
            reg = body.match(/input\s+type="hidden"\s+name="execution"\s+value="([^"]+)"/im);
            args.form.execution = reg[1];
            reg = body.match(/input\s+type="hidden"\s+name="_eventId"\s+value="([^"]+)"/im);
            args.form._eventId = reg[1];
            args.form.type = 1;
            args.form.remenberMe = 'on';
            return args;
        };
        console.log('-----------redirect uuap-------------------', redirecturl);
        // res.redirect(redirecturl);
        if (!!redirType) {
            var p = url.parse(req.url);
            var uuapUrl = uuapConfig.protocol + '//' + uuapConfig.hostname + (uuapConfig.port - 0 === 80 ? '' : (':' + uuapConfig.port));
            var header = req.headers;
            var remote_url = uuapUrl + uuapConfig.remoteLogin;
            var remote_api = remote_url + '?username='+ uuapConfig.username +'&password='+ uuapConfig.password +'&submit=submit&loginUrl=' + decodeURIComponent(p.protocol + '//' + p.hostname + ':' + p.port +'/login') + ' &service=' + decodeURIComponent(remote_service);
            header['host'] = uuapConfig.hostname + ':' + uuapConfig.port;
            header['upgrade-insecure-requests'] = 1;
            header['accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
            request({url: remote_service, rejectUnauthorized: false}, function (err1, resp1, body1) {
                if (!err1 && resp1.statusCode == 200 && !!body1) {
                    var args = getRemoteParams(body1);
                    if (args) {
                        request
                            .post({url: uuapUrl + args.action + '?service=' + remote_service, headers: header})
                            .form(args.form)
                        //    .redirects(0) // 防止页面重定向
                            .end(function (result) {
                                var cookie = result.headers['set-cookie'];
                                console.log('==================', result, cookie);
                            });
                            /*
                        request.post({url: uuapUrl + '?service=' + remote_service, form: args.form}, function (err2, resp2, body2) {
                    console.log(err2, resp2, '==========237====',uuapUrl + args.action + '?service=' + remote_service);
                            if (!err2 && resp2.statusCode == 302 && !!body2) {
                                args = getRemoteParams(body2);
                                console.log(args);
                            }
                        });*/
                    }

                  //  var regexp = body.match(/action=\"\/login;([^\?]+)[^\"]+\"|input\s+type="hidden"\s+name="([^"]+)"\s+value="([^"]+)"/img);

                }
            });
            /*var post = request.post({url: remote_url, form: {
                username: uuapConfig.username,
                password: uuapConfig.password,

            }}, function (error, response, body) {
                console.log(error, '----', response.statusCode, '=======', remote_url, '==================' ,body);
                if (!error && response.statusCode == 200) {
                    
                } else if (response.statusCode == 500) {
                    var result = {
                        status: 500,
                        msg: '服务器异常',
                        data: []
                    };
                    res.json(result);
                }
            });
           
            var form = post.form();
            form.append('username', uuapConfig.username);
            form.append('password', uuapConfig.password);
            form.append('service', remote_service);
            form.append('loginUrl', remote_service);
            form.append('submit', 'submit');*/
        } else {
            res.redirect('/');
        }
    }
});
module.exports = router;

