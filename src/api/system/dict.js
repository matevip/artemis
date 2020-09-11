import request from "@/utils/request";

/**
 * 获取字典列表
 * @param code
 * @return {AxiosPromise}
 */
export function getDictCodeList(code) {
  return request({
    url: '/mate-system/dict/list-code',
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
    url: '/mate-system/dict/get-dict-value',
    method: 'get',
    params: {
      code,
      dictKey
    }
  })
}

export function getDictList(search) {
  return request({
    url: '/mate-system/dict/page',
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
    url: '/mate-system/dict/list-value',
    method: 'get',
    params: {
     code
    }
  })
}

export function saveOrUpdateDict(data) {
  return request({
    url: '/mate-system/dict/set',
    method: 'post',
    data: data
  })
}

export function deleteDict(ids) {
  return request({
    url: '/mate-system/dict/del',
    method: 'post',
    params: {
      ids: ids
    }
  })
}

export function getDictById(id) {
  return request({
    url: '/mate-system/dict/get',
    method: 'get',
    params: {
      id: id
    }
  })
}
