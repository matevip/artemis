import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import {Base64} from 'js-base64'
import mate from "@/config/mate"
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const meta = (config.meta || {});
    const isToken = meta.isToken === false;
    config.headers['Authorization'] = `Basic ${Base64.encode(`${mate.clientId}:${mate.clientSecret}`)}`;
    if (getToken() && !isToken) {
      //让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
      config.headers['Mate-Auth'] = 'bearer ' + getToken()
    }
    //headers中配置serialize为true开启序列化
    // if (config.method === 'post' && meta.isSerialize === true) {
    //   config.data = serialize(config.data);
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 5000 || res.code === 4001 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    // if(error.response.status === 401){
    //   store.dispatch('user/logout').then(()=>{
    //     router.replace({
    //       path: '/login',
    //       query:{redirect:router.currentRoute.path}
    //     })
    //   })
    //   return
    // }
    Message({
      message: error.response.data.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error )
  }
)

export default service
