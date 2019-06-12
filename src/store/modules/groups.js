import { repositoryFactory } from '@/api/repositoryFactory';
const groupRepository = repositoryFactory.get('groups');
const imageRepository = repositoryFactory.get('images');

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
        getUserAsMember: (state) => {
            return userId => {
                if (!state.selectedGroup || !state.selectedGroup.members) {
                    return undefined;
                }
                const member = state.selectedGroup.members.find((x) => {return x.id == userId});
                return member;
            }
        },
        isUserGroupAdmin: (state, getters) => {
            return userId => {
                const member = getters.getUserAsMember(userId);
                return (member !== undefined) && member.is_group_admin;
            }
        },
        isUserGroupMember: (state, getters) => {
            return userId => {
                const member = getters.getUserAsMember(userId);
                return member !== undefined;
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
        },
        removeGroupImage(context) {
            return imageRepository.removeImage({
                type: 'group',
                parent_id: context.state.selectedGroup.id
            }).then(() => {
                context.state.selectedGroup.imageFile = null;
            });
        }
    },
    mutations: {
        unselectGroup(state) {
            state.selectedGroup = null;
            localStorage.removeItem('selectedGroup');
        },
        setSelectedGroupFromLocalStorage(state) {
            state.selectedGroup = JSON.parse(localStorage.selectedGroup);
        },
        setGroupImage(state, filename) {
            state.selectedGroup.imageFile = filename;
        },
    }
}