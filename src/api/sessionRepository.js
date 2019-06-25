import Repository from "./repository";

const resource = "/sessions";
export default {
    addSession(session) {
        return Repository.repo.post(`${resource}`, session);
    },
    updateSession(id, session) {
        return Repository.repo.put(`${resource}/${id}`, session);
    },
    deleteSession(id) {
        return Repository.repo.delete(`${resource}/${id}`);
    }
}