import Vue from "vue";

export const ModalService = new Vue({
    methods: {
        open(component, props = {}) {
            return new Promise((resolve, reject) => {
                this.$emit("open", { component, props, resolve, reject });
            });
        },
        close(component) {
            this.$emit("close", component);
        },
        closeLastModal() {
            this.$emit("closeLastModal");
        },
        openLoader(text = "LOADING ...") {
            this.$emit("openLoader", text);
        },
        closeLoader() {
            this.$emit("closeLoader");
        },
    },
});
