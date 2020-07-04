import {login, logout, getInfo} from '@/api/user'
import {getRoutes} from "@/api/system/menu"
import {setToken, setRefreshToken, removeToken, getToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import {setStore} from "@/utils/store"
import mate from '@/config/mate'
import {isURL, validatenull} from '@/utils/validate'
import md5 from 'js-md5'
import {deepClone} from "@/utils/util"

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    permissions: [],
    roles: []
  }
}

function addPath(ele, first) {
  const menu = mate.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (!isChild) ele[propsDefault.children] = [];
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children].forEach(child => {
      addPath(child);
    })
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
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
    setStore({name: 'menu', content: state.menu, type: 'session'})
  },
  SET_PERMISSIONS:(state,permissions) => {
    state.permissions = permissions
  },
  SET_ROLES:(state,roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password, code, key} = userInfo
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: md5(password), code: code, key: key}).then(response => {
        const {data} = response
        console.log(data)
        commit('SET_TOKEN', data.access_token)
        // commit('SET_NAME', data.userName)
        // commit('SET_AVATAR', data.avatar)
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
  //获取系统菜单
  // GetMenu({commit, dispatch}, topMenuId) {
  //   return new Promise(resolve => {
  //     getRoutes(topMenuId).then((res) => {
  //       const data = res.data
  //       let menu = deepClone(data);
  //       menu.forEach(ele => {
  //         addPath(ele, true);
  //       });
  //       console.log(menu)
  //       commit('SET_MENU', menu)
  //       // dispatch('GetButtons');
  //       resolve(menu)
  //     })
  //   })
  // },
  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {data} = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const {userName, avatar, roleId, permissions} = data
        commit('SET_NAME', userName)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES',roleId)
        commit('SET_PERMISSIONS',permissions)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('RESET_STATE')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ROLES',[])
        commit('SET_PERMISSIONS',[])
        removeToken() // must remove  token  first
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

// remove token
  resetToken({commit}) {
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

