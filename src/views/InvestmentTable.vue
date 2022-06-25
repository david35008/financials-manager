<template>
  <genericDataTable
    :headers="headers"
    :info="itemsData"
    :insert-dialog="true"
    :button="addRow ? { text: 'הוסף השקעה' } : null"
    @topButtonClick="addRow ? addRow : () => {}"
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
          text: "שם בעל ההשקעה",
          value: "investor_name",
          align: "left",
          sortable: true,
        },
        {
          text: "בית ההשקעות",
          value: "institute_name",
          align: "left",
          sortable: true,
        },
        {
          text: "סוג ההשקעה",
          value: "investments_type_name",
          align: "left",
          sortable: true,
        },
        {
          text: "סכום",
          value: "amount",
          align: "left",
          sortable: false,
          suffix: "₪",
          type: "money",
        },
      ],
    };
  },
};
</script>
