<template>
    <div id="DeleteWindow" :class="(getShowDeleteWindow ? '':'hidden ') + 'flex items-center justify-center fixed w-[100vw] h-[100vh] top-0 left-0 z-10'">
        <div v-if="getType === 'company'" class="relative p-6 bg-white text-gray z-20 shadow-lg">
            <h1 class="text-lg pb-6 text-black">Ar tikrai norite ištrinti Įmonę?</h1>
            <p>Pavadinimas: {{ getCompany.name }}</p>
            <div class="flex gap-6 pt-8 text-primary float-right">
                <button @click="toggleDeleteWindow()" class="hover:text-secondary">NE</button>
                <button @click="$api.deleteCompany(getCompany.id); toggleDeleteWindow()" class="hover:text-secondary">TAIP</button>
            </div>
        </div>
        <div v-else class="relative p-6 bg-white text-gray z-20 shadow-lg">
            <h1 class="text-lg pb-6 text-black">Ar tikrai norite ištrinti kontaktą?</h1>
            <p>Vardas ir pavardė: {{ getEmployee.name }} {{ getEmployee.surname }}</p>
            <p>Pozicija: {{ getEmployee.position }}</p>
            <div class="flex gap-6 pt-8 text-primary float-right">
                <button @click="toggleDeleteWindow()" class="hover:text-secondary">NE</button>
                <button @click="$api.deleteEmployee(getEmployee.id); toggleDeleteWindow()" class="hover:text-secondary">TAIP</button>
            </div>
        </div>
        <div @click="toggleDeleteWindow()" class="absolute top-0 bg-black bg-opacity-30 left-0 w-[100vw] h-[100vh]"></div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'DeleteWindow',
    computed: {
        ...mapGetters('items', ['getEmployee', 'getCompany']),
        ...mapGetters('mutate', ['getShowDeleteWindow', 'getType']),
    },
    methods: {
        ...mapMutations('mutate', ['toggleDeleteWindow']),
    }
};
</script>

<style scoped>

#DeleteWindow{
    display: flex;
    opacity: 1;
    transition: all .2s ease;
}

.hidden{
    display: flex !important;
    opacity: 0 !important;
    pointer-events: none;
}
</style>