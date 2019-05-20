import { repositoryFactory } from '@/api/repositoryFactory';
const groupRepository = repositoryFactory.get('groups');

export const groups = {
    namespaced: true,
    state: {
        groups: [],
        selectedGroupIndex: null
    },
    getters: {
    },
    actions: {
        getGroups(context) {
            groupRepository.getGroups().then((response) => {
                context.state.groups = response.data;
            });
        }
    },
    mutations: {
    }
}