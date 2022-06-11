import Vue from "vue";
import apiClient from "@/services/nework";

Vue.prototype.$network = {
    get(url, params = undefined) {
        return apiClient.get(url, { params: params });
    },
    post(url, body) {
        return apiClient.post(url, body);
    },
    put(url, body) {
        return apiClient.put(url, body);
    },
    patch(url, body) {
        return apiClient.patch(url, body);
    },
    delete(url) {
        return apiClient.delete(url);
    },
};