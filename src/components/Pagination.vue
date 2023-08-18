<template>
    <div class="relative flex p-6 gap-6 items-center justify-center width=[100%] text-white" v-if="getTotalPages !== 0"> <!-- Pagination -->
        <button @click="decrementPage" class="w-72 h-9 px-6 bg-secondary rounded justify-between items-center inline-flex"><font-awesome-icon :icon="['fas', 'angles-left']" /> PRAEITAS PUSLAPIS</button>
        <span class="text-black">{{ getCurrentPage }} / {{ getTotalPages }}</span>
        <button @click="incrementPage" class="w-72 h-9 px-6 bg-secondary rounded justify-between items-center flex">KITAS PUSLAPIS <font-awesome-icon :icon="['fas', 'angles-right']" /></button>
        <select v-model="perPage" class="absolute right-0 h-9 text-black bg-inherit border-gray_light border-2">
            <option v-for="option in perPageOptions" :key="option" :value="option">Rodyti {{ option }} įrašų</option>
        </select>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'Pagination',
    data() {
        return {
            perPage: 25,
            perPageOptions: [5, 10, 25, 50, 100, 2000]
        }
    },
    watch: {
        perPage() {
            this.setPostsPerPage(this.perPage);
            this.setCurrentPage(1);
            this.$store.commit('page/setCurrentPage', 1);
            this.getEmployeesServ();
        }
    },
    methods: {
        incrementPage() {
            this.$store.commit('page/incrementPage');
            this.getEmployeesServ();
        },
        decrementPage() {
            this.$store.commit('page/decrementPage');
            this.getEmployeesServ();
        },
        ...mapMutations('page', [
            'setPostsPerPage',
            'setCurrentPage',
        ]),
        ...mapActions('items', ['getEmployeesServ']),
    },
    computed: {
        ...mapGetters('page', ['getCurrentPage', 'getTotalPages']),
    }
};
</script>