import GlobalLoader from "../components/GlobalLoader.vue";

export default {
    components: { GlobalLoader },
    data() {
        return {
            rootURL: "/api",
        }
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
        }
    }
};