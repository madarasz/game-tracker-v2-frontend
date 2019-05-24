import loginRepository from './loginRepository';
import groupRepository from './groupRepository';
import imageRepository from './imageRepository';

const repositories = {
    login: loginRepository,
    groups: groupRepository,
    images: imageRepository
}

export const repositoryFactory = {
    get: name => repositories[name]
}