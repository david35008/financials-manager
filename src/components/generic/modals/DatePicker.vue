<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="computedDateFormatted"
        label="נכון לתאריך"
        persistent-hint
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        reverse
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" no-title @input="submitDate"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: "DatePicker",
  props: {
    startWith: {},
  },
  data: (vm) => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    menu: false,
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },
  created() {
    this.handleStartWithProp();
  },
  watch: {
    startWith() {
      this.handleStartWithProp();
    },
    date() {
      this.dateFormatted = this.formatDate(this.date);
    },
  },
  methods: {
    handleStartWithProp: function () {
      let propDate = this.startWith;
      if (!propDate) {
        propDate = Date.now();
      }
      this.date = new Date(
        propDate - new Date(propDate).getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
    },
    submitDate() {
      this.menu = false;
      this.$emit("dateChanged", this.date);
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>