import request from '@/utils/request'

export function getCodeImg() {
  return request({
    url: 'mate-uaa/auth/code',
    method: 'get',
  })
}

export function getMobileCode(mobile) {
  return request({
    url: 'mate-uaa/auth/sms-code',
    method: 'get',
    params: {
      mobile,
    },
  })
}
