import request from '@/utils/request'

export async function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

export async function refreshToken(refresh_token, tenantId) {
  return request({
    url: '/mate-uaa/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId,
    },
    params: {
      tenantId,
      refresh_token,
      grant_type: 'refresh_token',
      scope: 'all',
    },
  })
}

export async function loginByUsername(data) {
  return request({
    url: '/mate-uaa/oauth/token',
    method: 'post',
    headers: {
      key: data.key,
      code: data.code,
    },
    params: {
      username: data.username,
      password: data.password,
      grant_type: 'captcha',
      scope: 'all',
    },
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
      scope: 'all',
    },
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
      scope: 'all',
    },
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
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
