<template>
    <div class="flex flex-col">
        <div class="w-[100%] h-20 text-black text-opacity-90 text-6xl font-light leading-10">Kontaktų sistema</div> <!-- Header -->
        <div id="UtilityBar" class="flex gap-8 text-white">
            <Search />
            <button @click="toggleTableView()" class="w-20 h-14 relative bg-sky-700 rounded-3xl shadow text-xl">
                <font-awesome-icon v-if= "isTableView" :icon="['fas', 'th']" />
                <font-awesome-icon v-else :icon="['fas', 'list']" />
            </button>
            <button v-if="permissions.edit_employees" @click="toggleMutateWindowFunc"  class="w-20 h-14 relative bg-sky-700 rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'plus']" /></button>
        </div>
        <div class="w-64 h-6 my-4 text-black text-opacity-90 text-base font-normal leading-normal tracking-tight"> <!-- Total items -->
            <span>Iš viso rasta: </span>
            <span class="font-bold">{{ getEmployees.totalItems }} kontaktų</span>
        </div>
        <FilterBar /> <!-- FilterBar -->
        <EmployeeCards/> <!-- Content -->
        <Pagination /> <!-- Pagination -->
    </div>
</template>

<script>
import EmployeeCards from '../components/EmployeeCards.vue';
import Search from '../components/Search.vue';
import FilterBar from '../components/FilterBar.vue';
import Pagination from '../components/Pagination.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';


export default {
    name: 'Contacts',
    components: {
        EmployeeCards,
        Search,
        FilterBar,
        Pagination
    },
    mounted() {
        this.getEmployeesServ();
        this.getCompaniesServ();
        this.getOffices();
        this.getDepartments();
        this.getDivisions();
        this.getGroups();
    },
    computed: {
        ...mapGetters('items', ['getEmployees']),
        ...mapGetters('user', ['permissions']),
        ...mapGetters('page', [
            'isTableView',
            'getCurrentPage',
            'getPostsPerPage',
            'getTotalPages'
        ]),
    },
    methods: {
        ...mapMutations('page', [
            'toggleTableView',
            'setPostsPerPage'
        ]),
        ...mapMutations('modalModule', [
            'toggleMutateWindow',  
            'setEditMode',
            'setType'
        ]),

        ...mapActions('items', [
            'getEmployeesServ',
            'getCompaniesServ',
            'getOffices',
            'getDepartments',
            'getDivisions',
            'getGroups',
        ]),
        toggleMutateWindowFunc() {
            this.setType('employees');
            this.toggleMutateWindow();
            this.setEditMode(false);
        },
    }
};
</script>