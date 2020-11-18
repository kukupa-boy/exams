import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  day: 0,
  name: '',
  avatar: '',
  introduction: '',
  aliyunUserId: '',
  roles: [],
  serverRoutes: [],
  cityIds: [],
  categoryIcons: []
}

const mutations = {
  SET_TOKEN: (state, token, day) => {
    state.token = token
    state.day = day
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ALIYUNUSERID: (state, userid) => {
    state.aliyunUserId = userid
  },
  SET_ALIYUNREGIONID: (state, regionId) => {
    state.aliyunRegionId = regionId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SERVERROUTES: (state, serverRoutes) => {
    state.serverRoutes = serverRoutes
  },
  SET_CITYIDS: (state, cityIds) => {
    state.cityIds = cityIds
  },
  SET_CATEGORYICONS: (state, icons) => {
    state.categoryIcons = icons
  }
}

const actions = {
  // 用户名登录
  login({ commit }, userInfo) {
    const username = userInfo.username.trim()
    return new Promise((resolve, reject) => {
      login(username, userInfo.password).then(response => {
        const data = response.data
        commit('SET_TOKEN', data.token, userInfo.rememberDay)
        commit('SET_NAME', data.truename)
        commit('SET_AVATAR', data.headImg)
        // commit('SET_INTRODUCTION', data.personalitySignature)
        setToken(data.token, userInfo.rememberDay)
        console.log(data.headImg)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
          reject('error')
        }
        const imageHost = process.env.VUE_APP_BASE_API.replace('api/', '')
        const imageIcons = []
        for (let i = 1; i < 7; ++i) {
          imageIcons.push(imageHost + 'static/images/category_0' + i + '.png')
        }
        commit('SET_CATEGORYICONS', imageIcons)

        const data = response.data
        if (!data.isSuper && data.isSuper !== 1) {
          const roles = []
          console.log(data)
          // data.roles = []
          data.serverRoutes = []
          // 子菜单可能先与父菜单遍历出来，所有分开遍历
          const roleMenuChildrens = []
          for (const role of data.roles) {
            // roleMenus = roleMenus.concat(role.roleMenus)
            roles.push(role.id)
            for (const roleMenu of role.roleMenus) {
              // 父菜单
              if (roleMenu.parentMenuId === 0) {
                // console.log('父菜单')
                let flag = false
                for (const serverRoute of data.serverRoutes) {
                  if (roleMenu.menuId === serverRoute.menuId) {
                    flag = true
                    break
                  }
                }
                if (flag) {
                  continue
                }
                data.serverRoutes.push({
                  menuId: roleMenu.menuId,
                  name: roleMenu.name
                  // children: []
                })
              } else {
                let flag = false
                for (const children of roleMenuChildrens) {
                  if (children.menuId === roleMenu.menuId) {
                    flag = true
                    break
                  }
                }
                if (flag) {
                  continue
                }
                roleMenuChildrens.push({
                  menuId: roleMenu.menuId,
                  name: roleMenu.name,
                  parentMenuId: roleMenu.parentMenuId
                  // children: []
                })
              }
            }
          }
          // 子菜单
          for (const children of roleMenuChildrens) {
            for (const serverRoute of data.serverRoutes) {
              if (children.parentMenuId === serverRoute.menuId) {
                // console.log('子菜单')
                if (!serverRoute.children) {
                  serverRoute.children = []
                }
                // 有就不添加
                var flag = false
                for (const serverRouteChildren of serverRoute.children) {
                  if (children.menuId === serverRouteChildren.menuId) {
                    flag = true
                    break
                  }
                }
                if (flag) {
                  continue
                }
                serverRoute.children.push({
                  menuId: children.menuId,
                  name: children.name
                })
              }
            }
          }
          data.roles = roles
        } else {
          data.roles = ['admin']
        }
        if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', data.roles)
          commit('SET_SERVERROUTES', data.serverRoutes)
        } else {
          reject('当前帐号还未设置角色权限 !')
        }
        let cityIds = []
        if (data.cityIds && data.cityIds.length > 0) {
          cityIds = data.cityIds.split(',')
        }
        commit('SET_CITYIDS', cityIds)
        commit('SET_NAME', data.truename)
        commit('SET_AVATAR', data.httpAvatarUrl)
        commit('SET_ALIYUNUSERID', data.aliyunUserId)
        commit('SET_ALIYUNREGIONID', data.aliyunRegionId)
        // commit('SET_INTRODUCTION', data.personalitySignature)
        data.name = data.truename
        data.avatar = data.httpAvatarUrl
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

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
