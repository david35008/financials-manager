<template>
  <v-container v-if="readyToRender">
    <h1>כלל ההשקעות</h1>
    <InvestmentTable :items-data="itemsData" :add-row="() => {}" />
  </v-container>
</template>

<script>
import InvestmentTable from "@/components/InvestmentTable";
import { mapGetters, mapActions } from "vuex";

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
    ...mapActions(["setTabelsConfig"]),
    async fetchAllInvestments() {
      const { data } = await this.$network.get(this.rootURL + `/investment/`);
      const formatedItems = this.formatItems(data);
      this.itemsData = formatedItems;
    },
    async fetchData() {
      this.resetData();
      await this.fetchAllInvestments();
      this.readyToRender = true;
    },
  },
};
</script>

<style scoped>
.totalInvestMents {
  font-size: 30px;
}
</style>
