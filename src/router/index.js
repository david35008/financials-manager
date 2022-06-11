import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import PageView from '../views/PageView.vue'
import NotFoundPage from '../views/404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Dashboard,
    meta: { isPublic: true, title: "DashBoard" },
  },
  {
    path: "/:id",
    component: PageView,
    name: 'Pag View',
    meta: { isPublic: true, title: "Page View" },
  },
  {
    path: "*",
    name: "Not Found",
    component: NotFoundPage,
    meta: { isPublic: true, title: "Not Found" },
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})


export default router