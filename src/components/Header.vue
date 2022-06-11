<template>
  <v-card class="overflow-hidden">
    <v-app-bar
      absolute
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

      <v-toolbar-title>Financial Dashboard</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @dblclick="openModalDelete">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon @dblclick="openModalNew">
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-menu bottom left>
        <template v-slot:activator="{ on, tabelsConfig }">
          <v-btn icon color="yellow" v-bind="tabelsConfig" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(path, name) in tabelsConfig"
            :key="'option' + path"
            @click="goTo(path)"
          >
            <v-list-item-title>Page {{ name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <template v-slot:extension>
        <v-tabs align-with-title>
          <v-tab
            v-for="(path, name) in tabelsConfig"
            :key="'option' + path"
            @click="goTo(path)"
          >
            {{ name }}</v-tab
          >
        </v-tabs>
      </template>
    </v-app-bar>
    <v-sheet id="scrolling-techniques-4" class="overflow-y-auto">
      <v-container class="main-container">
        <router-view class="main-router" />
      </v-container>
    </v-sheet>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Header-Comp",
  data: () => ({
    readyToRender: false,
    pages: "FFFFFF",
  }),
  created() {
    console.log(this.tabelsConfig);
  },
  computed: mapGetters(["tabelsConfig"]),
  methods: {
    ...mapActions(["setTabelsConfig"]),
    async openModalNew() {
      const resp = await prompt("Name");
      try {
        await this.$network.post(this.rootURL + "/table", {
          tableName: resp,
        });
        await this.fetchTableNames();
      } catch (error) {
        alert("DataBase Error");
        console.error(error);
      }
    },
    async openModalDelete() {
      const resp = await prompt(
        "You about to delete, entere the desired name:"
      );
      const confirmed = await confirm(
        `Are you sure you want to delete table: "${resp}"???!`
      );
      if (!confirmed) return;
      try {
        await this.$network.delete(this.rootURL + `/table/${resp}`);
        await this.fetchTableNames();
      } catch (error) {
        alert("DataBase Error");
        console.error(error);
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
</style>