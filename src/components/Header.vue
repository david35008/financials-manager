<template>
  <v-card class="overflow-hidden">
    <v-app-bar
      app
      color="#6A76AB"
      dark
      prominent
      src="https://picsum.photos/1920/1080?random"
      fade-img-on-scroll
      scroll-target="#scrolling-techniques-4"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <!--the hamburger option-->
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

      <v-toolbar-title class="header-title">ההשקעות שלי</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on, tabelsConfig }">
          <v-btn color="transport" v-bind="tabelsConfig" v-on="on">
            אפשרויות
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(path, name) in managePages"
            :key="'option' + path"
            @click="goTo(path)"
          >
            <v-list-item-title>{{ name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <template v-slot:extension>
        <v-tabs optional right :value="indexOfTab($route.path)">
          <v-tabs-slider></v-tabs-slider>
          <v-tab
            v-for="tab in tabs"
            :key="'tab' + tab.path"
            :id="'tab' + tab.path"
            @click="goTo(`/${tab.path}`)"
          >
            {{ tab.name }}</v-tab
          >
        </v-tabs>
      </template>
    </v-app-bar>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Header-Comp",
  data: () => ({
    readyToRender: false,
    pages: "FFFFFF",
    managePages: {
      "ניהול משקיעים": "manageInvestors",
      "ניהול סוגי השקעה": "manageInvestmentTypes",
      "ניהול בתי השקעה": "manageInvestmentInstitutes",
      "ניהול מסלולי השקעה": "manageInvestmentRoutes",
      "ניהול מטבעות": "manageCoins",
      "ניהול מדינות": "manageCountries",
    },
  }),
  computed: {
    ...mapGetters(["tabelsConfig"]),
    tabs() {
     const respTabs = []
     for (const [path, dict] of Object.entries(this.tabelsConfig)) {
       respTabs.push({...dict, path})
     }
     return respTabs
    }
  },
  methods: {
    ...mapActions(["setTabelsConfig"]),
    indexOfTab(tabPath) {
      const tabTOSearch = tabPath.replace('/', '')
      const tabsIterate = this.tabs
      for (let i = 0; i < tabsIterate.length; i++) {
        if(tabsIterate[i].path == tabTOSearch) {
          return i
        }
      }
    },
    async goTo(path) {
      if (this.$router.history.current.path === path) return;
      await this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.header-title {
  width: 100%;
  text-align: right;
}
</style>