<template>
    <div>
        <h1 v-if="getEditMode" class="text-2xl">Readaguoti ofisą</h1>
        <h1 v-else class="text-2xl">Įvesti naują ofisą</h1>
        <div class="flex gap-10">
            <div class="pt-2 w-64">
                <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                    <label for="name" class="self-start p-1">Pavadinimas <span class="text-red">*</span></label>
                    <input type="text" v-model="officeData.name" id="name" class="w-full h-8 p-2 bg-gray_light rounded" />
                </div>
                <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                    <label for="street" class="self-start p-1">Gatvė <span class="text-red">*</span></label>
                    <input type="text" v-model="officeData.street" id="street" class="w-full h-8 p-2 bg-gray_light rounded" />
                </div>
                <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                    <label for="street_number" class="self-start p-1">Gatvės numeris <span class="text-red">*</span></label>
                    <input type="text" v-model="officeData.street_number" id="street_number" class="w-full h-8 p-2 bg-gray_light rounded" />
                </div>
                <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                    <label for="city" class="self-start p-1">Miestas <span class="text-red">*</span></label>
                    <input type="text" v-model="officeData.city" id="city" class="w-full h-8 p-2 bg-gray_light rounded" />
                </div>
                <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                    <label for="country" class="self-start p-1">Šalis <span class="text-red">*</span></label>
                    <input type="text" v-model="officeData.country" id="country" class="w-full h-8 p-2 bg-gray_light rounded" />
                </div>
            </div>
            <div>
                <h1 class="text-center">Įmonės</h1>
                <div class="py-2"> 
                    <div class="flex p-2" v-for="company in getCompanies.items">
                        <input type="checkbox" :value="company.id" v-model="officeData.companies" class="mr-4"> <span>{{ company.name }}</span>
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
    street: '',
    street_number: '',
    city: '',
    country: '',
    companies: [],
}

export default{
    data() {
        return {
            officeData: defaultData,
        }
    },
    watch: {
        getShowMutateWindow(show) {
            if(this.getEditMode) {
                if (show) {
                    const item = this.getCurrentItem;

                    this.officeData = {
                        name: item.name,
                        street: item.street,
                        street_number: item.street_number,
                        city: item.city,
                        country: item.country,
                        companies: item.relations.companies.map(company => company.company_id),
                    }
                }
            } else { this.officeData = defaultData; }

        },
    },
    computed: {
        ...mapGetters('items', ['getOffices', 'getCompanies', 'getCurrentItem']),
        ...mapGetters('modalModule', ['getEditMode', 'getShowMutateWindow']),
    },
    methods: {
        ...mapMutations('modalModule', ['toggleMutateWindow']),
        ...mapActions('items', ['createOffice']),
        ...mapActions('general', ['updateStructure', 'validateInput']),
        async submit() {
            const validationIds = ['name', 'street', 'street_number', 'city', 'country'];
            const validationPassed = await this.validateInput(validationIds);
            if(!validationPassed) return;

            let data = this.officeData;
            if (this.getEditMode) {
                data.id = this.getCurrentItem.id;
                this.updateStructure({
                    data,
                    relations: data.companies,
                    type: 'offices',
                    item: this.getCurrentItem,
                });
            } else {
                this.createOffice({
                    office: data,
                    companies: data.companies,
                });
            }
            
            this.toggleMutateWindow();
            this.officeData = defaultData;
        }
    },
    mounted() {
        if (this.getEditMode) {
            const item = this.getCurrentItem;

            this.officeData = {
                name: item.name,
                street: item.street,
                street_number: item.street_number,
                city: item.city,
                country: item.country,
                companies: item.relations.companies.map(company => company.company_id),
            }
        } else {
            this.officeData = defaultData;
        }
    }
}

</script>