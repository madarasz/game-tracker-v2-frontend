import Repository from "./repository";

const resource = "/groups";
export default {
    getGroups() {
        return Repository.repo.get(`${resource}`);
    }
}