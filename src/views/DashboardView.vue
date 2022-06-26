<template>
  <v-container v-if="readyToRender">
    <v-row>
      <v-col
          :key="coin.name"
          v-for="(coin, coinId) in coins"
      >
        <totals-amounts

            :api-route="`/investment/sum-by-coin/${coinId}`"
            :title-comp="`סך ההשקעות לפי מטבע ${coin.name}`"
            :suffix="coin.suffix"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TotalsAmounts from "@/components/dashboard/TotalsAmounts";

export default {
  name: "DashBoard-Page",
  components: {TotalsAmounts},
  async created() {
    await this.fetchData();
    console.log(this.coins)
  },
  computed: mapGetters(["tabelsConfig"]),
  data: () => ({
    readyToRender: false,
    coins: [],
  }),
  methods: {
    ...mapActions(["setTabelsConfig"]),
    async fetchCoins() {
      const { data } = await this.$network.get(this.rootURL + `/coin`);
      this.coins = data;
    },
    async fetchData() {
      this.resetData();
      await this.fetchCoins();
      this.readyToRender = true;
    },
  },
};
</script>

<style scoped>
</style>
