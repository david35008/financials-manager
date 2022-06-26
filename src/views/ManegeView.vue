<template>
  <v-container class="container" v-if="readyToRender">
    <v-dialog :value="createDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ `הוספת ${managetitle}` }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newEntity"
            :label="`שם ה${managetitle}`"
            required
          />
          <v-text-field
            :key="field.key"
            v-for="field in extraFields"
            v-model="extraFieldsState[field.key]"
            :label="field.title"
            :required="field.required"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancelCreateEntity"> בטל </v-btn>
          <v-btn color="primary" text @click="submitCreateEntity"> הוסף </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="editDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ `עריכת ${managetitle}` }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editEntity.name"
            :label="`שם ה${managetitle}`"
            required
          />
          <v-text-field
            :key="field.key"
            v-for="field in extraFields"
            v-model="extraFieldsState[field.key]"
            :label="field.title"
            :required="field.required"
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="editDialog = false"> בטל </v-btn>
          <v-btn color="primary" text @click="submitEditEntity"> עדכן </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="deleteDialog" persistent max-width="500">
      <v-card>
        <v-card-text
          >? "האם אתה בטוח שברצונך למחוק את "{{
            deleteEntity && deleteEntity.name
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
    <h1>ניהול {{ managetitle }}ים</h1>
    <genericDataTable
      :headers="headers"
      :info="itemsData"
      :button="{ text: `הוספת ${managetitle}` }"
      :icons-button="tableButtons"
      @topButtonClick="addRow"
      @editRow="editRow"
      @deleteRow="deleteRow"
    />
  </v-container>
  <GlobalLoader v-else />
</template>

<script>
import genericDataTable from "../components/genericDataTable.vue";

export default {
  name: "Manage-View",
  components: {
    genericDataTable,
  },
  props: {
    managetitle: { type: String, required: true },
    apiRoute: { type: String, required: true },
    extraFields: {
      type: Array,
      required: false,
      default: function () {
        return [];
      },
    },
  },
  data: () => ({
    createDialog: false,
    editDialog: false,
    deleteDialog: false,
    deleteEntity: null,
    editEntity: {},
    readyToRender: false,
    newEntity: null,
    itemsData: null,
    extraFieldsState: {},
    headersData: [
      {
        value: "actions",
        sortable: false,
      },
      {
        text: "נוצר",
        value: "created_at",
        align: "right",
        sortable: true,
      },
      {
        text: "עדכון אחרון",
        value: "updated_at",
        align: "right",
        sortable: true,
        formatting: { type: "filter", key: "formatDate" },
        class: "no-break",
      },
      {
        text: "שם",
        value: "name",
        align: "right",
        sortable: true,
      },
    ],
    headers: [],
    tableButtons: [
      {
        text: "mdi-trash-can",
        eventName: "deleteRow",
        color: "red",
        tooltip: "מחיקה",
        class: "hidden",
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
    this.addExtraHeaders();
  },
  watch: {
    "$route.params": async function () {
      await this.fetchData();
      this.addExtraHeaders();
    },
  },
  methods: {
    addExtraHeaders() {
      this.headers = [...this.headersData];
      for (let i = 0; i < this.extraFields.length; i++) {
        let extraField = this.extraFields[i];
        this.headers.splice(2, 0, {
          text: extraField.title,
          value: extraField.key,
          align: "right",
          sortable: true,
        });
      }
    },
    async addRow() {
      this.createDialog = true;
    },
    async editRow(data) {
      for (let i = 0; i < this.extraFields.length; i++) {
        let extraField = this.extraFields[i];
        this.extraFieldsState[extraField.key] = data[extraField.key];
      }
      this.editEntity = data;
      this.editDialog = true;
    },
    async deleteRow(data) {
      this.deleteEntity = data;
      this.deleteDialog = true;
    },
    async fetchData() {
      this.resetData();
      const { data } = await this.$network.get(
        this.rootURL + `/${this.apiRoute}`
      );
      this.itemsData = this.formatItems(data);
      this.readyToRender = true;
    },
    resetData() {
      this.readyToRender = false;
      this.itemsData = null;
    },
    formatItems(itemsDict) {
      const itemsList = [];
      for (const [key, value] of Object.entries(itemsDict)) {
        itemsList.push({ id: key, ...value });
      }
      return itemsList;
    },
    cancelCreateEntity() {
      this.newEntity = null;
      this.createDialog = false;
    },
    async submitCreateEntity() {
      if (!this.newEntity) {
        this.createDialog = false;
        return;
      }
      await this.$network.post(this.rootURL + `/${this.apiRoute}`, {
        name: this.newEntity,
        ...this.extraFieldsState,
      });
      await this.fetchData();
      this.newEntity = null;
      this.extraFieldsState = {};
      this.createDialog = false;
    },
    async submitEditEntity() {
      if (!this.editEntity) {
        this.editDialog = false;
        return;
      }
      await this.$network.put(
        this.rootURL + `/${this.apiRoute}/${this.editEntity.id}`,
        {
          name: this.editEntity.name,
          ...this.extraFieldsState,
        }
      );
      this.editDialog = false;
      this.editEntity = {};
      this.extraFieldsState = {};
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
      this.extraFieldsState = {};
      await this.fetchData();
    },
  },
};
</script>

<style scoped>
</style>
