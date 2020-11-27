import request from '@/utils/request'

export function getApiList(search) {
  return request({
    url: '/mate-system/api/page',
    method: 'get',
    params: {
      current: search.current,
      size: search.size,
      keyword: search.keyword,
      startDate: search.startDate,
      endDate: search.endDate,
      serviceId: search.serviceId,
    },
  })
}

export function getApiById(id) {
  return request({
    url: '/mate-system/api/get',
    method: 'get',
    params: {
      id: id,
    },
  })
}

export function saveOrUpdateApi(data) {
  return request({
    url: '/mate-system/api/set',
    method: 'post',
    data: data,
  })
}

export function deleteApi(ids) {
  return request({
    url: '/mate-system/api/del',
    method: 'post',
    params: {
      ids: ids,
    },
  })
}

export function statusApi(ids, status) {
  return request({
    url: '/mate-system/api/set-status',
    method: 'post',
    params: {
      ids: ids,
      status: status,
    },
  })
}

export function syncApi() {
  return request({
    url: '/mate-system/api/sync',
    method: 'post',
  })
}
