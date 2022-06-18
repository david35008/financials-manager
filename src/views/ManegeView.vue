<template>
  <v-container class="container" v-if="readyToRender">
    <v-dialog :value="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ `הוספת ${managetitle}` }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newEntity"
            :label="`שם ה${managetitle}`"
            required
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel"> בטל </v-btn>
          <v-btn color="primary" text @click="submit"> הוסף </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <h1>ניהול {{ managetitle }}ים</h1>
    <genericDataTable
      :headers="headersData"
      :info="itemsData"
      :insert-dialog="true"
      :button="{ text: `הוספת ${managetitle}` }"
      :icons-button="tableButtons"
      @topButtonClick="addRow"
      @deleteRow="deleteRow"
      @editRow="editRow($event.id)"
    />
  </v-container>
  <GlobalLoader v-else />
</template>

<script>
import genericDataTable from "../components/generic/genericDataTable.vue";

export default {
  name: "Manage-View",
  components: {
    genericDataTable,
  },
  props: {
    managetitle: { type: String, required: true },
    apiRoute: { type: String, required: true },
  },
  data: () => ({
    dialog: false,
    readyToRender: false,
    newEntity: null,
    itemsData: null,
    headersData: null,
    tableButtons: [
      {
        text: "edit",
        eventName: "editRow",
        color: "green",
        tooltip: "Edit",
      },
      {
        text: "delete",
        eventName: "deleteRow",
        color: "red",
        tooltip: "Delete",
      },
    ],
  }),
  async created() {
    await this.fetchData();
  },
  watch: {
    "$route.params": async function () {
      await this.fetchData();
    },
  },
  methods: {
    async addRow() {
      this.dialog = true;
    },
    async editRow(data) {
      console.log("edit", data);
    },
    async deleteRow(data) {
      console.log("delete", data);
    },
    async fetchData() {
      this.resetData();
      try {
        const { data } = await this.$network.get(
          this.rootURL + `/${this.apiRoute}`
        );
        const formatedItems = this.formatItems(data);
        console.log(formatedItems);
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
      return names.map((a) => {
        return {
          text: a,
          align: "start",
          sortable: true,
          value: a,
        };
      });
    },
    cancel() {
      this.newEntity = null;
      this.dialog = false;
    },
    async submit() {
      if (!this.newEntity) {
        this.dialog = false;
        return;
      }
      try {
        await this.$network.post(this.rootURL + `/${this.apiRoute}`, {
          name: this.newEntity,
        });
        await this.fetchData();
      } catch (error) {
        alert("יש בעיה במערכת, יש לפנות לדוד");
        console.error(error);
        return;
      }
      this.newEntity = null;
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
</style>
