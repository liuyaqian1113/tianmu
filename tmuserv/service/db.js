var mysql = require('mysql');
var pool = function () {
    console.log('mysql connected! =================================');
    return mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        port: 3306,
        password: '',
        database: 'bd_tianmu_visual_platform'
    });
};
var db = {
  mysql: pool
};
module.exports = db;
