import request from "@/utils/request";

/**
 * 获取字典列表
 * @param code
 * @return {AxiosPromise}
 */
export function getDictCodeList(code) {
  return request({
    url: '/mate-system/sys-dict/list-code',
    method: 'get',
    params: {
      code
    }
  })
}

/**
 * 获取字典值
 * @param code
 * @param dictKey
 * @return {AxiosPromise}
 */
export function getDictValue(code, dictKey) {
  return request({
    url: '/mate-system/sys-dict/get-dict-value',
    method: 'get',
    params: {
      code,
      dictKey
    }
  })
}

export function getDictList(search) {
  return request({
    url: '/mate-system/sys-dict/list',
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

export function getDictListValue(code) {
  return request({
    url: '/mate-system/sys-dict/list-value',
    method: 'get',
    params: {
     code
    }
  })
}

export function saveOrUpdateDict(data) {
  return request({
    url: '/mate-system/sys-dict/save-or-update',
    method: 'post',
    data: data
  })
}

export function deleteDict(ids) {
  return request({
    url: '/mate-system/sys-dict/delete',
    method: 'post',
    params: {
      ids: ids
    }
  })
}

export function getDictById(id) {
  return request({
    url: '/mate-system/sys-dict/info',
    method: 'get',
    params: {
      id: id
    }
  })
}
