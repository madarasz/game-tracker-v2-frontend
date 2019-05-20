import Vue from 'vue';
import Vuex from 'vuex';

import { login } from './modules/login';
import { toaster } from './modules/toaster';
import { groups } from './modules/groups';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        login, toaster, groups
    }
});