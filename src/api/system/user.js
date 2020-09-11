import request from "@/utils/request";

export function getList(search) {
  return request({
    url: '/mate-system/user/page',
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

export function statusUser(ids, status) {
  return request({
    url: '/mate-system/user/set-status',
    method: 'post',
    params: {
      ids: ids,
      status: status
    }
  })
}

export function deleteUser(ids) {
  return request({
    url: '/mate-system/user/del',
    method: 'post',
    params: {
      ids: ids
    }
  })
}

export function getUserById(id) {
  return request({
    url: '/mate-system/user/get',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function saveOrUpdateUser(data) {
  return request({
    url: '/mate-system/user/set',
    method: 'post',
    data: data
  })
}

export function savePwdUser(data) {
  return request({
    url: '/mate-system/user/set-password',
    method: 'post',
    params: {
      id: data.id,
      password: data.password
    }
  })
}

export function exportUser() {
  return request({
    url: '/mate-system/user/export',
    method: 'post',
    responseType: 'blob'
  })
}
