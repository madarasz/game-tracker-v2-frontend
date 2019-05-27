import { repositoryFactory } from '@/api/repositoryFactory';
const loginRepository = repositoryFactory.get('login');

export const login = {
    namespaced: true,
    state: {
        dialogLogin: false,
        token: '',
        userId: null,
        userName: '',
        isAdmin: false,
        imageFile: null
    },
    getters: {
        urlUserName: (state) => {
            if (!state.userName) {
                return "";
            }
            return state.userName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }
    },
    actions: {
        login(context, {email, password}) {
            return loginRepository.loginWithPassword({
                email: email,
                password: password
            }).then((response) => {
                loginRepository.setToken(response.data.token);
                context.commit('login', response.data);
            })
        }
    },
    mutations: {
        login(state, {token, userId, isAdmin, userName, imageFile}) {
            state.token = token;
            state.userId = userId;
            state.isAdmin = isAdmin;
            state.userName = userName;
            state.dialogLogin = false;
            state.imageFile = imageFile;
            loginRepository.setToken(token);
            localStorage.setItem('loginData', JSON.stringify({...state}));
        },
        logout(state) {
            state.token = '';
            state.userId = null;
            state.isAdmin = false;
            state.userName = '';
            state.imageFile = null;
            loginRepository.removeToken();
            localStorage.setItem('loginData', JSON.stringify({...state}));
        },
        showLoginDialog(state) {
            state.dialogLogin = true;
        },
        hideLoginDialog(state) {
            state.dialogLogin = false;
        }
    }
}