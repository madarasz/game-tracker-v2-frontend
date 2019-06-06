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
        },
        isUserGroupAdmin: (state) => {
            return userId => {
                if (!state.selectedGroup || !state.selectedGroup.members) {
                    return false;
                }
                const member = state.selectedGroup.members.find((x) => {return x.id == userId});
                return (member !== undefined) && member.is_group_admin;
            }

        }
    },
    actions: {
        getGroups(context) {
            return groupRepository.getGroups().then((response) => {
                context.state.groups = response.data;
            });
        },
        getGroupDetails(context, {id}) {
            return groupRepository.getGroupDetails(id).then((response) => {
                context.state.selectedGroup = response.data;
                localStorage.setItem('selectedGroup', JSON.stringify({...response.data}));
            })
        }
    },
    mutations: {
        unselectGroup(state) {
            state.selectedGroup = null;
            localStorage.removeItem('selectedGroup');
        },
        setSelectedGroupFromLocalStorage(state) {
            state.selectedGroup = JSON.parse(localStorage.selectedGroup);
        }
    }
}