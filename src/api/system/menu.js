import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/mate-system/sys-menu/routes',
    method: 'get',
  })
}

export function getList() {
  return request({
    url: '/mate-system/sys-menu/list',
    method: 'get',
  })
}
