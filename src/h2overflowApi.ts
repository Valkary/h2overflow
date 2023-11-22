import axios from "axios";

export const h2overflowApi = axios.create({
    baseURL: import.meta.env.MODE === "development" ?
        "http://localhost:3000/api" :
        "",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

h2overflowApi.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers = {
                ...config.headers,
                authorization: localStorage.getItem('token'),
            } as any;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);