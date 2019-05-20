import loginRepository from './loginRepository';
import groupRepository from './groupRepository';

const repositories = {
    login: loginRepository,
    groups: groupRepository,
}

export const repositoryFactory = {
    get: name => repositories[name]
}