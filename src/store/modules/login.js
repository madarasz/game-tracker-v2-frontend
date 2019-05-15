export const login = {
    namespaced: true,
    state: {
        dialogLogin: false,
        jwtToken: '',
        userId: null,
        userName: '',
        isAdmin: false
    },
    getters: {
    },
    actions: {

    },
    mutations: {
        login(state, {token, userId, isAdmin, userName}) {
            state.jwtToken = token;
            state.userId = userId;
            state.isAdmin = isAdmin;
            state.userName = userName;
        },
        logout(state) {
            state.jwtToken = '';
            state.userId = null;
            state.isAdmin = false;
            state.userName = '';
        },
        showLoginDialog(state) {
            state.dialogLogin = true;
        },
        hideLoginDialog(state) {
            state.dialogLogin = false;
        }
    }
}