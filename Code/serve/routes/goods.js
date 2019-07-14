var express = require('express');
var router = express.Router();

//引入模块
const connection = require('./js/conn')
//设置响应头解决跨域
router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'authorization')
    next()
})
/* --- 验证token合法性开始 ---- */ 

	// 引入express-jwt模块 此模块主要用于验证token的合法性
	const expressJwt = require('express-jwt');
	//定义秘钥
	const secret = 'itsource';

	// 验证token合法性（检查用户携带的token是否正确）
	router.use(expressJwt ({
	    secret 
	}).unless({
	    path: ['/login/checklogin','/upload/avatar.jpg']  // 不需要验证的url
	}))

	// 如果token不正确，就会抛出错误，如果错误的名字是“UnauthorizedError” 可以断定就是token无效的错误
	router.use(function (err, req, res, next) {
	    if (err.name === 'UnauthorizedError') {  

	    	// token无效 就给前端浏览器响应401状态码 且响应错误提示信息 
	        res.status(401).send('无效的token，前端发送的请求，必须在请求头上携带token，才能拿到数据哦！');
	    }
	})

/* --- 验证token合法性结尾 ---- */ 
/* 商品添加 */
router.post('/goodsadd', (req, res) => {
    //接收参数
    let { category, barCode, goodsName, costPrice, salePrice, marketPrice, stockCount, goodsWeight, goodsUnit, vipDiscount, promotion, goodsDesc } = req.body;
    //准备sql
    let sqlStr = `insert into goods(category, barCode, goodsName, costPrice, salePrice, marketPrice, stockCount, goodsWeight, goodsUnit, vipDiscount, promotion, goodsDesc) values(?,?,?,?,?,?,?,?,?,?,?,?)`
    //参数
    let sqlParams = [category, barCode, goodsName, costPrice, salePrice, marketPrice, stockCount, goodsWeight, goodsUnit, vipDiscount, promotion, goodsDesc]
    //执行sql
    connection.query(sqlStr, sqlParams, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: '添加商品成功' }) // 响应成功的数据给前端
        } else {
            res.send({ code: 1, msg: '添加商品失败' }) // 响应失败的数据给前端
        }

    })
})

// 商品列表
router.get('/goodslistbypage', (req, res) => {
    //接收参数
    let { pageSize, currentPage, keyword, category } = req.query;
    //准备sql
    let sqlStr = `select * from goods where 1=1`;
    //定义变量保存总条数
    let total;
    // 如果分类不等于空 且 不等于全部
    if (category !== '' && category !== '全部分类') {
        // 拼接第一个查询条件
        sqlStr += ` and category='${category}'`;
    }

    // 如果第二个关键字不为空 那么就拼接sql
    if (keyword !== '') {
        sqlStr += ` and (goodsName like '%${keyword}%' or barCode like '%${keyword}%')`
    }

    // 拼接排序
    sqlStr += ` order by ctime desc`
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        total = data.length
    })
    //拼接分页
    let n = (currentPage - 1) * pageSize;
    sqlStr += ` limit ${n}, ${pageSize}`;
    //执行sql
    console.log(sqlStr)
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        res.send({ data, total })
    })

})

//商品编辑
router.get('/goodsedit', (req, res) => {
    //接收参数
    let { id } = req.query;
    //准备sql
    let sqlStr = `select * from goods where id=${id}`;
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        res.send({ data })
    })
})

//保存修改请求
router.post('/saveedit', (req, res) => {
    //接收参数
    let { barCode, goodsName, category, salePrice, promotion, id } = req.body;
    //准备sql
    const sqlStr = `update goods set barCode='${barCode}',goodsName='${goodsName}',category='${category}',salePrice='${salePrice}', promotion='${promotion}' where id=${id}`;
    //执行sql

    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: '修改成功' })
        } else {
            res.send({ code: 1, msg: '修改失败' })
        }

    })


})

//商品删除
router.get('/goodsdel', (req, res) => {
    //接收参数
    let { id } = req.query;
    //准备sql
    var sqlStr = `delete from goods where id=${id}`
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        console.log(data);
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: '删除成功' })
        } else {
            res.send({ code: 1, msg: '删除失败' })
        }

    })

})

//批量删除
router.get('/batchdelete', (req, res) => {
    //接收参数
    let { idArr } = req.query;
    //准备sql
    const sqlStr = `delete from goods where id in (${idArr})`;
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: '批量删除成功' })
        } else {
            res.send({ code: 1, msg: '批量删除失败' })
        }

    })
})

//生成 报表数据返回给前端
router.get('/getdata',(req,res)=>{
    res.send({
        xData: ["07-02", "07-03", "07-04", "07-05", "07-06", "07-07", "07-08"],
      seriesData: [500, 300, 800, 200, 1600, 2200, 1320]
    })
})

module.exports = router;
