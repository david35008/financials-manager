<template>
  <v-container class="container" v-if="readyToRender">
    <investment-form-dialog
      :dialog="createDialog"
      @submitEntity="submitCreateEntity"
      @closeModal="createDialog = false"
    />
    <investment-form-dialog
      :dialog="editDialog"
      @submitEntity="submitEditEntity"
      @closeModal="editDialog = false"
      :entity-to-edit="editEntity"
    />
    <v-dialog :value="deleteDialog" persistent max-width="500">
      <v-card>
        <v-card-text
          >? "האם אתה בטוח שברצונך למחוק את השקעה מספר "{{
            deleteEntity.id
          }}</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDialog = false"
            >ביטול</v-btn
          >
          <v-btn color="red darken-1" text @click="submitDeleteEntity"
            >אישור</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-divider />
    <v-spacer />
    <v-row class="start-page">
      <v-col md="3">
        <amountCard
          :card-amounts="investmentSum"
          :card-title="'סך הכספים בבית השקעה'"
        />
      </v-col>
      <v-col md="1"></v-col>
      <v-col md="4">
        <h1>{{ title }}</h1>
      </v-col>
      <v-col md="1"></v-col>
      <v-col md="1"> </v-col>
    </v-row>
    <investment-table
      :add-row="addRow"
      :items-data="itemsData"
      :button="{ text: 'הוסף השקעה' }"
      :extra-headers="extraHeaders"
      :table-buttons="tableButtons"
      @editRow="editRow"
      @deleteRow="deleteRow"
    />
  </v-container>
  <global-loader v-else />
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import investmentFormDialog from "../components/generic/modals/InvestmentFormDialog.vue";
import InvestmentTable from "@/components/InvestmentTable";
import AmountCard from "@/views/AmountCard";

export default {
  name: "Page-View",
  components: {
    AmountCard,
    InvestmentTable,
    investmentFormDialog,
  },
  data: () => ({
    createDialog: false,
    editDialog: false,
    deleteDialog: false,
    editEntity: {},
    deleteEntity: {},
    readyToRender: false,
    itemsData: null,
    investmentSum: null,
    apiRoute: "investment",
    extraHeaders: [
      {
        value: "actions",
        sortable: false,
      },
    ],
    tableButtons: [
      {
        text: "mdi-trash-can",
        eventName: "deleteRow",
        color: "red",
        tooltip: "מחיקה",
      },
      {
        text: "mdi-pencil",
        eventName: "editRow",
        color: "green",
        tooltip: "עריכה",
      },
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
    ...mapActions(["setTabelsConfig"]),
    addRow() {
      this.createDialog = true;
    },
    async editRow(data) {
      this.editEntity = data;
      this.editDialog = true;
    },
    async deleteRow(data) {
      this.deleteEntity = data;
      this.deleteDialog = true;
    },
    async fetchInvestments() {
      const { data } = await this.$network.get(
        this.rootURL + `/investment/by-institute/${this.$route.params.id}`
      );
      this.itemsData = this.formatItems(data);
    },
    async fetchSumData() {
      const { data } = await this.$network.get(
        this.rootURL + `/investment/sum-by-institute/${this.$route.params.id}`
      );
      this.investmentSum = data;
    },
    async fetchData() {
      this.resetData();
      await this.fetchInvestments();
      await this.fetchSumData();
      this.readyToRender = true;
    },
    async submitCreateEntity(newEntity) {
      if (!newEntity) {
        this.createDialog = false;
        return;
      }
      await this.$network.post(this.rootURL + `/${this.apiRoute}`, newEntity);
      await this.fetchData();
      this.newEntity = {};
      this.createDialog = false;
    },
    async submitEditEntity(editedEntity) {
      if (!editedEntity) {
        this.editDialog = false;
        return;
      }
      await this.$network.put(
        this.rootURL + `/${this.apiRoute}/${this.editEntity.id}`,
        editedEntity
      );
      this.editDialog = false;
      this.editEntity = {};
      await this.fetchData();
    },
    async submitDeleteEntity() {
      if (!this.deleteEntity) {
        this.deleteDialog = false;
        return;
      }
      await this.$network.delete(
        this.rootURL + `/${this.apiRoute}/${this.deleteEntity.id}`
      );
      this.deleteDialog = false;
      this.deleteEntity = {};
      await this.fetchData();
    },
  },
};
</script>

<style scoped>
.start-page {
  margin-top: 1%;
}
</style>
