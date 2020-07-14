import request from "@/utils/request";

export function getList(search) {
  return request({
    url: '/mate-system/sys-depart/list',
    method: 'get',
    params: {
      keyword: search.keyword,
      startDate: search.startDate,
      endDate: search.endDate
    }
  })
}

export function getTree() {
  return request({
    url: '/mate-system/sys-depart/tree',
    method: 'get',
  })
}

export function saveOrUpdateUser(data) {
  return request({
    url: '/mate-system/sys-depart/saveOrUpdate',
    method: 'post',
    data: data
  })
}

export function getDepartById(id) {
  return request({
    url: '/mate-system/sys-depart/info',
    method: 'get',
    params: {
      id
    }
  })
}

export function deleteDepart(ids) {
  return request({
    url: '/mate-system/sys-depart/delete',
    method: 'post',
    params: {
      ids
    }
  })
}

export function exportDepart() {
  return request({
    url: '/mate-system/sys-depart/export-depart',
    method: 'post',
    responseType: 'blob'
  })
}
