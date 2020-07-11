import request from "@/utils/request";

/**
 * 获取字典列表
 * @param code
 * @return {AxiosPromise}
 */
export function getDictList(code) {
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
