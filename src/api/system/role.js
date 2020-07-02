import request from "@/utils/request";

export function getList(search) {
  return request({
    url: '/mate-system/sys-role/list',
    method: 'get',
    params: {
      keyword: search.keyword,
      startDate: search.startDate,
      endDate: search.endDate
    }
  })
}

export function saveOrUpdateRole(data) {
  return request({
    url: '/mate-system/sys-role/saveOrUpdate',
    method: 'post',
    data: data
  })
}

export function getRoleById(id) {
  return request({
    url: '/mate-system/sys-role/info',
    method: 'get',
    params: {
      id
    }
  })
}


export function deleteRole(ids) {
  return request({
    url: '/mate-system/sys-role/delete',
    method: 'post',
    params: {
      ids: ids
    }
  })
}

export function getPriv(id) {
  return request({
    url: '/mate-system/sys-role/getPermission',
    method: 'get',
    params: {
      id
    }
  })
}

export function savePriv(roleId, ids) {
  return request({
    url: '/mate-system/sys-role/savePermission',
    method: 'post',
    params: {
      roleId,
      ids
    }
  })
}

