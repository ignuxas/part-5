<template>
    <div>
        <h1 v-if="getEditMode" class="text-2xl">Readaguoti įmonę</h1>
        <h1 v-else class="text-2xl">Įvesti naują įmonę</h1>
        <div class="flex gap-10">
            <div>
                <div class="pt-2 w-64">
                    <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                        <label for="name" class="self-start p-1">Pavadinimas <span class="text-red">*</span></label>
                        <input type="text" v-model="name" id="name" class="w-full h-8 p-2 bg-gray_light rounded" />
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

export default {
    name: 'Companies',
    data() {
        return {
            name: '',
        }
    },
    watch: {
        getShowMutateWindow(val) {
            if (this.getEditMode) {
                if (val) this.name = this.getCurrentItem.name;
            } else {
                this.name = '';
            }
        }
    },
    computed: { 
        ...mapGetters('modalModule', ['getShowMutateWindow', 'getType', 'getEditMode']),
        ...mapGetters('items', ['getCurrentItem']),
    },
    methods: {
        ...mapMutations('modalModule', ['toggleMutateWindow']),
        ...mapMutations('items', ['setCurrentItem']),
        ...mapActions('items', ['createCompany', 'updateCompany']),
        ...mapActions('general', ['validateInput']),

        async submit() {
            const validationIds = ['name']
            const validationPassed = await this.validateInput(validationIds)
            if(!validationPassed) return
            if(this.getEditMode) {
                this.updateCompany({
                    id: this.getCurrentItem.id,
                    name: this.name,
                });
            } else {
                this.createCompany({
                    name: this.name,
                });
            }
            this.toggleMutateWindow(false);
        }
    },
    mounted() { // on load
        if (this.getEditMode) {
            this.name = this.getCurrentItem.name;
        } else {
            this.name = '';
        }
    },
};

</script>