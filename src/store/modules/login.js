import { repositoryFactory } from '@/api/repositoryFactory';
import common from '@/common';
const loginRepository = repositoryFactory.get('login');
const imageRepository = repositoryFactory.get('images');

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
            return common.urlFriendly(state.userName);
        },
        getUserId: (state) => {
            return state.userId;
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
        },
        setProfileImage(context, filename) {
            context.state.imageFile = filename;
        },
        removeProfileImage(context) {
            return imageRepository.removeImage({
                type: 'user',
                parent_id: context.state.userId
            }).then(() => {
                context.state.imageFile = null;
            });
        },
        // check if token still works, get user image
        ping(context) {
            return loginRepository.ping().then((response) => {
                context.state.imageFile = response.data.imageFile;
            }).catch(() => {
                context.commit('logout');
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