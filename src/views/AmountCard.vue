<template>
  <v-card class="mx-auto" max-width="344" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-h6 mb-4">
          {{ cardTitle }}
        </div>
        <template v-if="!objectIsEmpty(cardAmounts)">
        <v-list-item-title
          :key="item.name"
          v-for="item in cardAmounts"
          class="text-h5 mb-1"
        >
          {{ item.amount | currency }} {{ item.suffix }}
        </v-list-item-title>
        </template>
        <div v-else>אין כספים בבית השקעה זה</div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>
<script>
export default {
  name: "amountCard",
  props: {
    cardAmounts: {},
    cardTitle: {},
  },
};
</script>