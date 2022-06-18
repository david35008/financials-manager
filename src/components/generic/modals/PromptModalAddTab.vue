<template>
  <div class="text-center">
    <v-dialog :value="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Add New Tab
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newTabName"
            label="New Tab*"
            required
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel"> Cancel </v-btn>
          <v-btn color="primary" text @click="submit"> Create </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    dialog: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      newTabName: "",
    };
  },
  computed: mapGetters(["tabelsConfig"]),
  methods: {
    ...mapActions(["setTabelsConfig"]),
    cancel() {
      this.newTabName = "";
      this.$emit("closeModal");
    },
    async submit() {
      if (!this.newTabName) {
        return this.$emit("closeModal");
      }
      try {
        await this.$network.post(this.rootURL + "/institute", {
          instituteName: this.newTabName,
        });
        await this.fetchTableNames();
      } catch (error) {
        alert("DataBase Error");
        console.error(error);
        return;
      }
      this.newTabName = "";
      this.$emit("closeModal");
    },
  },
};
</script>