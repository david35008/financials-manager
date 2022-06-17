import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import PageView from '../views/PageView.vue'
import NotFoundPage from '../views/404.vue'

Vue.use(VueRouter)

const DEFAULT_TITLE = 'Financials Manager'

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

router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    const routeParam = to.params.id;
    const param = routeParam ? " #" + routeParam : "";
    const metaTitle = to.meta ? to.meta.title : undefined;
    const title = metaTitle;
    document.title = DEFAULT_TITLE + "  |  " + title + param;
  });
});

export default router