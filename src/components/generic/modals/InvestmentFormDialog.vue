<template>
  <v-row justify="center" v-if="readyToRender">
    <v-dialog :value="dialog" persistent max-width="800px">
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
                    :items="investmentTypeOptions"
                    label="סוג ההשקעה"
                    no-data-text="לא קיימים סוגי השקעה במערכת, יש להוסיף תחילה"
                    :menu-props="{ bottom: true, offsetY: true }"
                    v-model="investmentType"
                    required
                    clearable
                    :rules="required"
                  />
                </v-col>
                <v-col>
                  <v-select
                    reverse
                    :items="investors"
                    label="שם בעל החשבון"
                    hint="שם האדם שההשקעה על שמו"
                    no-data-text="לא קיימים בעלי חשבון במערכת, יש להוסיף תחילה"
                    :menu-props="{ bottom: true, offsetY: true }"
                    v-model="investorId"
                    clearable
                    required
                    :rules="required"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    reverse
                    :items="countriesOptions"
                    label="מדינה"
                    no-data-text="לא קיימות מדינות במערכת, יש להוסיף תחילה"
                    :menu-props="{ bottom: true, offsetY: true }"
                    v-model="country"
                    required
                    clearable
                    :rules="required"
                  />
                </v-col>
                <v-col>
                  <v-select
                    reverse
                    :items="investmentRouteOptions"
                    label="מסלול ההשקעה"
                    no-data-text="לא קיימים מסלולי השקעה במערכת, יש להוסיף תחילה"
                    :menu-props="{ bottom: true, offsetY: true }"
                    v-model="investmentRoute"
                    required
                    clearable
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    reverse
                    type="string"
                    label="סמל מזהה"
                    hint="הכנס את סמל המוצר בו אתה משקיע"
                    v-model="investmentTicker"
                  />
                </v-col>
                <v-col>
                  <date-picker
                    @dateChanged="dateChanged"
                    :start-with="as_of_date"
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
                    :suffix="
                      this.coinsDict[this.coin]
                        ? this.coinsDict[this.coin].suffix
                        : ''
                    "
                    v-model="investmentAmount"
                    required
                    :rules="required"
                  />
                </v-col>
                <v-col>
                  <v-select
                    reverse
                    :items="coinsOptions"
                    label="מטבע"
                    no-data-text="לא קיימים מטבעות במערכת, יש להוסיף תחילה"
                    :menu-props="{ bottom: true, offsetY: true }"
                    v-model="coin"
                    required
                    clearable
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
import DatePicker from "@/components/generic/modals/DatePicker";
import { mapGetters } from "vuex";
export default {
  components: { DatePicker },
  props: {
    dialog: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    entityToEdit: {},
  },
  async created() {
    await this.fetchData();
  },
  watch: {
    entityToEdit: async function () {
      this.investorId = this.entityToEdit.investor;
      this.investmentAmount = this.entityToEdit.amount;
      this.investmentType = this.entityToEdit.investments_type;
      this.investmentRoute = this.entityToEdit.investments_route;
      this.investmentTicker = this.entityToEdit.ticker;
      this.coin = this.entityToEdit.coin;
      this.country = this.entityToEdit.country;
      this.as_of_date = this.entityToEdit.as_of_date;
    },
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
      investmentAmount: null,
      investmentType: null,
      investmentRoute: null,
      investmentTicker: null,
      coin: null,
      country: null,
      as_of_date: null,
      valid: false,
      investorsOptions: [],
      investmentTypeOptions: [],
      investmentRouteOptions: [],
      coinsOptions: [],
      countriesOptions: [],
      coinsDict: {},
    };
  },
  computed: mapGetters(["tabelsConfig"]),
  methods: {
    dateChanged(date) {
      this.as_of_date = date;
    },
    async fetchData() {
      await this.fetchInvestors();
      await this.fetchInvestmentTypes();
      await this.fetchInvestmentRoutes();
      await this.fetchCoins();
      await this.fetchCountries();
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
    async fetchCoins() {
      const { data } = await this.$network.get(this.rootURL + "/coin");
      this.coinsDict = data;
      this.coinsOptions = this.dictToOptions(data);
      this.readyToRender = true;
    },
    async fetchCountries() {
      const { data } = await this.$network.get(this.rootURL + "/country");
      this.countriesOptions = this.dictToOptions(data);
      this.readyToRender = true;
    },
    async handleSubmit() {
      const valid = this.$refs.form.validate();
      if (!valid || !this.valid) return;
      this.$emit("submitEntity", {
        institute: this.$route.params.id,
        investor: this.investorId,
        investments_type: this.investmentType,
        investments_route: this.investmentRoute,
        coin: this.coin,
        amount: this.investmentAmount,
        ticker: this.investmentTicker,
        country: this.country,
        as_of_date: new Date(this.as_of_date).getTime(),
      });
    },
  },
};
</script>