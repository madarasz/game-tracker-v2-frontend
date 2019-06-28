import { repositoryFactory } from '@/api/repositoryFactory';
const sessionRepository = repositoryFactory.get('sessions');
const imageRepository = repositoryFactory.get('images');

export const session = {
    namespaced: true,
    state: {
        currentSession: null,
        isNewSession: false,
        editingSession: false
    },
    getters: {
        canUserEditSession(state, getters, rootState, rootGetters) {
            if (state.currentSession == null) {
                return false;
            }
            if (rootGetters['login/isUserAdmin'] || rootGetters['groups/isUserGroupAdmin']) {
                return true;    // admins always have the privilage
            }
            const userId = rootGetters['login/getUserId'];
            return state.currentSession.created_by == userId;
        }
    },
    actions: {
        saveSession(context) {
            return sessionRepository.addSession(context.state.currentSession).then((response) => {
                context.state.currentSession = response.data;
                context.state.editingSession = false;
            })
        },
        updateSession(context) {
            return sessionRepository.updateSession(context.state.currentSession.id, context.state.currentSession).then((response) => {
                context.state.currentSession = response.data;
                context.state.editingSession = false;
            });
        },
        deleteSession({state, commit}) {
            return sessionRepository.deleteSession(state.currentSession.id).then(() => {
                commit('clearSession');
            })
        },
        removeImage(context, {id, groupId}) {
            return imageRepository.removeImage({
                type: 'session',
                parent_id: context.state.currentSession.group_id,   // group id is required, group members can remove images
                image_id: id,
                group_id: groupId
            })
        }
    },
    mutations: {
        addSession(state, {groupId, gameId}) {
            state.currentSession = {
                place: '',
                notes: '',
                date: new Date().toISOString().slice(0,10),
                group_id: groupId,
                game_id: gameId
            };
            state.editingSession = true;
            state.isNewSession = true;
        },
        editSession(state) {
            state.editingSession = true;
            state.isNewSession = false;
        },
        clearSession(state) {
            state.currentSession = null;
            state.editingSession = false;
        },
        stopEditingSession(state) {
            state.editingSession = false;
        },
        selectSession(state, session) {
            state.currentSession = session;
        }
    }
}