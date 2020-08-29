import request from "@/utils/request";

export function getBlackListList(search) {
    return request({
      url: '/mate-system/sys-blacklist/list',
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

  export function getBlacklistById(id) {
    return request({
      url: '/mate-system/sys-blacklist/info',
      method: 'get',
      params: {
        id: id
      }
    })
  }

  export function saveOrUpdateBlacklist(data) {
    return request({
      url: '/mate-system/sys-blacklist/save-or-update',
      method: 'post',
      data: data
    })
  }

  export function deleteBlacklist(ids) {
    return request({
      url: '/mate-system/sys-blacklist/delete',
      method: 'post',
      params: {
        ids: ids
      }
    })
  }

  export function statusBlacklist(ids, status) {
    return request({
      url: '/mate-system/sys-blacklist/status',
      method: 'post',
      params: {
        ids: ids,
        status: status
      }
    })
  }