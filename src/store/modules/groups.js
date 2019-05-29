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
            groupRepository.getGroups().then((response) => {
                context.state.groups = response.data;
            });
        }
    },
    mutations: {
        selectGroup(state, {id}) {
            state.selectedGroup = 'meh';
            state.selectedGroup = state.groups.myGroups.find((group) => { return group.id == id});
            if (state.selectedGroup) {
                return state.selectedGroup;
            }
            state.selectedGroup = state.groups.publicGroups.find((group) => { return group.id == id});
            return state.selectedGroup;
        },
        unselectGroup(state) {
            state.selectedGroup = null;
        }
    }
}