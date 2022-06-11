<template>
  <div id="app">
    <Header v-if="readyToRender" />
    <v-main>
      <router-view v-if="readyToRender" />
      <GlobalLoader v-else />
    </v-main>
  </div>
</template>

<script>
import Header from "./components/Header";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: { Header },
  data: () => ({
    readyToRender: false,
  }),
  async created() {
    await this.fetchTableNames();
  },
  methods: {
    ...mapActions(["setTabelsConfig"]),
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.main-container {
  height: 100vh;
}
.main-router {
  margin-top: 40vh;
}
.header-title {
  text-transform: uppercase;
}
.modal-title {
  text-align: center;
}
</style>
