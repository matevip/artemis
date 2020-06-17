import request from '@/utils/request'
import mate from "@/config/mate"

export function login(data) {
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
      grant_type: 'password',
      scope: 'all'
      // type
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/mate-uaa/auth/userInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/mate-uaa/auth/logout',
    method: 'post'
  })
}
