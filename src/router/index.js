import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Dashboard.vue'
import NotFoundPage from '../views/404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { isPublic: true, title: "DashBoard" },
  },
  {
    path: "*",
    name: "notFound",
    component: NotFoundPage,
    meta: { isPublic: true },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router