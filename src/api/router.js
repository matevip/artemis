import request from '@/utils/request'

export function getRouterList(data) {
  return request({
    url: 'mate-system/menu/tree',
    method: 'get',
    data,
  })
}
