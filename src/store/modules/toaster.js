export const toaster = {
    namespaced: true,
    state: {
        showToaster: false,
        showCloseButton: false,
        color: 'error',
        timeout: 2000,
        text: ''
    },
    getters: {
    },
    actions: {
    },
    mutations: {
        showError(state, message) {
            state.color = 'error';
            state.text = message;
            state.showToaster = true;
        },
        showConfirm(state, message) {
            state.color = 'orange';
            state.text = message;
            state.showToaster = true;
        }
    }
}