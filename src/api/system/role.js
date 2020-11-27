import request from '@/utils/request'

export function getList(search) {
  return request({
    url: '/mate-system/role/list',
    method: 'get',
    params: {
      keyword: search.keyword,
      startDate: search.startDate,
      endDate: search.endDate,
    },
  })
}

export function saveOrUpdateRole(data) {
  return request({
    url: '/mate-system/role/set',
    method: 'post',
    data: data,
  })
}

export function getRoleById(id) {
  return request({
    url: '/mate-system/role/get',
    method: 'get',
    params: {
      id,
    },
  })
}

export function deleteRole(ids) {
  return request({
    url: '/mate-system/role/del',
    method: 'post',
    params: {
      ids: ids,
    },
  })
}

export function getPriv(id) {
  return request({
    url: '/mate-system/role/get-permission',
    method: 'get',
    params: {
      id,
    },
  })
}

export function savePriv(roleId, ids) {
  return request({
    url: '/mate-system/role/set-permission',
    method: 'post',
    params: {
      roleId,
      ids,
    },
  })
}

export function getRoleTree(id) {
  return request({
    url: '/mate-system/role/tree',
    method: 'get',
  })
}

export function exportRole() {
  return request({
    url: '/mate-system/role/export',
    method: 'post',
    responseType: 'blob',
  })
}
