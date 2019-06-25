import { repositoryFactory } from '@/api/repositoryFactory';
const sessionRepository = repositoryFactory.get('sessions');

export const session = {
    namespaced: true,
    state: {
        currentSession: null,
        isNewSession: false,
        editingSession: false
    },
    getters: {
        
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