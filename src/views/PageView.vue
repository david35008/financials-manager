<template>
  <v-container>
    <h1>{{ title }}</h1>
    <v-data-table
      dense
      :headers="headersData"
      :items="itemsData"
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
    readyToRender: false,
    itemsData: [
      {
        name: "KitKat",
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        iron: "6%",
      },
    ],
    headersData: [
      {
        text: "Dessert (100g serving)",
        align: "start",
        sortable: false,
        value: "name",
      },
    ],
  }),
  async created() {
    await this.fetchData();
  },
  computed: {
    routeName() {
      const reveresedConfig = this.reverseDict(routesData);
      const thaName = reveresedConfig[`/${this.$route.params.id}`];
      return thaName;
    },
    title() {
      return `Page ${this.routeName}`;
    },
  },
  watch: {
    async routeName() {
      await this.fetchData();
    },
  },
  methods: {
    async initTable() {
      try {
        await this.$network.post(this.rootURL + "/table", {
          tableName: this.routeName,
        });
        this.readyToRender = true;
        return true;
      } catch (error) {
        alert("DataBase Error");
        console.error(error);
        return false;
      }
    },
    async fetchData() {
      try {
        await this.$network.get(this.rootURL + `/table/${this.routeName}`);
        this.readyToRender = true;
      } catch (error) {
        console.error(error);
        await this.initTable();
      }
    },
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
