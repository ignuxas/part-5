<template>
    <div class="flex flex-col">
        <div class="w-[100%] h-20 text-black text-opacity-90 text-6xl font-light leading-10">Įmonės</div> <!-- Header -->
        <div id="UtilityBar" v-if="permissions.edit_companies" class="flex gap-8 text-white items-center ">
            <button @click="toggleMutateWindowFunc('companies', false)"  class="w-20 h-14 relative bg-sky-700 rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'plus']" /></button>
            <span class="text-black text-xl">Pridėti naują įmonę</span>
        </div>
        <div class="w-64 h-6 my-4 text-black text-opacity-90 text-base font-normal leading-normal tracking-tight"> <!-- Total items -->
            <span>Iš viso rasta: </span>
            <span class="font-bold">{{ getCompanies.totalItems }} įmonių</span>
        </div>
        <table class="shadow">
            <tr class="border-gray_light border-b-2">
                <th class="float-left p-4">Pavadinimas</th>
                <th v-if="permissions.delete_companies || permissions.edit_companies">Veiksmai</th>
            </tr>
            <tr v-for="company in getCompanies.items" class="bgdarkgrayhover border-gray_light border-b-2">
                <td class="p-4">{{ company.name }}</td>
                <td class="text-center" v-if="permissions.delete_companies || permissions.edit_companies">
                    <button v-if="permissions.edit_companies" @click="toggleMutateWindowFunc('companies', true, company)" class="w-8 h-8 m-2 relative bg-secondary text-white rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'pen']" /></button>
                    <button v-if="permissions.delete_companies" @click="toggleDeleteWindowFunc('companies', company)" class="w-8 h-8 m-2 relative bg-secondary text-white rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'trash']" /></button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'Contacts',
    mounted() {
        this.getCompaniesServ();
    },
    computed: {
        ...mapGetters('items', ['getCompanies']),
        ...mapGetters('user', ['permissions']),
    },
    methods: {
        ...mapMutations('modalModule', [
            'toggleMutateWindow', 
            'toggleDeleteWindow', 
            'setType', 
            'setEditMode']),
        ...mapMutations('items', ['setItem']),

        ...mapActions('items', [
            'getCompaniesServ',
        ]),

        toggleMutateWindowFunc(type, editMode, item) {
            if(item) this.setItem(item);
            this.setEditMode(editMode);
            this.setType(type);
            this.toggleMutateWindow(true);
        },
        toggleDeleteWindowFunc(type, item) {
            this.setItem(item);
            this.setType(type);
            this.toggleDeleteWindow(true);
        }
    }
};
</script>