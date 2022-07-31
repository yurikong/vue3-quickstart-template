import { login, logout, getInfo } from "@/api/user"
import { resetRouter } from "@/router"
import { getToken, removeToken, setToken } from "@/utils/cookies"

const state = {
  token: getToken(),
  username: "",
  password: "",
  role: "",
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  RESET_STATE: (state) => {
    state.token = getToken()
    state.username = ""
    state.password = ""
    state.role = ""
  },
}

const actions = {
  async login({ commit }, data) {
    try {
      const { data: token } = await login(data)
      commit("SET_TOKEN", token)
      setToken(token)
    } catch (error) {
      return error
    }
  },
  // logout
  async logout({ commit, state }) {
    try {
      await logout({ token: state.token })
      removeToken()
      commit("RESET_STATE")
      commit("permission/SET_ROUTES", [], { root: true })
      // TODO: check if resetRouter works correctly
      resetRouter()
    } catch (error) {
      return error
    }
  },
  // get user info
  async getInfo({ commit, state }) {
    try {
      const { data } = await getInfo({ token: state.token })
      if (!data) {
        throw new Error("Verification failed. Please login again.")
      }
      const { username, password, role } = data
      commit("SET_USERNAME", username)
      commit("SET_PASSWORD", password)
      commit("SET_ROLE", role)
      return data
    } catch (error) {
      return error
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
