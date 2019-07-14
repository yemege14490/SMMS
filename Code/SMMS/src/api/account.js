//引入
import req from '@/utils/request'

//批量删除
export function batchDeletion(params){
    return req.get("/account/batchdelete", params)
}

//编辑
export function accountedit(params){
    return req.get("/account/accountedit",params)
}

//保存
export function saveedit(params){
    return  req.post("/account/saveedit",params)
}

//删除
export function accountdel(params){
    return req.get("/account/accountdel",params)
}

//分页请求
export function accountlistByPage(params){
    return req.get("/account/accountlistByPage",params)
}

//用户信息
export function getinfo(){
    return req.get("/account/getinfo")
}

//获取用户组
export function getRole(params){
    return req.get("/account/getrole",params)
}

//验证旧密码是否一致
export function checkOldPwd(params){
    return req.post("/account/checkoldpwd",params)
}

//修改密码
export function modifyPassword(params){
    return req.post("/account/modifypassword",params)
}

//账号添加
export function accountAdd(params){
    return req.post("/account/accountadd",params)
}

//验证账号是否一致
export function checkUser(params){
    return req.post("/account/checkuser",params)
}
