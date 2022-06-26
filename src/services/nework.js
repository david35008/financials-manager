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
        const logTable = {}
        logTable['Erorr Name'] = error.name
        logTable['Erorr Message'] = error.message
        if (error.config) {
            logTable['Request Url'] = error.config.url
            logTable['Request Method'] = error.config.method
            logTable['Request Headers'] = error.config.headers.Accept
            logTable['Request Data'] = error.config.data
        }
        if (error.response) {
            logTable['Response Status'] = error.response.status
            logTable['Response Data'] = error.response.data
        }
        // const originalRequest = error.config;
        console.table(logTable)
        alert('יש בעיה במערכת, נא לפנות לדוד')
    },
);

export default network;