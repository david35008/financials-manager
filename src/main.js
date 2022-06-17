import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import './prototypes/globalPrototype'

import { ModalService } from "./services/modal.service";

Vue.prototype.$ModalService = ModalService;

Vue.config.productionTip = false

import globalMixin from './mixins/globalMixin'
import store from './store'
Vue.mixin(globalMixin);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
