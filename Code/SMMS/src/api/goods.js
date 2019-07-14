//引入
import req from '@/utils/request'
//商品添加
export function goodsAdd(params){
    return req.post("/goods/goodsadd", params)
}

//分页函数
export function getDataByPage(params){
    return req.get('/goods/goodslistbypage', params)
}

//编辑
export function goodsedit(params){
    return req.get("/goods/goodsedit",params)
}

//保存
export function saveedit(params){
    return  req.post("/goods/saveedit",params)
}

//删除
export function goodsdel(params){
    return req.get("/goods/goodsdel",params)
}

//批量删除
export function batchDeletion(params){
    return req.get("/goods/batchdelete", params)
}

//加载后端数据
export function getSellData(){
    return req.get("/goods/getdata")
}