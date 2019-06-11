import Repository from "./repository";

const resource = "/games";
export default {
    addGame(game) {
        return Repository.repo.post(`${resource}`, game);
    },
    deleteGame(gameData) {
        return Repository.repo.delete(`${resource}`, {data: gameData});
    }
}