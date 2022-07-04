import GlobalLoader from "../components/GlobalLoader.vue";

export default {
  components: { GlobalLoader },
  data() {
    return {
      rootURL: "http://localhost:9000/api",
      colors: ["#003f5c", "#2f4b7c", "#665191", "#a05195", "#d45087", "#f95d6a", "#ff7c43", "#ffa600",
        "#004f5c", "#006366", "#007663", "#008756", "#4c963f", "#83a220", "#bfa800", "#ffa600",
        "#11730c", "#4f7300", "#597a00", "#a13e00", "#c45c00", "#e24c34", "#f73c60", "#ff3a90"],

    }
  },
  computed: {
    routeName() {
      if (!this.tabelsConfig) return ""
      if (this.isNullOrUndefined(this.$route.params.id)) return ""
      if (this.isNullOrUndefined(this.tabelsConfig[this.$route.params.id])) return ""
      return this.tabelsConfig[this.$route.params.id].name;
    },
    title() {
      return `ההשקעות ב${this.routeName}`;
    },
  },
  methods: {
    async fetchTableNames() {
      const { data } = await this.$network.get(this.rootURL + "/institute");
      this.setTabelsConfig({ "allInvestments": { name: "ריכוז השקעות" }, "": { name: "תמונת מצב" }, ...data });
      this.readyToRender = true;
    },
    isNullOrUndefined(value) {
      return value === undefined || value === null;
    },
    reverseDict(dict) {
      const reversed = {};
      for (const [key, value] of Object.entries(dict)) {
        reversed[value] = key;
      }
      return reversed;
    },
    dictToList(dict) {
      const list = []
      for (const [key, value] of Object.entries(dict)) {
        list.push({ id: key, ...value })
      }
      return list
    },
    dictToOptions(dict) {
      const list = []
      for (const [key, value] of Object.entries(dict)) {
        list.push({ value: key, text: value.name })
      }
      return list
    },
    formatItems(itemsDict) {
      const itemsList = [];
      for (const [key, value] of Object.entries(itemsDict)) {
        itemsList.push({ id: key, ...value });
      }
      return itemsList;
    },
    resetData() {
      this.readyToRender = false;
      this.itemsData = null;
    },
  }
};