//引入
import axios from 'axios';
import qs from 'qs';

// 引入本地存储封装
import local from '@/utils/local'

//设置请求默认服务器
axios.defaults.baseURL = 'http://172.16.12.143:3000'
//在axios的请求发送出去之前，头部携带token

// 请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    let token = local.get('myToken')

    // 给头部携带token
    config.headers.authorization = `Bearer ${token}` 
    return config
})




export default {
    get(url,params){
        return new Promise((resolve,reject)=>{
            axios.get(url,{params})
            .then((resp)=>{
                resolve(resp.data)
            })
            .catch((err)=>{
                reject(err);
                
            })
        })
    },
    post(url,params){
        return new Promise((resolve,reject)=>{
            axios.post(url,qs.stringify(params))
            .then((resp)=>{
                resolve(resp.data)
            })
            .catch((err)=>{
                reject(err);
                
            })
        })
    }
}