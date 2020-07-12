import request from "@/utils/request";

export function getList(search) {
  return request({
    url: '/mate-system/sys-user/list',
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
    url: '/mate-system/sys-user/status',
    method: 'post',
    params: {
      ids: ids,
      status: status
    }
  })
}

export function deleteUser(ids) {
  return request({
    url: '/mate-system/sys-user/delete',
    method: 'post',
    params: {
      ids: ids
    }
  })
}

export function getUserById(id) {
  return request({
    url: '/mate-system/sys-user/info',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function saveOrUpdateUser(data) {
  return request({
    url: '/mate-system/sys-user/saveOrUpdate',
    method: 'post',
    data: data
  })
}

export function savePwdUser(data) {
  return request({
    url: '/mate-system/sys-user/savePwd',
    method: 'post',
    params: {
      id: data.id,
      password: data.password
    }
  })
}

export function exportUser() {
  return request({
    url: '/mate-system/sys-user/exportUser',
    method: 'get',
    responseType: 'blob'
  })

}
