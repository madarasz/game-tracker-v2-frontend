export const session = {
    namespaced: true,
    state: {
        currentSession: null,
        isSaved: false,
        editing: false
    },
    getters: {
        
    },
    actions: {
        saveSession(context) {
            context.state.editing = false;
        }
    },
    mutations: {
        addSession(state) {
            state.currentSession = {
                place: '',
                notes: '',
                date: new Date().toISOString().slice(0,10)
            };
            state.editing = true;
        },
        editSession(state) {
            state.editing = true;
        },
        clearSession(state) {
            state.currentSession = null;
            state.editing = false;
        }
    }
}