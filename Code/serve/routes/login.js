var express = require('express');
var router = express.Router();

//引入模块
const  connection=require('./js/conn')

//引入
const jwt= require('jsonwebtoken');

//定义秘钥
   const secret = 'itsource';
//设置响应头解决跨域
router.all('*',(req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'authorization')
    next()
})
/* --- 验证token合法性开始 ---- */ 

	// 引入express-jwt模块 此模块主要用于验证token的合法性
	const expressJwt = require('express-jwt');

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
/* GET users listing. */
router.post('/checklogin', (req, res)=> {
  //接收参数
  let {username,password}=req.body;
  //准备 sql
  const sqlStr = `select * from accounts where username='${username}' and password='${password}'`;
  //执行sql
  connection.query(sqlStr,(err,data)=>{
    if(err)throw err;
    
      if(data.length){
        //生成token
        const token = jwt.sign(Object.assign({},data[0]), secret, {
          expiresIn:  60 * 60 * 2 // 过期时间
      });
      //id
      
        res.send({code:0,msg:'登陆成功',token});
      }else{
        res.send({code:1,msg:'登陆失败'});
      }
  })


});

module.exports = router;
