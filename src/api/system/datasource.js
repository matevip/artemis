import request from "@/utils/request";

export function getList(search) {
  return request({
    url: '/mate-code/sys-data-source/list',
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

export function getDataSourceById(id) {
  return request({
    url: '/mate-code/sys-data-source/info',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function saveOrUpdateDataSource(data) {
  return request({
    url: '/mate-code/sys-data-source/saveOrUpdate',
    method: 'post',
    data: data
  })
}

export function deleteDataSource(ids) {
  return request({
    url: '/mate-code/sys-data-source/delete',
    method: 'post',
    params: {
      ids: ids
    }
  })
}
