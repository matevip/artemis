import request from "@/utils/request";

export function getLogList(search) {
  return request({
    url: '/mate-system/sys-log/list',
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

export function deleteLog(ids) {
  return request({
    url: '/mate-system/sys-log/delete',
    method: 'post',
    params: {
      ids: ids
    }
  })
}

export function exportLog() {
  return request({
    url: '/mate-system/sys-log/export-log',
    method: 'post',
    responseType: 'blob'
  })
}
