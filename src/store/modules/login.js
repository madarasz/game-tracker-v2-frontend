import { repositoryFactory } from '@/api/repositoryFactory';
const loginRepository = repositoryFactory.get('login');

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
        login(context, {email, password}) {
            return loginRepository.loginWithPassword({
                email: email,
                password: password
            }).then((response) => {
                context.state.jwtToken = response.data.token;
                context.state.userId = response.data.userId;
                context.state.isAdmin = response.data.isAdmin;
                context.state.userName = response.data.userName;
                context.state.dialogLogin = false;
                loginRepository.setToken(response.data.token);
            })
        }
    },
    mutations: {
        logout(state) {
            state.jwtToken = '';
            state.userId = null;
            state.isAdmin = false;
            state.userName = '';
            loginRepository.removeToken();
        },
        showLoginDialog(state) {
            state.dialogLogin = true;
        },
        hideLoginDialog(state) {
            state.dialogLogin = false;
        }
    }
}