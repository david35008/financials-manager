<template>
  <div class="text-center">
    <v-dialog :value="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> Delete Tab </v-card-title>
        <v-card-text>
          <v-select
            :items="institutes"
            :menu-props="{ bottom: true, offsetY: true }"
            v-model="tabToDelete"
          />
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
  },
  data() {
    return {
      institutes: [],
      tabToDelete: "",
    };
  },
  created() {
    this.institutes = this.dictToOptions(this.tabelsConfig).filter(
      (a) => a.value != 0
    );
  },
  computed: mapGetters(["tabelsConfig"]),
  methods: {
    ...mapActions(["setTabelsConfig"]),
    cancel() {
      this.tabToDelete = "";
      this.$emit("closeModal");
    },
    async submit() {
      if (!this.tabToDelete) {
        return this.$emit("closeModal");
      }
      try {
        await this.$network.delete(
          this.rootURL + `/institute/${this.tabToDelete}`
        );
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