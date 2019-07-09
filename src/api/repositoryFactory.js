import loginRepository from './loginRepository';
import groupRepository from './groupRepository';
import imageRepository from './imageRepository';
import gameRepository from './gameRepository';
import sessionRepository from './sessionRepository';
import seasonRepository from './seasonRepository';

const repositories = {
    login: loginRepository,
    groups: groupRepository,
    images: imageRepository,
    games: gameRepository,
    sessions: sessionRepository,
    seasons: seasonRepository
}

export const repositoryFactory = {
    get: name => repositories[name]
}