<template>
    <div>
        <div class="flex flex-col">
            <div class="w-[100%] h-20 text-black text-opacity-90 text-6xl font-light leading-10">Struktūra</div> <!-- Header -->
            <div id="UtilityBar" v-if="permissions.edit_structure" class="flex gap-8 text-white items-center">
                <button class="w-20 h-14 relative bg-sky-700 rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'plus']" /></button>
                <span class="text-black text-xl">Sukurti naują struktūrą</span>
            </div>
            <table class="shadow mt-8">
                <tr class="border-gray_light border-b-2">
                    <th class="float-left p-4">Pavadinimas</th>
                    <th class="text-left">Tipas</th>
                    <th v-if="permissions.delete_structure || permissions.edit_structure">Veiksmai</th>
                </tr>
                <tr v-for="tile in tiles" class="bgdarkgrayhover border-gray_light border-b-2">
                    <td class="p-4">{{ tile.name }}</td>
                    <td>{{ tile.type }}</td>
                    <td class="text-center" v-if="permissions.delete_structure || permissions.edit_structure">
                        <button v-if="permissions.edit_structure" @click="openMutateWindow(tile.typeEng, tile, true)" class="w-8 h-8 m-2 relative bg-secondary text-white rounded-3xl shadow" ><font-awesome-icon :icon="['fas', 'pen']" /></button>
                        <button v-if="permissions.delete_structure" @click="openDeleteWindow(tile.typeEng, tile)" class="w-8 h-8 m-2 relative bg-secondary text-white rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'trash']" /></button>
                    </td>
                </tr>
            </table>
        </div>
    </div>

</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'Structure',
    async mounted() {
        this.$api.getCompanies();
        this.$api.getOffices();
        this.$api.getDepartments();
        this.$api.getDivisions();
        this.$api.getGroups();
    },
    computed: {
        ...mapGetters('items', ['getStructure', 'getCurrentItem']),
        ...mapGetters('user', ['permissions']),

        tiles:function(){
            var tiles = [];
            for (const [key, value] of Object.entries(this.getStructure)) { // key = companies, value = state.companies
                for (const [key2, value2] of Object.entries(value)) { // key2 = items, value2 = state.companies.items
                    tiles.push({
                        // push everything
                        ...value2,
                        typeEng: value2.collectionName, //collectionName
                        type: key
                    });
                }
            }
            return tiles;
        },
    },
    methods: {
        ...mapMutations('mutate', ['toggleMutateWindow', 'toggleDeleteWindow', 'setType', 'setEditMode']),
        ...mapMutations('items', ['setItem']),

        openMutateWindow(typeEng, item, editMode=false) {
            console.log(typeEng)

            if(item) this.setItem(item);
            this.setType(typeEng);
            this.setEditMode(editMode);
            this.toggleMutateWindow(true);
        },
        openDeleteWindow(typeEng, item) {
            this.setType(typeEng);
            this.setItem(item);
            this.toggleDeleteWindow(true);
        }
    }
}
</script>