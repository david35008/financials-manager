<template>
  <v-container v-if="readyToRender">
    <div class="totalInvestMents">
      <span>סכום כולל: </span>
      <span>{{ investmentsMoneySum | currency }}</span>
    </div>
    <h1>סה"כ השקעות</h1>
    <InvestmentTable :items-data="itemsData" :add-row="() => {}" />
  </v-container>
</template>

<script>
import InvestmentTable from "@/views/InvestmentTable";
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
    investmentsMoneySum: 0,
  }),
  methods: {
    ...mapActions(["setTabelsConfig"]),
    async fetchAllInvestments() {
      try {
        const { data } = await this.$network.get(this.rootURL + `/investment/`);
        const formatedItems = this.formatItems(data);
        this.itemsData = formatedItems;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchInvestmentsSum() {
      try {
        const { data } = await this.$network.get(
          this.rootURL + `/investment/money-sum`
        );
        this.investmentsMoneySum = data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchData() {
      this.resetData();
      await this.fetchAllInvestments();
      await this.fetchInvestmentsSum();
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
