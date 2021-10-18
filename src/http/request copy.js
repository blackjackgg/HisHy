import axios from "axios";
import qs from 'qs';
const  service = axios.create({
    baseURL:'http://localhost:8080/',
    timeout:3000
})
// 发送请求之前处理
service.interceptors.request.use(
    config =>{
        return config
    },error => {
        return Promise.reject(error)
    })

// 请求返回处理
service.interceptors.response.use(
    response =>{
        return response
    }, error => {
        return Promise.reject(error.response.data)
    })

// 请求方法
const  http = {
    post(url,params){
        return service.post(url,params,{
            transformRequest:[(params) =>{
                return JSON.stringify(params)
            }],
            headers:{
                'Content-Type':'application/json'
            }
        })
    },

    put(url,params){
        return service.put(url,params,{
            transformRequest:[(params) =>{
                return JSON.stringify(params)
            }],
            headers:{
                'Content-Type':'application/json'
            }
        })
    },

    get(url,params){
        return service.get(url,{
            params:params,
            paramsSerializer:(params =>{
                return qs.stringify(params)
            } )
        })
    },

    delete(url,params){
        return service.delete(url,{data:qs.stringify(params)},{
            headers:{
                'Content-Type':'application/json'
            }
        })
    }
}

export default http