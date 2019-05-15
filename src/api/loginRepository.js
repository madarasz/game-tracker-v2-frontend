import Repository from "./repository";

const resource = "/auth";
export default {
    loginWithPassword(credentials) {
        return Repository.post(`${resource}/login`, {
            email: credentials.email,
            password: credentials.password
        })
    }
}