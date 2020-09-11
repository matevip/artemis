import request from "@/utils/request";

export function getList(search) {
  return request({
    url: '/mate-code/data-source/page',
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
    url: '/mate-code/data-source/get',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function saveOrUpdateDataSource(data) {
  return request({
    url: '/mate-code/data-source/set',
    method: 'post',
    data: data
  })
}

export function deleteDataSource(ids) {
  return request({
    url: '/mate-code/data-source/del',
    method: 'post',
    params: {
      ids: ids
    }
  })
}

export function optionList() {
  return request({
    url: '/mate-code/data-source/option-list',
    method: 'get',
  })
}
