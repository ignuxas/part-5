<template>
    <div>
        <h1 v-if="getEditMode" class="text-2xl">Readaguoti Padalinį</h1>
        <h1 v-else class="text-2xl">Įvesti naują padalinį</h1>
        <div class="flex gap-10">
            <div class="pt-2 w-64">
                <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                    <label for="name" class="self-start p-1">Pavadinimas <span class="text-red">*</span></label>
                    <input type="text" v-model="divisionData.name" id="name" class="w-full h-8 p-2 bg-gray_light rounded" />
                </div>
            </div>
            <div>
                <h1 class="text-center">Ofisai</h1>
                <div class="py-2"> 
                    <div class="flex p-2" v-for="office in getOffices.items">
                        <input type="checkbox" :value="office.id" v-model="divisionData.offices" class="mr-4"> <span>{{ office.name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center items-center w-100%">
            <button v-if="getEditMode" class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Atnaujinti</button>
            <button v-else class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Pridėti</button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

const defaultData = {
    name: '',
    offices: [],
}

export default{
    data() {
        return {
            divisionData: defaultData,
        }
    },
    watch: {
        getShowMutateWindow(show) {
            if (this.getEditMode) {
                if (show) {
                    const item = this.getCurrentItem

                    this.divisionData = {
                        name: item.name,
                        offices: item.relations.offices.map(office => office.office_id),
                    }
                }
            } else { this.divisionData = defaultData; }
        }
    },
    computed: {
        ...mapGetters('items', ['getOffices', 'getDivisions', 'getCurrentItem']),
        ...mapGetters('modalModule', ['getEditMode', 'getShowMutateWindow']),
    },
    methods: {
        ...mapMutations('modalModule', ['toggleMutateWindow']),
        ...mapActions('items', ['createDivision']),
        ...mapActions('general', ['updateStructure', 'validateInput']),
        async submit() {
            const validationIds = ['name']
            const validationPassed = await this.validateInput(validationIds)
            if(!validationPassed) return

            let data = this.divisionData;
            if ( this.getEditMode ) {
                data.id = this.getCurrentItem.id;
                this.updateStructure({
                    data,
                    relations: data.offices,
                    type: 'divisions',
                    item: this.getCurrentItem,
                })
            } else {
                this.createDivision({
                    division: data,
                    offices: data.offices,
                });
            }
            this.toggleMutateWindow();
        }
    },
    mounted() {
        if ( this.getEditMode ) {
            const item = this.getCurrentItem
            this.divisionData = {
                name: item.name,
                offices: item.relations.offices.map(office => office.office_id),
            }
        } else { this.divisionData = defaultData; }
    }
}


</script>