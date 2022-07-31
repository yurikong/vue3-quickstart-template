import router from "@/router"
import store from "@/store"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import getPageTitle from "@/utils/get-page-title"

NProgress.configure({ showSpinner: false })

const whiteList = ["/login", "/401", "/403", "/404"]

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)

  if (whiteList.includes(to.path) || store.state.user.role) {
    next()
  } else {
    try {
      const { role } = await store.dispatch("user/getInfo")
      const accessRoutes = await store.dispatch("permission/generateRoutes", role)
      accessRoutes.forEach((route) => {
        router.addRoute(route)
      })
      next({ ...to, replace: true })
    } catch (error) {
      console.log(error)
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
