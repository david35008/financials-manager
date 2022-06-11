<template>
  <div class="error-page">
    <h1 class="error-number">404</h1>
    <h2 class="error-content-1">This page was not found</h2>
    <div class="error-container-buttons">
      <v-btn
        id="go-back"
        class="ma-2"
        large
        :color="color"
        dark
        @click="goBack"
      >
        Go Back
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "404-Page",
  data: () => ({
    color: "FFFFFF",
  }),
  methods: {
    goBack() {
      // @ts-ignore
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
* {
  outline: none;
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  text-decoration: none;
}

.error-page-logo-container {
  height: 80%;
  margin: 20px;
}
.error-page-logo {
  height: 100%;
}
.error-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgb(236, 236, 236);
}
.error-number {
  font-family: "Anton", sans-serif;
  font-size: 100px;
  color: #000000;
  font-weight: bolder;
  letter-spacing: 10px;
}
.error-content-1 {
  font-size: 30px;
  margin: 10px;
}
.error-content-2 {
  font-size: 16px;
  margin: 10px;
}
.error-img {
  height: 30vh;
}
</style>