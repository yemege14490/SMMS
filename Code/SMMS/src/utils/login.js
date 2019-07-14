//引入
import axios from 'axios';
import qs from 'qs';


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