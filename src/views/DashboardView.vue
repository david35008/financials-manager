<template>
  <v-container v-if="readyToRender">
    <div class="totalInvestMents">
      <span>סכום כולל: </span>
      <span>{{ investmentsMoneySum | currency }}</span>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DashBoard-Page",
  async created() {
    await this.fetchData();
  },
  computed: mapGetters(["tabelsConfig"]),
  data: () => ({
    readyToRender: false,
    investmentsMoneySum: 0,
  }),
  methods: {
    ...mapActions(["setTabelsConfig"]),
    async fetchInvestmentsSum() {
      const { data } = await this.$network.get(this.rootURL + `/investment/money-sum`);
      this.investmentsMoneySum = data;
    },
    async fetchData() {
      this.resetData();
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
