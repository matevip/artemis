import request from '@/utils/request'

export function getList(search) {
  return request({
    url: '/mate-system/depart/list',
    method: 'get',
    params: {
      keyword: search.keyword,
      startDate: search.startDate,
      endDate: search.endDate,
    },
  })
}

export function getTree() {
  return request({
    url: '/mate-system/depart/tree',
    method: 'get',
  })
}

export function saveOrUpdateUser(data) {
  return request({
    url: '/mate-system/depart/set',
    method: 'post',
    data: data,
  })
}

export function getDepartById(id) {
  return request({
    url: '/mate-system/depart/get',
    method: 'get',
    params: {
      id,
    },
  })
}

export function deleteDepart(ids) {
  return request({
    url: '/mate-system/depart/del',
    method: 'post',
    params: {
      ids,
    },
  })
}

export function exportDepart() {
  return request({
    url: '/mate-system/depart/export',
    method: 'post',
    responseType: 'blob',
  })
}
