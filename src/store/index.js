import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tabelsConfig: {}
  },
  getters: {
    tabelsConfig: state => state.tabelsConfig,
  },
  mutations: {
    setTabelsConfig: (state, data) => {
      state.tabelsConfig = data;
    },
  },
  actions: {
    setTabelsConfig({ commit }, data) {
      commit("setTabelsConfig", data);
    },
  },
  modules: {
  }
})
