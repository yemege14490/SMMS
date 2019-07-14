//引入
import req from '@/utils/request'

//批量删除
export function checklogin(params){
    return req.post("/login/checklogin",params)
}


