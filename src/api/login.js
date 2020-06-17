import request from '@/utils/request'

export function getCodeImg() {
  return request({
    url: 'mate-uaa/auth/code',
    method: 'get'
  })
}
