import { createWebHistory, createRouter } from "vue-router"
import Home from './views/Home.vue'
import OAuth2Callback from "./views/OAuth2Callback.vue"

const routes = [
    { path: '/', component: Home },
    { path: '/oauth2callback', component: OAuth2Callback },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
