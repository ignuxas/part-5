<template>
    <div>
        <h1 v-if="getEditMode" class="text-2xl">Readaguoti grupę</h1>
        <h1 v-else class="text-2xl">Įvesti naują grupę</h1>
        <div class="flex gap-10">
            <div class="pt-2 w-64">
                <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                    <label for="name" class="self-start p-1">Pavadinimas <span class="text-red">*</span></label>
                    <input type="text" v-model="groupData.name" id="name" class="w-full h-8 p-2 bg-gray_light rounded" />
                </div>
            </div>
            <div>
                <h1 class="text-center"> Skyriai </h1>
                <div class="py-2"> 
                    <div class="flex p-2" v-for="department in getDepartments.items">
                        <input type="checkbox" :value="department.id" v-model="groupData.departments" class="mr-4"> <span>{{ department.name }}</span>
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
    departments: [],
}

export default {
    data() {
        return {
            groupData: defaultData,
        }
    },
    watch: {
        getShowMutateWindow(show) {
            if (this.getEditMode) {
                if (show) {
                    const item = this.getCurrentItem

                    this.groupData = {
                        name: item.name,
                        departments: item.relations.departments.map(department => department.department_id),
                    }
                }
            } else { this.groupData = defaultData; }
        }
    },
    computed: {
        ...mapGetters('items', ['getDepartments', 'getGroups', 'getCurrentItem']),
        ...mapGetters('modalModule', ['getEditMode', 'getShowMutateWindow']),
    },
    methods: {
        ...mapMutations('modalModule', ['toggleMutateWindow']),
        ...mapActions('items', ['createGroup']),
        ...mapActions('general', ['updateStructure', 'validateInput']),
        async submit() {
            const validationIds = ['name']
            const validationPassed = await this.validateInput(validationIds)
            if(!validationPassed) return

            let data = this.groupData
            if ( this.getEditMode ) {
                data.id = this.getCurrentItem.id
                this.updateStructure({ 
                    data,
                    relations: data.departments,
                    item: this.getCurrentItem,
                    type: 'groups',
                })
            } else {
                this.createGroup({
                    group: data,
                    departments: data.departments,
                })
            }
            this.toggleMutateWindow()
        }
    },
    mounted() {
        if ( this.getEditMode ) {
            const item = this.getCurrentItem
            this.groupData = {
                name: item.name,
                departments: item.relations.departments.map(department => department.department_id),
            }
        } else { this.groupData = defaultData; }
    }
}

</script>