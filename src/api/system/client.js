import request from "@/utils/request";

export function getClientList(search) {
  return request({
    url: '/mate-system/sys-client/list',
    method: 'get',
    params: {
      current: search.current,
      size: search.size,
      keyword: search.keyword,
      startDate: search.startDate,
      endDate: search.endDate
    }
  })
}

export function statusClient(ids, status) {
  return request({
    url: '/mate-system/sys-client/status',
    method: 'post',
    params: {
      ids: ids,
      status: status
    }
  })
}

export function deleteClient(ids) {
  return request({
    url: '/mate-system/sys-client/delete',
    method: 'post',
    params: {
      ids: ids
    }
  })
}

export function getClientById(id) {
  return request({
    url: '/mate-system/sys-client/info',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function saveOrUpdateClient(data) {
  return request({
    url: '/mate-system/sys-client/save-or-update',
    method: 'post',
    data: data
  })
}

export function exportClient() {
  return request({
    url: '/mate-system/sys-client/export-client',
    method: 'post',
    responseType: 'blob'
  })
}
