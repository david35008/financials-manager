<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> Delete Tab </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="tabToDelete"
            label="Tab To Delete"
            required
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel"> Cancel </v-btn>
          <v-btn color="primary" text @click="submit"> Approve </v-btn>
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
    url: { type: String, required: true },
  },
  data() {
    return {
      tabToDelete: "",
    };
  },
  computed: mapGetters(["tabelsConfig"]),
  methods: {
    ...mapActions(["setTabelsConfig"]),
    cancel() {
      this.tabToDelete = "";
      this.$emit("closeModal");
    },
    async submit() {
      try {
        await this.$network.delete(this.rootURL + `/table/${this.tabToDelete}`);
        await this.fetchTableNames();
      } catch (error) {
        alert("DataBase Error");
        console.error(error);
      }
      this.tabToDelete = "";
      this.$emit("closeModal");
    },
  },
};
</script>