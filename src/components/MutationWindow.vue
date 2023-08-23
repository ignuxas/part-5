<template>
    <div id="MutationWindow" :class="(getShowMutateWindow ? '':'hidden ') + 'flex items-center justify-center fixed w-[100vw] h-[100vh] top-0 left-0 z-10'">
        <div class="relative p-6 bg-white z-20 ">
            <div v-if="getType === 'structures'"> <!-- Type selection menu -->
                <h1 class="text-2xl pb-6 text-center">Sukurti struktūrą</h1>
                <div class="flex gap-2 text-white">
                    <button class="p-6 bg-secondary" @click="setType('departments')">Skyrius</button>
                    <button class="p-6 bg-secondary" @click="setType('divisions')">Padalinys</button>
                    <button class="p-6 bg-secondary" @click="setType('groups')">Grupė</button>
                    <button class="p-6 bg-secondary" @click="setType('offices')">Ofisas</button>
                </div>
            </div>
            <component v-else :is="getType" />
        </div>
        <div @click="toggleMutateWindow(false)" class="absolute top-0 bg-black bg-opacity-30 left-0 w-[100vw] h-[100vh]"></div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import companies from './modals/companies.vue';
import users from './modals/users.vue';
import offices from './modals/offices.vue';
import divisions from './modals/divisions.vue';
import departments from './modals/departments.vue';
import groups from './modals/groups.vue';
import employees from './modals/employees.vue';

export default {
    name: 'MutationWindow',
    components: {
        companies,
        users,
        offices,
        divisions,
        departments,
        groups,
        employees
    },
    computed: {
        ...mapGetters('modalModule', [
            'getShowMutateWindow', 
            'getEditMode', 
            'getType',]),
    },
    methods: {
        ...mapMutations('modalModule', [
            'toggleMutateWindow', 
            'setType']),
    }
};
</script>

<style scoped>
#MutationWindow{
    transition: all 0.2s ease;
}
.hidden{
    opacity: 0;
    pointer-events: none;
    display: flex;
}
</style>