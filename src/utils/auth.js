import Cookies from 'js-cookie'

const TokenKey = 'mate_cloud_vue_token'

const TenantKey = 'mate_cloud_vue_tenant'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTenantId() {
  return Cookies.get(TenantKey)
}

export function setTenantId(tenantId) {
  return Cookies.set(TenantKey, tenantId)
}

export function removeTenantId() {
  return Cookies.remove(TenantKey)
}
