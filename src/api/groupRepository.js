import Repository from "./repository";

const resource = "/groups";
export default {
    getGroups() {
        return Repository.repo.get(`${resource}`);
    },
    getGroupDetails(id) {
        return Repository.repo.get(`${resource}/${id}`);
    },
    updateGroup(id, data) {
        return Repository.repo.put(`${resource}/${id}`, data);
    }
}