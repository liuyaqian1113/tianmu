var db = require('../service/db');
var mysql = db.mysql();
var sql = {
    saveCategory: 'INSERT INTO tmu_category(name) SELECT `name` FROM DUAL WHERE NOT EXISTS(SELECT `name` FROM tmu_category WHERE name=?)',
    getCategory: 'SELECT id,name FROM tmu_category ORDER BY id',
    saveTheme: 'INSERT INTO tmu_theme(themeType,themeCategoryId,themeCategoryName,themeName,themeDetail,themeId) VALUES(?,?,?,?,?,?)',
    themeList: 'SELECT themeId,themeName,updatetime,(SELECT name FROM tmu_category WHERE id=tmu_theme.themeCategoryId) AS themeCategory FROM tmu_theme',
    getThemeConfig: 'SELECT * FROM tmu_theme WHERE themeId = ?'
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
                    console.log('mysql reconnect!');
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
