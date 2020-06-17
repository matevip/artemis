import { login, logout, getInfo } from '@/api/user'
import {setToken, setRefreshToken, removeToken, getToken} from '@/utils/auth'
import { resetRouter } from '@/router'
import { setStore } from "@/utils/store";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    setToken(token)
    state.token = token
    setStore({name: 'token', content: state.token, type: 'session'})
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    setRefreshToken(refreshToken)
    state.refreshToken = refreshToken;
    setStore({name: 'refreshToken', content: state.refreshToken, type: 'session'})
  },
  SET_TENANT_ID: (state, tenantId) => {
    state.tenantId = tenantId;
    setStore({name: 'tenantId', content: state.tenantId, type: 'session'})
  },
  SET_NAME: (state, name) => {
    state.name = name
    setStore({name: 'name', content: state.name, type: 'session'})
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
    setStore({name: 'avatar', content: state.avatar, type: 'session'})
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, code, key} = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, code: code, key: key }).then(response => {
        const { data } = response
        console.log(data)
        commit('SET_TOKEN', data.access_token)
        commit('SET_NAME', data.userName)
        commit('SET_AVATAR', data.avatar)
        // commit('SET_REFRESH_TOKEN', data.refresh_token);
        // commit('SET_TENANT_ID', data.tenant_id);
        // commit('SET_USER_INFO', data);
        // setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

