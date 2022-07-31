import { createStore } from "vuex"
import getters from "@/store/getters"

// https://webpack.js.org/guides/dependency-management/#requirecontext
const context = require.context("./modules", true, /\.js$/)

const modules = context.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1")
  modules[moduleName] = context(modulePath).default
  return modules
}, {})

export default createStore({
  modules,
  getters,
})
