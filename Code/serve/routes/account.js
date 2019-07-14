var express = require('express');
var router = express.Router();

//引入模块
const  connection=require('./js/conn')
//设置响应头解决跨域
router.all('*',(req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
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
//修改密码
router.post('/modifyPassword',(req,res)=>{
	//接收参数
	let {newPass}=req.body;
	let id=req.user.id;
	//准备sql
	  const sqlStr = `update accounts set password='${newPass}' where id=${id}`;
	  //执行sql    
	  connection.query(sqlStr,(err,data)=>{
	      if(err)throw err;
	      if(data.affectedRows>0){
	      res.send({code:0,msg:'修改密码成功'})
	      }else{
	      res.send({code:1,msg:'修改密码失败'})
	      }
	      
	  })
})

//验证 原密码是否一致
router.post('/checkoldpwd',(req,res)=>{
    //接收参数
    let {oldPwd}=req.body;
    if(oldPwd===req.user.password){
    	res.send({code:0,msg:'原密码正确'})
    }else{
    	res.send({code:1,msg:'原密码错误'})
    }
})

//验证 账号是否一致
router.post('/checkuser',(req,res)=>{
    //接收参数
    let {username}=req.body;
    //准备sql
    let sqlStr=`select * from accounts where username='${username}'`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
    	if(err)throw err;
    	if(data.length){
    		res.send({code:1,msg:"账号已存在"})
    	}else{
    		res.send({code:0,msg:"账号可以使用"})
    	}
    })
})

//添加账号
router.post('/accountadd',(req,res)=>{
    //接收参数
    let {username,password,userGroup}=req.body
    //设置默认头像
    let avatarUrl=`/upload/avatar.jpg`;
    //准备sql
    const sqlStr = `insert into accounts(username, password, userGroup,avatarUrl) values('${username}', '${password}', '${userGroup}','${avatarUrl}')`;
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err)throw err;
        if(data.affectedRows>0){
            res.send({code:0,msg:'添加数据成功'})
        }else{
            res.send({code:1,msg:'添加数据失败'})
        }
    })
})
//账号列表
// router.get('/accountlist',(req,res)=>{
//     //准备sql
//     const sqlStr=`select * from accounts order by ctime desc`
//     //执行sql
//     connection.query(sqlStr,(err,data)=>{
//         if(err)throw err;
//         res.send({data})
//     })
// })
//账号删除
router.get('/accountdel',(req,res)=>{
    //接收参数
    let {id}=req.query;
    //准备sql
    var sqlStr=`delete from accounts where id=${id}`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err)throw err;
        if(data.affectedRows>0){
            res.send({code:0,msg:'删除成功'})
        }else{
            res.send({code:1,msg:'删除失败'})
        }
        
    })
    
})
//账号编辑
router.get('/accountedit',(req,res)=>{
    //接收参数
    let {id}=req.query;
    //准备sql
   let sqlStr = `select * from accounts where id=${id}`;
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err)throw err;
        res.send({data})
    })
})
//保存修改请求
router.post('/saveedit',(req,res)=>{
    //接收参数
    let {username,userGroup,id}=req.body;
    //准备sql
    const sqlStr = `update accounts set username='${username}', userGroup='${userGroup}' where id=${id}`;
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err)throw err;
        if(data.affectedRows>0){
            res.send({code:0,msg:'修改成功'})
        }else{
            res.send({code:1,msg:'修改失败'})
        }
        
    })
    

})
//批量删除
router.get('/batchdelete',(req,res)=>{
    //接收参数
    let {idArr}=req.query;
    //准备sql
    const sqlStr = `delete from accounts where id in (${idArr})`;
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err)throw err;
        if(data.affectedRows>0){
            res.send({code:0,msg:'批量删除成功'})
        }else{
            res.send({code:1,msg:'批量删除失败'})
        }
        
    })
})
//按照分页请求数据
router.get('/accountlistByPage',(req,res)=>{
    
    //接收参数
    let {pageSize,currentPage}=req.query;
    //定义变量保存总条数
    let total;
    //准备sql
    let sqlStr=`select * from accounts order by ctime desc`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err)throw err;
        total=data.length;
    })

    // 分页公式：
    //         select * from 表名 limit (currentPage - 1) * pageSize, pageSize;

    //准备sql 按照分页查询数据
    let n=(currentPage - 1) * pageSize;
    sqlStr+=` limit ${n},${pageSize}`;
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err)throw err;
        res.send({data,total})
        
    })
    
    

})

//用户信息
router.get('/getinfo',(req,res)=>{
    let id=req.user.id;
    //准备sql
    let sqlStr=`select * from accounts where id=${id}`
    //执行sql
    connection.query(sqlStr,(err,data)=>{
        if(err)throw err;
        res.send({data})
    })
    
})

//获取用户组
router.get('/getrole',(req,res)=>{
    res.send({role:req.user.userGroup})
})

/* -----上传开始---- */ 
// 引入node上传模块
var multer = require('multer');

// 配置存储路径 和 重命名
var storage = multer.diskStorage({
    // 图片上传到服务器以后 要放置的路径
    destination: 'public/upload',

    // 图片重命名
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
var upload = multer({
    storage,
});

// 接收上传请求
router.post('/uploadavatar', upload.single('file'), (req, res) => {
    // 接收到的文件信息
	var file = req.file;

	// 文件名
	let fileName = file.filename;
	// 拼接文件路径
	let avatarUrl = '/upload/' + fileName

	// 构造sql
	const sqlStr = `update accounts set avatarUrl = '${avatarUrl}' where id=${req.user.id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: "上传成功", avatarUrl})
		} else {
			res.send({code: 1, reason: "上传失败"})
		}
	})
})

/* ----上传结束----- */ 
module.exports = router;
