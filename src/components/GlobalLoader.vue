<template>
  <v-layout class="loader">
    <v-progress-circular
      :size="100"
      :width="10"
      color="teal "
      indeterminate
    ></v-progress-circular>
  </v-layout>
</template>

<script>
export default {};
</script>

<style scoped>
.loader {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>