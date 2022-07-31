import { createRouter, createWebHashHistory } from "vue-router"

const constantRoutes = [
  {
    path: "/401",
    name: "401",
    component: () => import(/* webpackChunkName: "401" */ "@/views/error-pages/401"),
    meta: {
      title: "401",
    },
  },
  {
    path: "/403",
    name: "403",
    component: () => import(/* webpackChunkName: "403" */ "@/views/error-pages/403"),
    meta: {
      title: "403",
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "@/views/error-pages/404"),
    meta: {
      title: "404",
    },
  },
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "@/views/Home"),
    meta: {
      title: "Home",
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import(/* webpackChunkName: "about" */ "@/views/About"),
    meta: {
      title: "About",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    meta: {
      title: "NotFound",
    },
  },
]

const asyncRoutes = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import(/* webpackChunkName: "dashboard" */ "@/views/Dashboard"),
    meta: {
      title: "Dashboard",
      roles: ["admin"],
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      }
    }
    return {
      top: 0,
      left: 0,
      behavior: "smooth",
    }
  },
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export { constantRoutes, asyncRoutes, resetRouter }
export default router
