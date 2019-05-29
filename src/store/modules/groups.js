import { repositoryFactory } from '@/api/repositoryFactory';
const groupRepository = repositoryFactory.get('groups');

export const groups = {
    namespaced: true,
    state: {
        groups: [],
        selectedGroup: null
    },
    getters: {
        urlGroupName: (state) => {
            if (!state.selectedGroup) {
                return "";
            }
            return state.selectedGroup.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }
    },
    actions: {
        getGroups(context) {
            return groupRepository.getGroups().then((response) => {
                context.state.groups = response.data;
            });
        }
    },
    mutations: {
        selectGroup(state, {id}) {
            localStorage.setItem('selectedGroupId', id);
            if (Array.isArray(state.groups.myGroups)) {
                state.selectedGroup = state.groups.myGroups.find((group) => { return group.id == id});
                if (state.selectedGroup) {
                    return state.selectedGroup;
                }
            }
            state.selectedGroup = state.groups.publicGroups.find((group) => { return group.id == id});
            return state.selectedGroup;
        },
        unselectGroup(state) {
            state.selectedGroup = null;
            localStorage.removeItem('selectedGroupId');
        }
    }
}