<template>
  <v-container>
    <h1>{{ title }}</h1>
    <v-data-table
      dense
      :headers="headers"
      :items="desserts"
      item-key="name"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script>
import { routesData } from "../configs/router-config";

export default {
  name: "Page-View",
  data: () => ({
    desserts: [
      {
        name: "KitKat",
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        iron: "6%",
      },
    ],
    headers: [
      {
        text: "Dessert (100g serving)",
        align: "start",
        sortable: false,
        value: "name",
      },
    ],
  }),
  computed: {
    routeName() {
      const reveresedConfig = this.reverseDict(routesData);
      console.log(reveresedConfig);
      const thaName=reveresedConfig[`/${this.$route.params.id || ''}`];
      console.log(thaName);
      return thaName;
    },
    title() {
      return `Page ${this.routeName}`;
    },
  },

  methods: {
    reverseDict(dict) {
      const reversed = {};
      for (const [key, value] of Object.entries(dict)) {
        reversed[value] = key;
      }
      return reversed;
    },
  },
};
</script>

<style scoped>
</style>
