<template>
  <genericDataTable
    :headers="headers"
    :info="itemsData"
    :button="button"
    :icons-button="tableButtons"
    displayAll
    @topButtonClick="addRow"
    @editRow="$emit('editRow', $event)"
    @deleteRow="$emit('deleteRow', $event)"
  />
</template>
<script>
import GenericDataTable from "./genericDataTable.vue";

export default {
  name: "InvestmentTable",
  components: { GenericDataTable },
  props: {
    button: {},
    addRow: {},
    itemsData: {},
    extraHeaders: {
      type: Array,
      required: false,
      default: function () {
        return [];
      },
    },
    tableButtons: {},
  },
  created() {
    this.headers = [...this.extraHeaders, ...this.headersData];
  },
  data() {
    return {
      headers: [],
      headersData: [
        {
          text: "נכון לתאריך",
          value: "as_of_date_view",
          align: "right",
          sortable: true,
          formatting: { type: "filter", key: "formatDate" },
          class: "no-break",
        },
        {
          text: "סכום",
          value: "amount",
          align: "right",
          sortable: false,
          // suffix: "₪",
          type: "money",
        },
        {
          text: "מסלול ההשקעה",
          value: "investments_route_name",
          align: "right",
          filterable: true,
          sortable: true,
        },
        {
          text: "סמל מזהה",
          value: "ticker",
          align: "right",
          filterable: true,
          sortable: true,
        },
        {
          text: "סוג ההשקעה",
          value: "investments_type_name",
          align: "right",
          filterable: true,
          sortable: true,
        },
        {
          text: "בית ההשקעות",
          value: "institute_name",
          align: "right",
          filterable: true,
          sortable: true,
        },
        {
          text: "שם בעל ההשקעה",
          value: "investor_name",
          align: "right",
          filterable: true,
          sortable: true,
        },
        {
          text: "מספר השקעה",
          value: "id",
          align: "right",
          sortable: true,
        },
      ],
    };
  },
};
</script>
