<template>
  <v-row justify="center" v-if="readyToRender">
    <v-dialog :value="dialog" persistent max-width="400px">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="handleSubmit"
      >
        <v-card>
          <v-card-title class="cardTitleContainer">
            <span class="text-h5">הוסף רישום להשקעה</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-select
                    reverse
                    :items="investors"
                    label="שם בעל החשבון"
                    hint="שם האדם שההשקעה על שמו"
                    no-data-text="לא קיימים בעלי חשבון במערכת, יש להוסיף תחילה"
                    :menu-props="{ bottom: true, offsetY: true }"
                    v-model="investorId"
                    required
                    :rules="required"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    reverse
                    :items="investmentTypeOptions"
                    label="סוג ההשקעה"
                    no-data-text="לא קיימים סוגי השקעה במערכת, יש להוסיף תחילה"
                    :menu-props="{ bottom: true, offsetY: true }"
                    v-model="investmentType"
                    required
                    :rules="required"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    reverse
                    :items="investmentRouteOptions"
                    label="מסלול ההשקעה"
                    no-data-text="לא קיימים מסלולי השקעה במערכת, יש להוסיף תחילה"
                    :menu-props="{ bottom: true, offsetY: true }"
                    v-model="investmentRoute"
                    required
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    reverse
                    type="number"
                    label="סכום בשקלים"
                    hint="הכנס את סכום ההשקעה"
                    suffix="₪"
                    v-model="investmentAmount"
                    required
                    :rules="required"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="$emit('closeModal')">
              ביטול
            </v-btn>
            <v-btn type="submit" color="blue darken-1" :disabled="!valid" text>
              שמור
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
  <GlobalLoader v-else />
</template>

<script>
import { mapGetters } from "vuex";
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
  async created() {
    await this.fetchData();
  },
  data() {
    return {
      readyToRender: false,
      required: [
        (v) => {
          const text = "שדה חובה";
          if (this.isNullOrUndefined(v) || v === "") return text;
          return true;
        },
      ],
      investorId: null,
      investmentAmount: 0,
      investmentType: null,
      investmentRoute: null,
      valid: false,
      investorsOptions: [],
      investmentTypeOptions: [],
      investmentRouteOptions: [],
    };
  },
  computed: mapGetters(["tabelsConfig"]),
  methods: {
    async fetchData() {
      await this.fetchInvestors();
      await this.fetchInvestmentTypes();
      await this.fetchInvestmentRoutes();
    },
    async fetchInvestors() {
      const { data } = await this.$network.get(this.rootURL + "/investor");
      this.investors = this.dictToOptions(data);
      this.readyToRender = true;
    },
    async fetchInvestmentTypes() {
      const { data } = await this.$network.get(
        this.rootURL + "/investments-type"
      );
      this.investmentTypeOptions = this.dictToOptions(data);
      this.readyToRender = true;
    },
    async fetchInvestmentRoutes() {
      const { data } = await this.$network.get(
        this.rootURL + "/investments-route"
      );
      this.investmentRouteOptions = this.dictToOptions(data);
      this.readyToRender = true;
    },
    async handleSubmit() {
      this.$refs.form.validate();
      if (!this.valid) return;
      await this.$network.post(this.rootURL + `/investment`, {
        institute: this.$route.params.id,
        investor: this.investorId,
        investments_type: this.investmentType,
        investments_route: this.investmentRoute,
        amount: this.investmentAmount,
      });
      this.$emit("closeModal");
    },
  },
};
</script>