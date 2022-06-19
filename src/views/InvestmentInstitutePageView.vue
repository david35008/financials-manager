<template>
  <v-container class="container" v-if="readyToRender">
    <formDialog :dialog="dialog" @closeModal="refreshData" />
    <v-divider />
    <v-spacer />
    <h1>{{ title }}</h1>
    <genericDataTable
      :headers="headers"
      :info="itemsData"
      :insert-dialog="true"
      :button="{ text: 'הוסף השקעה' }"
      @topButtonClick="addRow"
    />
  </v-container>
  <GlobalLoader v-else />
</template>

<script>
import { mapGetters } from "vuex";
import genericDataTable from "../components/generic/genericDataTable.vue";
import formDialog from "../components/generic/modals/AddInvestmentFormDialog.vue";

export default {
  name: "Page-View",
  components: {
    genericDataTable,
    formDialog,
  },
  data: () => ({
    dialog: false,
    readyToRender: false,
    itemsData: null,
    headersData: null,
    headers: [
      {
        text: "שם בעל ההשקעה",
        value: "investor_name",
        align: "left",
        sortable: true,
      },
      {
        text: "בית ההשקעות",
        value: "institute_name",
        align: "left",
        sortable: true,
      },
      {
        text: "סוג ההשקעה",
        value: "investments_type_name",
        align: "left",
        sortable: true,
      },
      {
        text: "סכום",
        value: "amount",
        align: "left",
        sortable: false,
        suffix: "₪",
        type: 'money'
      },
      // { text: "Actions", value: "actions", align: "left", sortable: false },
    ],
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
        this.headersData = this.formatHeaders(
          Object.keys(formatedItems[0] || {})
        );
        this.readyToRender = true;
      } catch (error) {
        console.error(error);
      }
    },
    resetData() {
      this.readyToRender = false;
      this.itemsData = null;
      this.headersData = null;
    },
    formatItems(itemsDict) {
      const itemsList = [];
      for (const [key, value] of Object.entries(itemsDict)) {
        itemsList.push({ id: key, ...value });
      }
      return itemsList;
    },
    formatHeaders(names) {
      return names
        .map((a) => {
          if (a == "id") return;
          return {
            text: a,
            align: "start",
            sortable: true,
            value: a,
          };
        })
        .filter((a) => !!a);
    },
  },
};
</script>

<style scoped>
</style>
