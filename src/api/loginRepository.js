import Repository from "./repository";

const resource = "/auth";
export default {
    loginWithPassword(credentials) {
        return Repository.repo.post(`${resource}/login`, {
            email: credentials.email,
            password: credentials.password
        });
    },
    setToken(token) {
        Repository.setToken(token);
    },
    removeToken() {
        Repository.removeToken();
    },
    ping() {
        return Repository.repo.get(`${resource}/ping`);
    }
}