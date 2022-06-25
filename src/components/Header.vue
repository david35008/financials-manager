<template>
  <v-card class="overflow-hidden">
    <v-app-bar
      app
      color="#6A76AB"
      dark
      shrink-on-scroll
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

      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title class="header-title">ריכוז השקעות</v-toolbar-title>

      <v-spacer></v-spacer>
      <!-- 
      <v-btn icon @dblclick="openModalDelete">
        <v-icon>mdi-delete-alert</v-icon>
      </v-btn>

      <v-btn icon @dblclick="openModalNew">
        <v-icon>mdi-folder-plus-outline</v-icon>
      </v-btn> -->

      <v-menu bottom left>
        <template v-slot:activator="{ on, tabelsConfig }">
          <v-btn icon color="yellow" v-bind="tabelsConfig" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
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
        <v-tabs right>
          <v-tab
            v-for="(dict, path) in tabelsConfig"
            :key="'tab' + path"
            :id="'tab' + path"
            @click="goTo(path)"
          >
            {{ dict.name }}</v-tab
          >
        </v-tabs>
      </template>
    </v-app-bar>
    <prompt-modal-add-tab
      :dialog="dialogCreate"
      @closeModal="dialogCreate = false"
    />
    <prompt-modal-delete-tab
      :dialog="dialogDelete"
      @closeModal="dialogDelete = false"
    />
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
    },
  }),
  computed: mapGetters(["tabelsConfig"]),
  methods: {
    ...mapActions(["setTabelsConfig"]),
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