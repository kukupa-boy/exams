import { asyncRoutes, constantRoutes } from '@/router'
// import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function changeRoles(route, serverRoute, newRoles) {
  if (serverRoute && route && route.name === serverRoute.name) {
    if (route.meta && route.meta.roles) {
      route.meta.roles = newRoles
    }
    if (route.children && route.children.length > 0) {
      const children = []
      route.children.forEach(child => {
        if (child.meta && child.meta.roles && serverRoute.children) {
          serverRoute.children.forEach(serverChild => {
            child = changeRoles(child, serverChild, newRoles)
          })
        }
        children.push(child)
      })
      route.children = children
    }
  }
  return route
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, serverRoutes, roles) {
  const res = []
  routes.forEach(route => {
    let tmp = { ...route }
    if (serverRoutes) {
      serverRoutes.forEach(serverRoute => {
        tmp = changeRoles(tmp, serverRoute, roles)
      })
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, null, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, rolesData) {
    return new Promise(resolve => {
      const roles = rolesData.roles
      const serverRoutes = rolesData.serverRoutes
      let accessedRoutes = []
      // accessedRoutes[0].meta.roles = ['client']
      // const map = {
      //   productList: () => import('@/views/product/productListTable')// 异步的方式
      // }
      // const serviceMap = [
      //   { path: '/products', subpath: 'productList', name: 'products', component: '@/views/product/productListTable', hidden: true }
      // ]
      // accessedRoutes.push({
      //   path: serviceMap[0].path,
      //   component: Layout,
      //   name: serviceMap[0].name,
      //   children: [
      //     {
      //       path: serviceMap[0].subpath,
      //       component: map[serviceMap[0].name],
      //       meta: { title: 'affiliateList', icon: 'peoples', noCache: true }
      //     }
      //   ]
      // })
      // const res = []
      // asyncRoutes.forEach(route => {
      //   accessedRoutes.forEach(serverRoute => {
      //     if (route.name === serverRoute.name) {
      //       route.meta.roles = ['client']
      //     }
      //   })
      //   res.push(route)
      // })
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, serverRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
