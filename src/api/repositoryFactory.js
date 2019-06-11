import loginRepository from './loginRepository';
import groupRepository from './groupRepository';
import imageRepository from './imageRepository';
import gameRepository from './gameRepository';

const repositories = {
    login: loginRepository,
    groups: groupRepository,
    images: imageRepository,
    games: gameRepository
}

export const repositoryFactory = {
    get: name => repositories[name]
}