<template>
 <v-container>
 <h1>סה"כ השקעות</h1>
  <v-data-table
    dense
    :headers="headers"
    :items="items"
    item-key="name"
    class="elevation-1"
  ></v-data-table>
 </v-container>
</template>

<script>

export default {
  name: "DashBoard-Page",
  data: () => ({
    items: [],
    headers: [],
  }),
  computed: {},
  methods: {},
};
</script>

<style scoped>
</style>
