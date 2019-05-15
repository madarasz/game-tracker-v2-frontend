import Vue from 'vue';
import Vuex from 'vuex';

import { login } from './modules/login';
import { toaster } from './modules/toaster';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        login, toaster
    }
});