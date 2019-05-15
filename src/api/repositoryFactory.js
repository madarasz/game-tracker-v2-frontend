import loginRepository from './loginRepository';

const repositories = {
    login: loginRepository
}

export const repositoryFactory = {
    get: name => repositories[name]
}