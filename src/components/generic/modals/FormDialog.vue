<template>
  <v-row justify="center">
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
                  <v-text-field
                    reverse
                    label="שם בעל החשבון"
                    hint="שם האדם שההשקעה על שמו"
                    v-model="investorName"
                    required
                    :rules="required"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    reverse
                    :items="investMentypes"
                    label="סוג ההשקעה"
                    :menu-props="{ bottom: true, offsetY: true }"
                    v-model="investmentType"
                    required
                    :rules="required"
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
  data() {
    return {
      required: [
        (v) => {
          const text = "שדה חובה";
          if (this.isNullOrUndefined(v) || v === "") return text;
          return true;
        },
      ],
      investorName: "",
      investmentAmount: 0,
      investmentType: null,
      valid: false,
      investMentypes: [
        { text: "קרן פנסיה", value: "pension" },
        { text: "ביטוח מנהלים", value: "manager_insurance" },
        { text: "קופת גמל פנסיונית", value: "pension_provident_fund" },
        { text: "קופת גמל להשקעה", value: "invest_provident_fund" },
      ],
    };
  },
  computed: mapGetters(["tabelsConfig"]),
  methods: {
    async handleSubmit() {
      this.$refs.form.validate();
      if (!this.valid) return;
      try {
        await this.$network.post(this.rootURL + `/item/${this.routeName}`, {
          investorName: this.investorName,
          investmentAmount: this.investmentAmount,
          investmentType: this.investmentType,
        });
        this.$emit("closeModal");
      } catch (error) {
        alert("DataBase Error");
        console.error(error);
        return;
      }
    },
  },
};
</script>