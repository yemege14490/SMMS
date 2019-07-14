//引入mysql模块
const mysql = require('mysql')
//创建连接对象
const connection = mysql.createConnection({
    host: 'localhost' ,  // 连接数据库的地址
    user: 'root'  , // 数据库用户名
    password: 'root', // 数据库密码
    database: 'smms' // 数据库名
})
// 执行连接方法
connection.connect();
console.log('数据库连接成功！')

//暴露连接对象
module.exports=connection;