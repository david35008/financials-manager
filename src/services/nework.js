import axios from 'axios';

const network = axios.create({});

network.interceptors.request.use(
    (config) => {
        return config;
    },
);

network.interceptors.response.use(
    (response) => response,
    async (error) => {
        // const status = error.response ? error.response.status : null;
        // const originalRequest = error.config;
        throw error;
    },
);

export default network;