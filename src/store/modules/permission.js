import { constantRoutes, asyncRoutes } from "@/router"

function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role)
  }
  return true
}

export function filterAsyncRoutes(routes, role) {
  const ret = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(role, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role)
      }
      ret.push(tmp)
    }
  })

  return ret
}

const state = {
  routes: [],
}

const mutations = {
  SET_ROUTES: (state, asyncRoutes) => {
    state.routes = constantRoutes.concat(asyncRoutes)
  },
}

const actions = {
  generateRoutes({ commit }, role) {
    const accessRoutes = filterAsyncRoutes(asyncRoutes, role)
    commit("SET_ROUTES", accessRoutes)
    return accessRoutes
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
