import axios from 'axios';

const baseDomain = "http://localhost:8000";
const baseURL = `${baseDomain}/api`;
const repo = axios.create({
    baseURL
});

export default {
    repo,
    setToken: (token) => {
        repo.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    },
    removeToken: (() => {
        repo.defaults.headers.common['Authorization'] = null;
    })
};