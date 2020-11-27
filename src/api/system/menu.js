import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/mate-system/menu/tree',
    method: 'get',
  })
}

export function getList(search) {
  return request({
    url: '/mate-system/menu/list',
    method: 'get',
    params: {
      keyword: search.keyword,
      startDate: search.startDate,
      endDate: search.endDate,
    },
  })
}

export function getAsyncList() {
  return request({
    url: '/mate-system/menu/grade',
    method: 'get',
  })
}

export function saveOrUpdateMenu(data) {
  return request({
    url: '/mate-system/menu/set',
    method: 'post',
    data: data,
  })
}

export function getSysMenuById(id) {
  return request({
    url: '/mate-system/menu/get',
    method: 'get',
    params: {
      id: id,
    },
  })
}

export function deleteMenu(ids) {
  return request({
    url: '/mate-system/menu/del',
    method: 'post',
    params: {
      ids: ids,
    },
  })
}

export function statusMenu(ids, status) {
  return request({
    url: '/mate-system/menu/set-status',
    method: 'post',
    params: {
      ids: ids,
      status: status,
    },
  })
}

export function exportMenu() {
  return request({
    url: '/mate-system/menu/export',
    method: 'post',
    responseType: 'blob',
  })
}
