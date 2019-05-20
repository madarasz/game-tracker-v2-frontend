import Repository from "./repository";

const resource = "/groups";
export default {
    getGroups() {
        return Repository.get(`${resource}`);
    }
}