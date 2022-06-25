<template>
  <v-container class="container" v-if="readyToRender">
    <formDialog :dialog="dialog" @closeModal="refreshData" />
    <v-divider />
    <v-spacer />
    <h1>{{ title }}</h1>
    <InvestmentTable :add-row="addRow" :items-data="itemsData" />
  </v-container>
  <GlobalLoader v-else />
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import formDialog from "../components/generic/modals/AddInvestmentFormDialog.vue";
import InvestmentTable from "@/views/InvestmentTable";

export default {
  name: "Page-View",
  components: {
    InvestmentTable,
    formDialog,
  },
  data: () => ({
    dialog: false,
    readyToRender: false,
    itemsData: null,
  }),
  async created() {
    await this.fetchData();
  },
  computed: mapGetters(["tabelsConfig"]),
  watch: {
    "$route.params": async function () {
      await this.fetchData();
    },
  },
  methods: {
    ...mapActions(["setTabelsConfig"]),
    addRow() {
      this.dialog = true;
    },
    async refreshData() {
      await this.fetchData();
      this.dialog = false;
    },
    async fetchData() {
      this.resetData();
      try {
        const { data } = await this.$network.get(
          this.rootURL + `/investment/by-institute/${this.$route.params.id}`
        );
        const formatedItems = this.formatItems(data);
        this.itemsData = formatedItems;
        await this.fetchTableNames();
        this.readyToRender = true;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

