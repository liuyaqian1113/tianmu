var db = require('../service/db');
var mysql = db.mysql();
var sql = {
    saveCategory: 'INSERT INTO tmu_category(name,updatetime) SELECT `name` FROM DUAL WHERE NOT EXISTS(SELECT `name` FROM tmu_category WHERE name=?) VALUES(?,?)',
    getCategory: 'SELECT id,name FROM tmu_category ORDER BY id',
    saveTheme: function (key, val) {
        return 'INSERT INTO tmu_theme('+ key +') VALUES('+ val +')'
    },
    themeList: 'SELECT themeId,themeName,updatetime,(SELECT name FROM tmu_category WHERE id=tmu_theme.themeCategoryId) AS themeCategory FROM tmu_theme',
    getThemeConfig: 'SELECT * FROM tmu_theme WHERE themeId = ?',
    getMenuById: 'SELECT * FROM tmu_menus WHERE id = ?',
    getMenus: 'SELECT * FROM tmu_menus ORDER BY id',
    saveMenu: function (key, val) {
        return 'INSERT INTO tmu_menus('+ key.join(',') +') VALUES('+ val.join(',') +')'
    },
    updateMenu: 'UPDATE tmu_menus SET name=?, url=?, icons=? WHERE id=?'
    // themeList: 'SELECT themeId,themeName,updatetime FROM tmu_theme LEFT OUTER JOIN tmu_category on tmu_theme.themeCategoryId = tmu_category.id'
    // INSERT INTO tmu_category(name) VALUES(?) ON DUPLICATE KEY UPDATE name=?'
};
var controller = {
    set: function (action, args, cb) {
        return mysql.getConnection(function (err, connection) {
            if (err) {
                // 如果是连接断开，自动重新连接
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    db.mysql();
                    console.log('mysql reconnect!');
                } else {
                    return cb(true, '数据库连接失败');
                }
            }
            if (!args) {
                return cb(true, '参数为空');
            }
            var key = [],
                val = [],
                dummy = [];
            if (args instanceof Object) {
                key = args.key;
                val = args.val;
                for(var i = 0, l = val.length; i < l; i++) {
                    dummy.push('?');
                }
            }
            var act = typeof sql[action] === 'string' ?  sql[action] : sql[action](key, dummy);
            console.log(act, key.join(','), val.join(','), '====准备入库');
            connection.query(act, val, function (status, result) {
                if (status) {
                    console.log(status, result, '====数据库写入失败');
                    return cb(true, '数据库写入失败');
                }
                console.log(result, status, '====入库成功');
                return connection.release(), cb(false, result);
            })
        });
    },
    get: function (action, args, cb) {
        return mysql.getConnection(function (err, connection) {
            if (err) {
                // 如果是连接断开，自动重新连接
                if(err.code === 'PROTOCOL_CONNECTION_LOST') {
                    db.mysql();
                    console.log('mysql reconnect!');
                } else {
                    return cb(true, '数据库连接失败');
                }
            }
            var key = [],
                val = [];
            if (args instanceof Object) {
                key = args.key;
                val = args.val;
            }
            var act = typeof sql[action] === 'string' ?  sql[action] : sql[action](key);
            console.log(act, args, '====准备读取数据');
            connection.query(act, val, function (status, result) {
                if (err) {
                    console.log(status, result, '====数据库读取失败');
                    return cb(true, '数据库读取失败');
                }
                console.log(result, status, '====数据读取成功');
                return connection.release(), cb(false, result);
            })
        });
    }
};
/*var controller = {
    set: function (action, args, cb) {
        var args = arguments;
        var thisObj = args.callee;
        return mysql.getConnection(function (err, connection) {
            if (err) {
                // 如果是连接断开，自动重新连接
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    mysql = db.mysql();
                    thisObj(args.apply([].slice.apply(0)));
                } else {
                    return callback('数据库连接失败');
                }
            }
            if (!args.length) {
                return cb('参数为空', {});
            }
            connection.query(sql[action], args, function (status, result) {
                if (err) {
                    return callback('数据库操作失败');
                }
                return connection.release(), cb(false, result);
            })
        });
    },
    get: function (action, args, cb) {
        return mysql.getConnection(function (err, connection) {
            if (err) {
                // 如果是连接断开，自动重新连接
                if(err.code === 'PROTOCOL_CONNECTION_LOST') {
                    db.mysql();
                } else {
                    return callback('数据库连接失败');
                }
            }
            connection.query(sql[action], args, function (status, result) {
                if (err) {
                    return callback('数据库操作失败');
                }
                return connection.release(), cb(false, result);
            })
        });
    }
};*/
module.exports = controller;
