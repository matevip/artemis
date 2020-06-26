import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/mate-system/sys-menu/routes',
    method: 'get',
  })
}

export function getList(search) {
  return request({
    url: '/mate-system/sys-menu/list',
    method: 'get',
    params: {
      keyword: search.keyword,
      startDate: search.startDate,
      endDate: search.endDate
    }
  })
}

export function getAsyncList() {
  return request({
    url: '/mate-system/sys-menu/asyncList',
    method: 'get',
  })
}

export function saveOrUpdateMenu(data) {
  return request({
    url: '/mate-system/sys-menu/saveOrUpdate',
    method: 'post',
    data: data
  })
}

export function getSysMenuById(id) {
  return request({
    url: '/mate-system/sys-menu/info',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function deleteMenu(ids) {
  return request({
    url: '/mate-system/sys-menu/delete',
    method: 'post',
    params: {
      ids: ids
    }
  })
}

export function statusMenu(ids, status) {
  return request({
    url: '/mate-system/sys-menu/status',
    method: 'post',
    params: {
      ids: ids,
      status: status
    }
  })

}

