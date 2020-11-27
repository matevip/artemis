import request from '@/utils/request'

export function getConfigByCode(code) {
  return request({
    url: '/mate-component/config/get-config-by-code',
    method: 'get',
    params: {
      code,
    },
  })
}

export function saveConfigOss(data) {
  return request({
    url: '/mate-component/config/save-config-oss',
    method: 'post',
    data: data,
    params: {
      code: data.code,
    },
  })
}

export function defaultOss() {
  return request({
    url: '/mate-component/config/default-oss',
    method: 'get',
  })
}

export function saveDefaultOss(code) {
  return request({
    url: '/mate-component/config/save-default-oss',
    method: 'post',
    params: {
      code,
    },
  })
}
