import Vue from 'vue';
import VueX from 'vuex';

import page from './modules/page';
import items from './modules/items';
import user from './modules/user';
import mutate from './modules/mutate';
import general from './modules/general';

import generalAPI from './plugins/general';
import companiesAPI from './plugins/companies';
import officesAPI from './plugins/offices';
import divisionsAPI from './plugins/divisions';
import groupsAPI from './plugins/groups';
import departmentsAPI from './plugins/departments';
import userAPI from './plugins/user';
import employeesAPI from './plugins/employees';

Vue.use(VueX);

export default new VueX.Store({
    modules: {
        page,
        items,
        user, 
        mutate,
        general,
    },
    plugins: [
        generalAPI,
        companiesAPI,
        officesAPI,
        divisionsAPI,
        groupsAPI,
        departmentsAPI,
        userAPI,
        employeesAPI,
    ],
});