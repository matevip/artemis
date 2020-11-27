import request from '@/utils/request'

export function getBlackListList(search) {
  return request({
    url: '/mate-system/blacklist/page',
    method: 'get',
    params: {
      current: search.current,
      size: search.size,
      keyword: search.keyword,
      startDate: search.startDate,
      endDate: search.endDate,
    },
  })
}

export function getBlacklistById(id) {
  return request({
    url: '/mate-system/blacklist/get',
    method: 'get',
    params: {
      id: id,
    },
  })
}

export function saveOrUpdateBlacklist(data) {
  return request({
    url: '/mate-system/blacklist/set',
    method: 'post',
    data: data,
  })
}

export function deleteBlacklist(ids) {
  return request({
    url: '/mate-system/blacklist/del',
    method: 'post',
    params: {
      ids: ids,
    },
  })
}

export function statusBlacklist(ids, status) {
  return request({
    url: '/mate-system/blacklist/set-status',
    method: 'post',
    params: {
      ids: ids,
      status: status,
    },
  })
}
