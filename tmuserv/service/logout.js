/**
 * @file 退出
 * @author zhaojun04
 */
var url = require('url');
var express = require('express');
var router = express.Router();
var uuapConfig = require('./uuap.config.js');
router.get('/', function (req, res) {
    var service = req.query.service || req.headers.referer;
    var host = req.headers.host;
    var redirecturl = url.format({
        protocol: uuapConfig.protocol,
        hostname: uuapConfig.hostname,
        port: uuapConfig.port,
        pathname: '/logout',
        query: {
            service: service
        }
    });
    (req.session && req.session.views) && (req.session.views = {});
    console.log('**************logout****************');
    res.redirect(redirecturl);
});
module.exports = router;

