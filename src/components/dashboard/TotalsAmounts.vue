<template>
  <v-card
      class="mx-auto"
      max-width="344"
      outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-h6 mb-4">
          {{titleComp}}
        </div>
        <v-list-item-title class="text-h5 mb-1">
          {{ investmentsMoneySum | currency }} {{suffix}}
        </v-list-item-title>

      </v-list-item-content>

    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TotalsAmounts",
  props: {
    apiRoute: {},
    titleComp: {},
    suffix: {},
  },
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
      const { data } = await this.$network.get(this.rootURL + this.apiRoute);
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
<style lang="scss" scoped>

</style>