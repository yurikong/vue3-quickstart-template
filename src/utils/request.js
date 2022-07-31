import axios from "axios"
// import store from "@/store"
// import { getToken } from "@/utils/cookies"
import router from "@/router"

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    // if (store.getters.token) {
    //   // config.headers['X-Token'] = getToken()
    //   config.headers.tokenId = getToken()
    // }
    return config
  },
  (error) => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const { data: res } = response
    if (res.code !== 200) {
      // insert toast here
      return Promise.reject(new Error(res.message || "Error"))
    }
    return res
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      alert(`Error: ${data.msg}`)
      status === 401 && router.push("/401")
      status === 403 && router.push("/403")
    } else {
      alert("Network error.")
    }

    return Promise.reject(error)
  }
)

export default service
