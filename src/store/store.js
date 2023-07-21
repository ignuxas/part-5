import Vue from 'vue';
import VueX from 'vuex';

import page from './modules/page';
import items from './modules/items';
import user from './modules/user';
import mutate from './modules/mutate';

Vue.use(VueX);

export default new VueX.Store({
    modules: {
        page,
        items,
        user, 
        mutate,
    },
});