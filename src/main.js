import { createApp } from "vue"
import App from "@/App"
import router from "@/router"
import store from "@/store"

import SvgIcon from "@/components/SvgIcon"
import "@/assets/svg"

createApp(App).use(store).use(router).component("SvgIcon", SvgIcon).mount("#app")
