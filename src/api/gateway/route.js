import request from "@/utils/request";

export function getRouteList(search) {
    return request({
      url: '/mate-system/route/page',
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

  export function getRouteById(id) {
    return request({
      url: '/mate-system/route/get',
      method: 'get',
      params: {
        id: id
      }
    })
  }

  export function saveOrUpdateRoute(data) {
    return request({
      url: '/mate-system/route/set',
      method: 'post',
      data: data
    })
  }

  export function deleteRoute(ids) {
    return request({
      url: '/mate-system/api/del',
      method: 'post',
      params: {
        ids: ids
      }
    })
  }
