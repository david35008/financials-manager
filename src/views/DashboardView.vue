<template>
  <v-container v-if="readyToRender">
    <v-row>
      <v-col :key="coin.name" v-for="(coin, coinId) in coins">
        <totals-amounts
          :api-route="`/investment/sum-by-coin/${coinId}`"
          :title-comp="`סך ההשקעות לפי מטבע ${coin.name}`"
          :suffix="coin.suffix"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <bar-chart
          :data="investmentsByInstitute.data"
          :labels="investmentsByInstitute.labels"
          chart-title="סכום כספים לפי בית השקעה"
        ></bar-chart>
      </v-col>
      <v-col md="4">
        <bar-chart
          :data="investmentsByInvestor.data"
          :labels="investmentsByInvestor.labels"
          chart-title="סכום כספים לפי משקיע"
        ></bar-chart>
      </v-col>
      <v-col md="4">
        <bar-chart
          :data="investmentsByInvestmentTypes.data"
          :labels="investmentsByInvestmentTypes.labels"
          chart-title="סכום כספים לפי סוגי השקעה"
        ></bar-chart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TotalsAmounts from "@/components/dashboard/TotalsAmounts";
import BarChart from "@/components/dashboard/BarChart";

export default {
  name: "DashBoard-Page",
  components: { BarChart, TotalsAmounts },
  async created() {
    await this.fetchData();
  },
  computed: mapGetters(["tabelsConfig"]),
  data: () => ({
    readyToRender: false,
    coins: [],
    investmentsByInstitute: {},
    investmentsByInvestor: {},
    investmentsByInvestmentTypes: {},
  }),
  methods: {
    ...mapActions(["setTabelsConfig"]),
    async fetchCoins() {
      const { data } = await this.$network.get(this.rootURL + `/coin`);
      this.coins = data;
    },
    async fetchInvestmentsByInstitute() {
      const { data } = await this.$network.get(
        this.rootURL + `/investment/by-institute`
      );
      this.investmentsByInstitute = data;
    },
    async fetchInvestmentsByInvestor() {
      const { data } = await this.$network.get(
        this.rootURL + `/investment/by-investor`
      );
      this.investmentsByInvestor = data;
    },
    async fetchInvestmentsByInvestmentTypes() {
      const { data } = await this.$network.get(
        this.rootURL + `/investment/by-investments-type`
      );
      this.investmentsByInvestmentTypes = data;
    },
    async fetchData() {
      this.resetData();
      await this.fetchCoins();
      await this.fetchInvestmentsByInstitute();
      await this.fetchInvestmentsByInvestor();
      await this.fetchInvestmentsByInvestmentTypes();
      this.readyToRender = true;
    },
  },
};
</script>

<style scoped>
</style>
