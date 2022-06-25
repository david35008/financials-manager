import GlobalLoader from "../components/GlobalLoader.vue";

export default {
  components: { GlobalLoader },
  data() {
    return {
      rootURL: "http://localhost:9000/api",
    }
  },
  computed: {
    routeName() {
      return this.tabelsConfig[this.$route.params.id].name;
    },
    title() {
      return `ההשקעות ב${this.routeName}`;
    },
  },
  methods: {
    async fetchTableNames() {
      try {
        const { data } = await this.$network.get(this.rootURL + "/institute");
        this.setTabelsConfig({ ...data, 0: { name: "סה\"כ" } });
        this.readyToRender = true;
      } catch (error) {
        alert("DataBase Error");
        console.error(error);
      }
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