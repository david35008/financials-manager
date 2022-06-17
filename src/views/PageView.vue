<template>
  <v-container v-if="readyToRender">
    <formDialog :dialog="dialog" @closeModal="dialog = false" />
    <genericDataTable
      :title="title"
      :headers="headersData"
      :info="itemsData"
      :insert-dialog="true"
      :button="{ text: 'add' }"
      @topButtonClick="addRow"
    />
  </v-container>
  <GlobalLoader v-else />
</template>

<script>
import { mapGetters } from "vuex";
import genericDataTable from "../components/generic/genericDataTable.vue";
import formDialog from "../components/generic/modals/FormDialog.vue";

export default {
  name: "Page-View",
  components: {
    genericDataTable,
     formDialog
  },
  data: () => ({
    dialog: false,
    readyToRender: false,
    itemsData: null,
    headersData: null,
  }),
  async created() {
    await this.fetchData();
  },

  computed: {
    ...mapGetters(["tabelsConfig"]),
    routeName() {
      const reveresedConfig = this.reverseDict(this.tabelsConfig);
      const thaName = reveresedConfig[`/${this.$route.params.id}`];
      return thaName;
    },
    title() {
      return `${this.routeName} Account`;
    },
  },
  watch: {
    async routeName() {
      await this.fetchData();
    },
  },
  methods: {
    addRow() {
      this.dialog = true;
    },
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
      this.resetData();
      try {
        const { data } = await this.$network.get(
          this.rootURL + `/table/${this.routeName}`
        );
        const formatedItems = this.formatItems(data);
        this.itemsData = formatedItems;
        this.headersData = this.formatHeaders(
          Object.keys(formatedItems[0] || {})
        );
        this.readyToRender = true;
      } catch (error) {
        console.error(error);
        await this.initTable();
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
