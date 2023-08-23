<template>
    <div>
        <h1 v-if="getEditMode" class="text-2xl">Readaguoti skyrių</h1>
        <h1 v-else class="text-2xl">Įvesti naują skyrių</h1>
        <div class="flex gap-10">
            <div class="pt-2 w-64">
                <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                    <label for="name" class="self-start p-1">Pavadinimas <span class="text-red">*</span></label>
                    <input type="text" v-model="departmentData.name" id="name" class="w-full h-8 p-2 bg-gray_light rounded" />
                </div>
            </div>
            <div>
                <h1 class="text-center">Padaliniai</h1>
                <div class="py-2"> 
                    <div class="flex p-2" v-for="division in getDivisions.items">
                        <input type="checkbox" :value="division.id" v-model="departmentData.divisions" class="mr-4"> <span>{{ division.name }}</span>
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
    divisions: [],
}

export default {
    data() {
        return {
            departmentData: defaultData,
        }
    },
    watch: {
        getShowMutateWindow(show) {
            if (this.getEditMode) {
                if (show) {
                    const item = this.getCurrentItem

                    this.departmentData = {
                        name: item.name,
                        divisions: item.relations.divisions.map(division => division.division_id),
                    }
                }
            } else { this.departmentData = defaultData; }
        }
    },
    computed: {
        ...mapGetters('items', ['getDivisions', 'getDepartments', 'getCurrentItem']),
        ...mapGetters('modalModule', ['getEditMode', 'getShowMutateWindow']),
    },
    methods: {
        ...mapMutations('modalModule', ['toggleMutateWindow']),
        ...mapActions('items', ['createDepartment']),
        ...mapActions('general', ['updateStructure', 'validateInput']),
        async submit() {
            const validationIds = ['name']
            const validationPassed = await this.validateInput(validationIds)
            if(!validationPassed) return

            let data = this.departmentData
            if ( this.getEditMode ) {
                data.id = this.getCurrentItem.id
                this.updateStructure({ 
                    data,
                    relations: data.divisions,
                    type: 'departments',
                    item: this.getCurrentItem,
                })
            } else {
                this.createDepartment({
                    department: data,
                    divisions: data.divisions,
                })
            }
        }
    },
    mounted() {
        if ( this.getEditMode ) {
            const item = this.getCurrentItem
            this.departmentData = {
                name: item.name,
                divisions: item.relations.divisions.map(division => division.division_id),
            }
        } else { this.departmentData = defaultData;}
    }
}

</script>