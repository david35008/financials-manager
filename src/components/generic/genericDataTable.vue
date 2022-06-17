<template>
  <v-data-table
    :headers="headers"
    :items="info"
    sort-by="id"
    class="elevation-5"
    :search="search"
    :sort-desc="reverseSort"
    :items-per-page="computedDisplayAll"
  >
    <template v-if="title || ifToSearch || button" #top>
      <v-toolbar flat>
        <template v-if="title">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </template>
        <v-spacer></v-spacer>
        <template v-if="ifToSearch">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            filled
            rounded
            dense
            style="max-width: 300px"
          ></v-text-field>
        </template>
        <template v-if="button">
          <template v-if="button.href">
            <router-link :to="button.href">
              <v-btn
                :id="'button_' + button.text"
                color="primary"
                dark
                class="mb-2"
              >
                {{ button.text }}
              </v-btn>
            </router-link>
          </template>
          <template v-else>
            <v-btn
              :id="'button_' + button.text"
              class="mb-2"
              @click="topButtonClick"
            >
              {{ button.text }}
            </v-btn>
          </template>
        </template>
      </v-toolbar>
    </template>

    <template #item="{ item }">
      <!-- <tr @click="props.expanded = !props.expanded"> -->
      <tr
        :class="{
          'low-opacity': disabledRowByFunction
            ? disabledRowByFunction(item)
            : '',
        }"
      >
        <td
          v-for="(header, index) in headers"
          :key="header.text || index"
          :class="{ bold: header.bold, 'no-break': header.noBreak }"
        >
          <!-- if we want checkbox in the some column we need to add checkbox:true prop -->
          <template v-if="header.checkbox">
            <v-checkbox
              :id="getIdentifier(item)"
              v-model="item[header.value]"
              :disabled="header.disabled || item.disabled"
              @change="checkboxChanged($event, item, header.value)"
            />
          </template>

          <template v-else-if="header.select">
            <v-select
              :id="getIdentifier(item)"
              v-model="item[header.value]"
              :disabled="header.disabled || item.disabled"
              outlined
              hide-details
              dense
              placeholder="Any"
              :items="header.select.items"
              :menu-props="{ bottom: true, offsetY: true }"
              @change="changeHandler($event, item, header.value)"
            ></v-select>
          </template>

          <!-- if you want use slot, add to header prop as :   slot:"name of your slot" -->
          <template v-else-if="header.slot">
            <slot :name="header.slot" :item="item" :header="header"></slot>
          </template>

          <!-- if we want chip in the some column we need to add chip:true prop -->
          <template v-else-if="header.chip">
            <v-chip
              small
              :color="calculateColorChip(header, item)"
              dark
              class="table-chip"
            >
              {{ getValue(item, header.value) }}
            </v-chip>
          </template>

          <!-- multi options in action column -->
          <!-- TODO - need to be separate (DK) -->
          <template v-else-if="header.value === 'actions'">
            <!-- if you want in action column button or icon that change by condition -->
            <template
              v-if="condition && actionButtonTrue && actionButtonsFalse"
            >
              <!-- true button -->
              <template v-if="calcCondition(item[condition])">
                <v-btn
                  v-if="actionButtonTrue.type === 'button'"
                  class="ma-1"
                  depressed
                  small
                  :color="actionButtonTrue.color"
                  :class="actionButtonTrue.class"
                  @click="doAction(item, actionButtonTrue.eventName)"
                >
                  {{ actionButtonTrue.text }}
                </v-btn>
                <!-- true icon -->
                <v-tooltip v-else bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      :id="'button_' + actionButtonTrue.text"
                      class="ma-1"
                      depressed
                      small
                      fab
                      :color="actionButtonTrue.color"
                      :class="actionButtonTrue.class"
                      v-bind="attrs"
                      @click="doAction(item, actionButtonTrue.eventName)"
                      v-on="on"
                    >
                      <v-icon> {{ actionButtonTrue.text }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ actionButtonTrue.tooltip }}</span>
                </v-tooltip>
              </template>

              <template v-else>
                <!-- false button -->
                <v-btn
                  v-if="actionButtonsFalse.type === 'button'"
                  class="ma-1"
                  depressed
                  small
                  :color="actionButtonsFalse.color"
                  :class="actionButtonsFalse.class"
                  @click="doAction(item, actionButtonsFalse.eventName)"
                >
                  {{ actionButtonsFalse.text }}
                </v-btn>
                <!-- false icon -->
                <v-tooltip v-else bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      :id="'button_' + actionButtonsFalse.text"
                      class="ma-1"
                      depressed
                      small
                      fab
                      :color="actionButtonsFalse.color"
                      :class="actionButtonsFalse.class"
                      v-bind="attrs"
                      @click="doAction(item, actionButtonsFalse.eventName)"
                      v-on="on"
                    >
                      <v-icon> {{ actionButtonsFalse.text }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ actionButtonsFalse.tooltip }}</span>
                </v-tooltip>
              </template>
            </template>

            <!-- if you want in action column multiple icons button -->
            <template v-if="iconsButton">
              <template v-for="iconButton in iconsButton">
                <v-tooltip :key="iconButton.text" bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      :id="'icon_button_' + iconButton.text"
                      class="ma-1"
                      small
                      fab
                      outlined
                      :color="iconButton.color"
                      :class="iconButton.class"
                      v-bind="attrs"
                      @click="doAction(item, iconButton.eventName)"
                      v-on="on"
                    >
                      <v-icon> {{ iconButton.text }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ iconButton.tooltip }}</span>
                </v-tooltip>
              </template>
            </template>

            <!-- if you want in action column a multiple buttons -->
            <template v-if="actionsButtons">
              <template v-for="actionButton in actionsButtons">
                <v-btn
                  :id="'action_button_' + actionButton.text"
                  :key="actionButton.text"
                  depressed
                  small
                  :color="actionButton.color"
                  :class="actionButton.class"
                  @click="doAction(item, actionButton.eventName)"
                >
                  {{ actionButton.text }}
                </v-btn>
              </template>
            </template>

            <!-- if you want in action column a to open dialog full screen -->
            <template v-if="insertDialog">
              <template>
                <v-btn
                  :id="getIdentifier(item)"
                  icon
                  @click="doAction(item, 'openDialog')"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
            </template>
          </template>

          <!-- if we want text as link that to do action, we need to add link:true prop -->
          <template v-else-if="header.link">
            <span
              class="hl-link-table"
              @click="doAction(item, header.eventName || 'linkClicked')"
              >{{ getValue(item, header.value) }}</span
            >
          </template>

          <!-- if we want text as link that to do action, we need to add linkText:"string of our text" prop & eventName -->
          <template v-else-if="header.linkOfText">
            <span
              class="hl-link-table"
              @click="doAction(item, header.eventName || 'linkClicked')"
              >{{ header.linkOfText }}</span
            >
          </template>

          <!-- if we want text as link that to do action only if the value its !! true !!, we need to add 'linkInCondition:true' & 'eventName' & 'linkText' props-->
          <template v-else-if="header.linkInCondition">
            <span
              v-if="item[header.value]"
              class="hl-link-table"
              @click="doAction(item, header.eventName)"
              >{{ header.linkText }}</span
            >
            <template v-else>
              {{ header.notAvailableText }}
            </template>
          </template>

          <!-- if we want waring chip with condition we need to add 'warning:true' and functionWarning prop as function for condition -->
          <template v-else-if="header.warning">
            <template v-if="header.functionWarning(item[header.value])">
              <v-chip
                small
                :color="header.functionWarning(item[header.value])"
                dark
                class="table-chip"
              >
                <template v-if="header.function">
                  {{ header.function(item[header.value]) }}
                </template>
                <template v-else>
                  {{ getValue(item, header.value) }}
                </template>
              </v-chip>
            </template>
            <template v-else>
              <template v-if="header.function">
                {{ header.function(item[header.value]) }}
              </template>
              <template v-else>
                {{ getValue(item, header.value) }}
              </template>
            </template>
          </template>

          <!-- if we want to do function on value, add 'function' prop to the header -->
          <template v-else-if="header.function">
            {{ header.function(item[header.value]) }}
          </template>

          <!-- if the value is 'undefined'  -->
          <template v-else-if="!item[header.value]"> - </template>

          <!-- if the value is "true" we will show green icon -->
          <template v-else-if="item[header.value] === true">
            <v-icon color="green darken-2"> check_circle </v-icon>
          </template>

          <!-- if the value is "false" we will show red icon -->
          <template v-else-if="item[header.value] === false">
            <v-icon color="red darken-2"> cancel </v-icon>
          </template>

          <!-- regular display -->
          <template v-else>
            {{ getValue(item, header.value) }}
          </template>
        </td>
      </tr>
    </template>

    <template slot="no-data">
      <div>{{ empyDataMessage }}</div>
    </template>

    <!-- <template v-slot:item.approved="{ item }">
      <template v-if="item === true">
        <v-icon color="green darken-2">check_circle</v-icon>
      </template>
      <template v-else-if="item.approved === false">
        <v-icon color="red darken-2">cancel</v-icon>
      </template>
    </template> -->

    <!-- <template v-slot:expand="props">
      <v-card flat>
        <v-card-text>{{ props }}</v-card-text>
      </v-card>
    </template> -->
  </v-data-table>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "GenericDataTable",
  props: {
    headers: { type: Array, required: true },
    info: { type: Array, required: true },
    title: { type: String, required: false, default: null },
    insertDialog: { type: Boolean, required: false },
    ifToSearch: { type: Boolean, required: false },
    button: { type: Object, required: false, default: null },
    actionsButtons: { type: Object, required: false, default: null },
    actionButtonTrue: { type: Object, required: false, default: null },
    actionButtonsFalse: { type: Object, required: false, default: null },
    condition: { type: String, required: false, default: null },
    isConditionReverse: { type: Boolean, required: false, default: null },
    displayAll: { type: Boolean, required: false, default: null },
    reverseSort: { type: Boolean, required: false, default: null },
    iconsButton: { type: Array, required: false, default: null },
    conditionKeyForDialog: { type: String, required: false, default: null },
    disabledRowByFunction: { type: Function, required: false, default: null },
    empyDataMessage: {
      type: String,
      required: false,
      default: "No data available",
    },
  },
  data() {
    return {
      expand: false,
      search: "",
    };
  },
  computed: {
    computedDisplayAll() {
      if (this.displayAll) {
        return -1;
      }
      return undefined;
    },
  },
  methods: {
    calcCondition(condition) {
      if (this.isConditionReverse) {
        return !condition;
      } else {
        return condition;
      }
    },
    getIdentifier(item) {
      if (item.identifier) {
        return `open-dialog-${item.identifier}`;
      }
      return undefined;
    },
    topButtonClick() {
      this.$emit("topButtonClick");
    },
    doAction(item, eventName) {
      this.$emit(eventName, item);
    },
    checkboxChanged(event, item, key) {
      const data = { checked: event, item, key };
      this.$emit("checkboxChanged", data);
    },
    changeHandler(value, item, key) {
      const data = { value, item, key };
      this.$emit("change", data);
    },
    calculateColorChip(header, item) {
      if (header.color) {
        return header.color;
      } else if (header.functionChip) {
        return header.functionChip(item[header.value]);
      } else if (header.defColor) {
        return header.defColor;
      } else {
        return "black";
      }
    },
    getValue(item, keys) {
      if (typeof keys === "string") {
        return item[keys];
      } else if (Array.isArray(keys)) {
        return this.getValueByKeys(keys, item);
      }
    },
  },
});
</script>

<style scoped>
.elevation-5 {
  margin: 20px 0px;
}
.button {
  cursor: pointer;
}
.checkbox {
  cursor: pointer;
  width: 15px;
  height: 15px;
}
.bold {
  font-weight: bold;
}
tbody tr:nth-child(odd) {
  background-color: rgb(238, 238, 238);
}
tbody tr:hover {
  background: rgb(189, 189, 189) !important;
}
.table-chip {
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 1.1px;
}
.no-break {
  white-space: nowrap;
}
.low-opacity {
  opacity: 0.7;
}
</style>
