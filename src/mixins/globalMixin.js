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
      const reveresedConfig = this.reverseDict(this.tabelsConfig);
      const thaName = reveresedConfig[`/${this.$route.params.id}`];
      return thaName;
    },
    title() {
      return `${this.routeName} Account`;
    },
  },
  methods: {
    async fetchTableNames() {
      try {
        const { data } = await this.$network.get(this.rootURL + "/start");
        const tablesNames = { All: "/" };
        data.forEach((a, i) => {
          tablesNames[a] = `/${i}`;
        });
        this.setTabelsConfig(tablesNames);
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
  }
};