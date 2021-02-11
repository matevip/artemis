/**
 * @author pangu 7333791@qq.com
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import {
  loginByUsername,
  loginByMobile,
  loginBySocialApi,
  refreshToken,
  getInfo,
  login,
  logout,
} from '@/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import md5 from 'js-md5'
import { resetRouter } from '@/router'
import { title, tokenName } from '@/config'

const state = {
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  permissions: [],
  tenantId: '',
  refreshToken: '',
  dateTime: '',
}
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
  tenantId: (state) => state.tenantId,
  refreshToken: (state) => state.refreshToken || '',
  dateTime: (state) => state.dateTime,
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setTenantId(state, tenantId) {
    state.tenantId = tenantId
  },
  setUsername(state, username) {
    state.username = username
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
  setRefreshToken(state, refreshToken) {
    state.refreshToken = refreshToken
  },
  setDateTime(state) {
    state.dateTime = new Date().getTime()
  },
}
const actions = {
  setPermissions({ commit }, permissions) {
    commit('setPermissions', permissions)
  },
  /**
   * 根据用户名登录
   * @param {*} param0
   * @param {*} userInfo
   */
  async loginByUsername({ commit }, userInfo) {
    const { username, password, code, key } = userInfo
    const { data } = await loginByUsername({
      username: username.trim(),
      password: md5(password),
      code: code,
      key: key,
    })
    const accessToken = data.accessToken
    const tenantId = data.tenantId
    if (accessToken) {
      commit('setAccessToken', accessToken)
      commit('setRefreshToken', data.refreshToken)
      commit('setTenantId', tenantId)
      commit('setDateTime')
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  /**
   * 根据手机号码和验证码登录
   * @param {*} param0
   * @param {*} userInfo
   */
  async loginByMobile({ commit }, userInfo) {
    const { mobile, code } = userInfo

    const { data } = await loginByMobile({
      mobile: mobile,
      code: code,
    })

    const accessToken = data.accessToken
    const tenantId = data.tenantId
    if (accessToken) {
      commit('setAccessToken', accessToken)
      commit('setRefreshToken', data.refreshToken)
      commit('setTenantId', tenantId)
      commit('setDateTime')
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  /**
   * 社交登录
   * @param {*} param0
   * @param {*} userInfo
   */
  loginBySocial({ commit }, userInfo) {
    const { code, state } = userInfo
    return new Promise((resolve, reject) => {
      loginBySocialApi({ state: state, code: code })
        .then((response) => {
          const { data } = response
          // console.log(data)
          commit('setAccessToken', data.accessToken)
          commit('setRefreshToken', data.refreshToken)
          commit('setTenantId', data.tenantId)
          commit('setDateTime')
          const hour = new Date().getHours()
          const thisTime =
            hour < 8
              ? '早上好'
              : hour <= 11
              ? '上午好'
              : hour <= 13
              ? '中午好'
              : hour < 18
              ? '下午好'
              : '晚上好'
          Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  async getUserInfo({ commit, state }) {
    const { data } = await getInfo(state.accessToken)
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
      return false
    }
    let { permissions, userName, avatar, roleId } = data
    if (permissions && userName && Array.isArray(permissions)) {
      commit('setPermissions', permissions)
      commit('setUsername', userName)
      commit('setAvatar', avatar)
      return permissions
    } else {
      Vue.prototype.$baseMessage('用户信息接口异常', 'error')
      return false
    }
  },
  /**
   * 刷新token
   * @param {*} param0
   */
  async refreshToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      refreshToken(state.refreshToken, state.tenantId)
        .then((res) => {
          const data = res.data
          commit('setAccessToken', data.accessToken)
          commit('setTenantId', data.tenantId)
          commit('setRefreshToken', data.refreshToken)
          commit('setDateTime')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  async logout({ dispatch }) {
    await logout(state.accessToken)
    await dispatch('resetAccessToken')
    await resetRouter()
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    removeAccessToken()
  },
}
export default { state, getters, mutations, actions }
