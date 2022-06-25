<template>
 <v-container v-if="readyToRender">
 <h1>סה"כ השקעות</h1>
   <InvestmentTable :items-data="itemsData"/>
 </v-container>
</template>

<script>
import InvestmentTable from "@/views/InvestmentTable";
import {mapGetters} from "vuex";

export default {
  name: "DashBoard-Page",
  components: {
    InvestmentTable,
  },
  async created() {
    await this.fetchData();
  },
  watch: {
    "$route.params": async function () {
      await this.fetchData();
    },
  },
  computed: mapGetters(["tabelsConfig"]),
  data: () => ({
    itemsData: [],
    readyToRender: false,
  }),
  methods: {
    async fetchData() {
      this.resetData();
      try {
        const { data } = await this.$network.get(this.rootURL + `/investment/`);
        const formatedItems = this.formatItems(data);
        this.itemsData = formatedItems;
        this.readyToRender = true;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
</style>
