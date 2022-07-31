<template>
  <div>Home</div>
  <div>
    <button @click="login">Login</button>
    <button @click="getInfo">GetInfo</button>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import { onMounted } from "vue"
onMounted(() => {
  console.log("before login | user state =>", store.state.user)
})
const router = useRouter()
const store = useStore()
const login = async () => {
  await store.dispatch("user/login", { username: "admin", password: "1234" })
  console.log("after login | user state =>", store.state.user)
}
const getInfo = async () => {
  const data = await store.dispatch("user/getInfo")
  console.log("after getInfo | user info =>", data)
  console.log("after getInfo | user state =>", store.state.user)
}
const logout = async () => {
  await store.dispatch("user/logout")
  console.log("after logout | user state =>", store.state.user)
  console.log("after logout | router routes =>", router.getRoutes())
  console.log("after logout | permission state =>", store.state.permission.routes)
}
</script>
