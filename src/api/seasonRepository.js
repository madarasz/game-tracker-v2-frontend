import Repository from "./repository";

const resource = "/seasons";
export default {
    addSeason(season) {
        return Repository.repo.post(`${resource}`, season);
    },
    updateSeason(id, season) {
        return Repository.repo.put(`${resource}/${id}`, season);
    },
    deleteSeason(id) {
        return Repository.repo.delete(`${resource}/${id}`);
    }
}