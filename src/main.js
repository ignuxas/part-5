import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Routes from './routes';
import store from './store/store';
import './assets/tailwind.css';

import vueDebounce from 'vue-debounce'

//font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFilter, faList, faMagnifyingGlass, faAnglesLeft, faAnglesRight, faTh, faPlus, faPen, faTrash, faUser, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import api from './plugins/api';

library.add(faMagnifyingGlass, 
            faFilter, 
            faList, 
            faPlus,
            faAnglesLeft,
            faAnglesRight, 
            faPen,
            faTrash,
            faUser,
            faCircleCheck,
            faCircleXmark,
            faTh)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueRouter);
Vue.use(vueDebounce, {
    defaultTime: '500ms'
})
Vue.use(api, store);

const router = new VueRouter({
    routes: Routes,
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: (h) => h(App),
})
