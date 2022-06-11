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

router.beforeEach(async (to, from, next) => {
  if (to.path === from.path) {
    console.log('same address not redirect');
    return
  }
  return next();
});


export default router