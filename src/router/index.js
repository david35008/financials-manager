import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/DashboardView.vue'
import AllInvestMents from '../views/AllInvestMentsView.vue'
import InvestmentInstitutePageView from '../views/InvestmentInstitutePageView.vue'
import ManageView from '../views/ManegeView.vue'
import NotFoundPage from '../views/404View.vue'

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
    path: '/0',
    name: 'Home0',
    component: Dashboard,
    meta: { isPublic: true, title: "DashBoard" },
  },
  {
    path: '/index.html',
    name: 'Home-index-html',
    component: Dashboard,
    meta: { isPublic: true, title: "DashBoard" },
  },
  {
    path: '/allInvestments',
    name: 'All Investments',
    component: AllInvestMents,
    meta: { isPublic: true, title: "All Investments" },
  },
  {
    path: '/manageInvestors',
    name: 'Manage Investors',
    props: { managetitle: "משקיע", apiRoute: "investor" },
    component: ManageView,
    meta: { isPublic: true, title: "Manage Investors" },
  },
  {
    path: '/manageInvestmentTypes',
    name: 'Manage Investment Types',
    props: { managetitle: "סוגי השקעה", apiRoute: "investments-type" },
    component: ManageView,
    meta: { isPublic: true, title: "Manage Investors Types" },
  },
  {
    path: '/manageInvestmentRoutes',
    name: 'Manage Investment Routes',
    props: { managetitle: "מסלולי השקעה", apiRoute: "investments-route" },
    component: ManageView,
    meta: { isPublic: true, title: "Manage Investors Routes" },
  },
  {
    path: '/manageInvestmentInstitutes',
    name: 'Manage Institutes',
    props: { managetitle: "בתי השקעה", apiRoute: "institute", hardReload: true },
    component: ManageView,
    meta: { isPublic: true, title: "Manage Institutes" },
  },
  {
    path: '/manageCountries',
    name: 'Manage Countries',
    props: { managetitle: "מדינות", apiRoute: "country" },
    component: ManageView,
    meta: { isPublic: true, title: "Manage Countries" },
  },
  {
    path: '/manageCoins',
    name: 'Manage Coins',
    props: { managetitle: "מטבעות", apiRoute: "coin", extraFields: [{ key: 'suffix', title: 'סימן המטבעה', required: true }] },
    component: ManageView,
    meta: { isPublic: true, title: "Manage Coins" },
  },
  {
    path: "/:id",
    component: InvestmentInstitutePageView,
    name: 'Investment',
    meta: { isPublic: true, title: "Investments" },
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