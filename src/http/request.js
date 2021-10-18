import axios from 'axios'
import qs from 'qs'
import Cookies from "js-cookie";
import {refreshTokenApi} from "../api/login"
import {setToken, setTokenTime, getToken, getTokenTime} from "../utils/auth"

const service = axios.create({
    //接口请求地址，是一个域名
    baseURL: 'http://localhost:8088/',
    timeout: 1000
})

function reFresh() {
    let parm = {
        "token": getToken()
    }
    return refreshTokenApi(parm).then(res => res.data)
}

//发送请求之前处理

let isRefresh = false

service.interceptors.request.use(
    config => {
        if (getToken()) {
            //把token添加到我们的请求头部
            config.headers['token'] = getToken()
        }
        //获取当前的系统时间
        let current = new Date().getTime()
        //获取token过期时间
        let expireTime = getTokenTime()
        if (expireTime > 0) {
            let exPm = (expireTime - current) / 1000 / 60
            //如果还差10分钟过期就刷新token
            if (exPm < 10) {
                if (!isRefresh) {
                    isRefresh = true
                    return reFresh().then(res => {
                        if (res.code == 200) {
                            //    设置新的token和过期时间设置
                            setToken(res.data.token)
                            setTokenTime(res.data.expireTime)
                            //    把新的token设置到头部
                            config.headers.token = getToken()
                        }
                        return config
                    }).catch(res => {
                        console.log(res)
                    }).finally(() => {
                        isRefresh = false
                    })
                }
            }
        }
        return config
    }, error => {
        return Promise.reject(error)
    })
//请求返回
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
//等于600说明token过期或者token认证失败，需要从新登陆
            if (response.data.code == 600) {
                //重置token
                Cookies.set("token", "")
                //跳到登录
                window.location.href = "/login";
                return response;
            } else {
                return Promise.resolve(response);
            }
        } else {
            return Promise.reject(response);
        }
    }, error => {
        return Promise.reject(error.response.data)
    })
//请求方法
const http = {
    post(url, params) {
        return service.post(url, params, {
            transformRequest: [(params) => {
                return JSON.stringify(params)
            }],
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    put(url, params) {
        return service.put(url, params, {
            transformRequest: [(params) => {
                return JSON.stringify(params)
            }],
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    //parm => {id:10}
    // http://localhost:8089/api/user?id=10
    get(url, params) {
        return service.get(url, {
            params: params,
            paramsSerializer: (params) => {
                return qs.stringify(params)
            }
        })
    },
    //parm => {id:10}
    // http://localhost:8089/api/user/10
    getRestApi(url, params) {
        let _params
        if (Object.is(params, undefined || null)) {
            _params = ''
        } else {
            _params = '/'
            for (const key in params) {
                console.log(key)
                console.log(params[key])
                // eslint-disable-next-line no-prototype-builtins
                if (params.hasOwnProperty(key) && params[key] !== null && params[key]
                    !== '') {
                    _params += `${params[key]}/`
                }
            }
            //去掉参数最后一位?
            _params = _params.substr(0, _params.length - 1)
        }
        console.log(_params)
        if (_params) {
            return service.get(`${url}${_params}`)
        } else {
            return service.get(url)
        }
    },
    //parm => {id:10}
    // http://localhost:8089/api/user/10
    delete(url, params) {
        let _params
        if (Object.is(params, undefined || null)) {
            _params = ''
        } else {
            _params = '/'
            for (const key in params) {
                // eslint-disable-next-line no-prototype-builtins
                if (params.hasOwnProperty(key) && params[key] !== null && params[key]
                    !== '') {
                    _params += `${params[key]}/`
                }
            }
            //去掉参数最后一位?
            _params = _params.substr(0, _params.length - 1)
        }
        if (_params) {
            return service.delete(`${url}${_params}`).catch(err => {
                return Promise.reject(err)
            })
        } else {
            return service.delete(url).catch(err => {
                return Promise.reject(err)
            })
        }
    },
    upload(url, params) {
        return service.post(url, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    login(url, params) {
        return service.post(url, params, {
            transformRequest: [(params) => {
                return qs.stringify(params)
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },
    getImage(url) {
        return service.post(url, null, {
            responseType: 'arraybuffer'
        })
    }
}
export default http
