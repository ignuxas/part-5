<template>
    <div class="flex flex-col">
        <div class="w-[100%] h-20 text-black text-opacity-90 text-6xl font-light leading-10">Kontaktų sistema</div> <!-- Header -->
        <div id="UtilityBar" class="flex gap-8 text-white">
            <Search />
            <button class="w-20 h-14 relative bg-sky-700 rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'filter']" /></button>
            <button @click="toggleTableView()" class="w-20 h-14 relative bg-sky-700 rounded-3xl shadow text-xl">
                <font-awesome-icon v-if= "isTableView" :icon="['fas', 'th']" />
                <font-awesome-icon v-else :icon="['fas', 'list']" />
            </button>
        </div>
        <div class="w-64 h-6 my-4 text-black text-opacity-90 text-base font-normal leading-normal tracking-tight"> <!-- Total items -->
            <span>Iš viso rasta: </span>
            <span class="font-bold">{{ getEmployees.totalItems }} kontaktų</span>
        </div>
        <FilterBar /> <!-- FilterBar -->
        <EmployeeCards/> <!-- Content -->
        <div class="relative flex p-6 gap-6 items-center justify-center width=[100%] text-white"> <!-- Pagination -->
            <button @click="decrementPage" class="w-72 h-9 px-6 bg-secondary rounded justify-between items-center inline-flex"><font-awesome-icon :icon="['fas', 'angles-left']" /> PRAEITAS PUSLAPIS</button>
            <span class="text-black">{{ getCurrentPage }} / {{ getTotalPages }}</span>
            <button @click="incrementPage" class="w-72 h-9 px-6 bg-secondary rounded justify-between items-center flex">KITAS PUSLAPIS <font-awesome-icon :icon="['fas', 'angles-right']" /></button>
            <select v-model="perPage" class="absolute right-0 h-9 text-black bg-inherit border-gray_light border-2">
                <option v-for="option in perPageOptions" :key="option" :value="option">Rodyti {{ option }} įrašų</option>
            </select>
        </div>
    </div>
</template>

<script>
import EmployeeCards from '../components/EmployeeCards.vue';
import Search from '../components/Search.vue';
import FilterBar from '../components/FilterBar.vue';
import { mapGetters, mapMutations } from 'vuex';


export default {
    name: 'Contacts',
    data() {
        return {
            perPage: 25,
            perPageOptions: [5, 10, 25, 50, 100, 2000]
        }
    },
    watch: {
        perPage() {
            this.setPostsPerPage(this.perPage);
            this.$store.commit('page/setCurrentPage', 1);
            this.$api.getEmployees();
        }
    },
    components: {
        EmployeeCards,
        Search,
        FilterBar
    },
    mounted() {
        this.$api.getEmployees();
        this.$api.getCompanies(true);
        this.$api.getOffices(true);
        this.$api.getDepartments(true);
        this.$api.getDivisions(true);
        this.$api.getGroups(true);
        this.$api.getOffices(true);
    },
    computed: {
        ...mapGetters('items', ['getEmployees']),
        ...mapGetters('page', ['isTableView',
                                'getCurrentPage',
                                'getPostsPerPage',
                                'getTotalPages']),
    },
    methods: {
        incrementPage() {
            if(this.getCurrentPage < this.getTotalPages){
                this.$store.commit('page/incrementPage');
                this.$api.getEmployees();
            }
        },
        decrementPage() {
            if(this.getCurrentPage > 1){
                this.$store.commit('page/decrementPage');
                this.$api.getEmployees();
            }
        },
        ...mapMutations('page', ['toggleTableView',
                                 'setPostsPerPage'
                                ])
    }
};
</script>