<template>
  <genericDataTable
    :headers="headers"
    :info="itemsData"
    :insert-dialog="true"
    :button="addRow ? { text: 'הוסף השקעה' } : null"
    @topButtonClick="addRow"
  />
</template>
<script>
import GenericDataTable from "../components/generic/genericDataTable.vue";

export default {
  name: "InvestmentTable",
  components: { GenericDataTable },
  props: {
    addRow: {},
    itemsData: {},
  },
  data() {
    return {
      headers: [
        {
          text: "סכום",
          value: "amount",
          align: "right",
          sortable: false,
          suffix: "₪",
          type: "money",
        },
        {
          text: "סוג ההשקעה",
          value: "investments_type_name",
          align: "right",
          sortable: true
        },
        {
          text: "בית ההשקעות",
          value: "institute_name",
          align: "right",
          sortable: true,
        },
        {
          text: "שם בעל ההשקעה",
          value: "investor_name",
          align: "right",
          sortable: true,
        },
      ],
    };
  },
};
</script>
