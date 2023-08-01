<template>
    <div id="DeleteWindow" :class="(getShowDeleteWindow ? '':'hidden ') + 'flex items-center justify-center fixed w-[100vw] h-[100vh] top-0 left-0 z-10'">
        <div v-if="getType === 'user'" class="relative p-6 bg-white text-gray z-20 shadow-lg">
            <h1 class="text-lg pb-6 text-black">Ar tikrai norite ištrinti šią admin paskyrą?</h1>
            <p>Vardas: {{ getUser.name }}</p>
            <p>El. paštas: {{ getUser.email }}</p>
            <div class="flex gap-6 pt-8 text-primary float-right">
                <button @click="toggleDeleteWindow()" class="hover:text-secondary">NE</button>
                <button @click="$api.reqDelete(getType, getUser.id); toggleDeleteWindow()" class="hover:text-secondary">TAIP</button>
            </div>
        </div>
        <div v-else-if="getType === 'employees'" class="relative p-6 bg-white text-gray z-20 shadow-lg">
            <h1 class="text-lg pb-6 text-black">Ar tikrai norite ištrinti kontaktą?</h1>
            <p>Vardas ir pavardė: {{ getCurrentItem.name }} {{ getCurrentItem.surname }}</p>
            <p>Pozicija: {{ getCurrentItem.position }}</p>
            <div class="flex gap-6 pt-8 text-primary float-right">
                <button @click="toggleDeleteWindow()" class="hover:text-secondary">NE</button>
                <button @click="$api.reqDelete(getCurrentItem.id, getType); toggleDeleteWindow()" class="hover:text-secondary">TAIP</button>
            </div>
        </div>
        <div v-else class="relative p-6 bg-white text-gray z-20 shadow-lg">
            <h1 class="text-lg pb-6 text-black">Ar tikrai norite ištrinti 
                <span v-if="getType==='companies'">Įmonę?</span>
                <span v-else-if="getType==='offices'">Ofisą?</span>
                <span v-else-if="getType==='departments'">Skyrių?</span>
                <span v-else-if="getType==='divisions'">Padalinį?</span>
                <span v-else-if="getType==='groups'">Grupę?</span>
                </h1>
            <p>Pavadinimas: {{ getCurrentItem.name }}</p>
            <div class="flex gap-6 pt-8 text-primary float-right">
                <button @click="toggleDeleteWindow()" class="hover:text-secondary">NE</button>
                <button @click="{ 
                    $api.reqDelete(getCurrentItem.id, getType)
                    toggleDeleteWindow()
                    }" class="hover:text-secondary">TAIP</button>
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
        ...mapGetters('items', ['getCurrentItem', 'getUser']),
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