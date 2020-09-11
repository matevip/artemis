import request from '@/utils/request'
import mate from "@/config/mate"

export function loginByUserName(data) {
  return request({
    url: '/mate-uaa/oauth/token',
    method: 'post',
    // data,
    headers: {
      'key': data.key,
      'code': data.code,
    },
    params: {
      username: data.username,
      password: data.password,
      grant_type: 'captcha',
      scope: 'all'
      // type
    }
  })
}

export function loginByMobile(data) {
  return request({
    url: '/mate-uaa/oauth/token',
    method: 'post',
    params: {
      mobile: data.mobile,
      code: data.code,
      grant_type: 'sms',
      scope: 'all'
      // type
    }
  })
}

export function loginBySocialApi(data) {
  return request({
    url: '/mate-uaa/oauth/token',
    method: 'post',
    params: {
      code: data.code,
      state: data.state,
      grant_type: 'social',
      scope: 'all'
      // type
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/mate-uaa/auth/get/user',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/mate-uaa/auth/logout',
    method: 'post'
  })
}
