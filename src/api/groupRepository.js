import Repository from "./repository";

const resource = "/groups";
export default {
    getGroups() {
        return Repository.repo.get(`${resource}`);
    },
    getGroupDetails(id) {
        return Repository.repo.get(`${resource}/${id}`);
    }
}