<template>
    <div> <!-- Employees -->
        <h1 v-if="getEditMode" class="text-2xl">Readaguoti kontaktą</h1>
        <h1 v-else class="text-2xl">Įvesti naują kontaktą</h1>
        <div class="flex gap-10">
            <div>
                <div class="pt-2 w-64">
                    <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                        <label for="name" class="self-start p-1">Vardas <span class="text-red">*</span></label>
                        <input type="text" v-model="name" id="name" class="w-full h-8 p-2 bg-gray_light rounded" />
                    </div>
                    <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                        <label for="surname" class="self-start p-1">Pavardė <span class="text-red">*</span></label>
                        <input type="text" v-model="surname" id="surname" class="w-full h-8 p-2 bg-gray_light rounded" />
                    </div>
                    <div class="flex py-2 flex-col items-center text-gray text-left text-xs">
                        <label for="position" class="self-start p-1">Pozicija <span class="text-red">*</span></label>
                        <input type="text" v-model="position" id="position" class="w-full h-8 p-2 bg-gray_light rounded" />
                    </div>
                    <div class="py-2">
                        <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                            <label for="photo" class="self-start p-1">Nuotrauka</label>
                            <input type="file" id="photo" @change="manageFiles" class=" w-full h-8 p-[5px] bg-gray_light rounded" />
                        </div>
                    </div>
                </div>
                <div class="pt-4 pb-2">
                    <h2>Kontaktinė informacija</h2>
                    <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                        <label for="email" class="self-start p-1">Elektroninis paštas <span class="text-red">*</span></label>
                        <input type="email" v-model="email" id="email" class="w-full h-8 p-2 bg-gray_light rounded" />
                    </div>
                    <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                        <label for="phone_number" class="self-start p-1">Telefono numeris</label>
                        <input type="text" v-model="phone_number" id="phone_number" class="w-full h-8 p-2 bg-gray_light rounded" />
                    </div>
                </div>
            </div>
            <div>
                <h1 class="text-center">Įmonės detalės</h1>
                <div class="py-2"> 
                    <p class="text-xs p-1 text-gray">Įmonė <span class="text-red">*</span></p>
                    <select name="company" id="Company" v-model="structureData.company_id" class="w-72 h-9 p-2 bg-white rounded border border-neutral-200 shadow text-xs" >
                        <option v-for="company in getCompanies.items" :key="company.id" :value="company.id" >{{ company.name }}</option>
                    </select>
                </div>
                <div class="py-2"> 
                    <p class="text-xs p-1 text-gray">Padalinys</p>
                    <select name="department" id="Department" v-model="structureData.department_id" class="w-72 h-9 p-2 bg-white rounded border border-neutral-200 shadow text-xs" >
                        <option v-for="department in getDepartments.items" :key="department.id" :value="department.id">{{ department.name }}</option>
                    </select>
                </div>
                <div class="py-2">
                    <p class="text-xs p-1 text-gray">Skyrius <span class="text-red">*</span></p>
                    <select name="division" id="Division" v-model="structureData.division_id"  class="w-72 h-8 p-2 bg-white rounded border border-neutral-200 shadow text-xs" >
                        <option v-for="division in getDivisions.items" :key="division.id" :value="division.id">{{ division.name }}</option>
                    </select>
                </div>
                <div class="py-2">
                    <p class="text-xs p-1 text-gray">Grupė</p>
                    <select name="group" id="Group" v-model="structureData.group_id" class="w-72 h-8 p-2 bg-white rounded border border-neutral-200 shadow text-xs" >
                        <option v-for="group in getGroups.items" :key="group.id" :value="group.id">{{ group.name }}</option>
                    </select>
                </div>
                <div class="py-2">
                    <p class="text-xs p-1 text-gray">Ofisas <span class="text-red">*</span></p>
                    <select name="office" id="Office" v-model="structureData.office_id"  class="w-72 h-8 p-2 bg-white border rounded border-neutral-200 shadow text-xs" >
                        <option v-for="office in getOffices.items" :key="office.id" :value="office.id">{{ office.name }}</option>
                    </select>
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
    data() {
        return {
            name: '',
            surname: '',
            position: '',
            email: '',
            phone_number: '',
            photo: null,
            structureData: {
                company_id: '',
                department_id: '',
                division_id: '',
                group_id: '',
                office_id: '',
            },
        }
    },

    watch: {
        getShowMutateWindow(show) {
            if (this.getEditMode) {
                if (show) {
                    const item = this.getCurrentItem
                    
                    this.name = item.name
                    this.surname = item.surname
                    this.position = item.position
                    this.email = item.email
                    this.phone_number = item.phone_number
                    this.photo = item.photo
                    this.structureData = {
                        company_id: item.company_id,
                        department_id: item.department_id,
                        division_id: item.division_id,
                        group_id: item.group_id,
                        office_id: item.office_id,
                    }
                }
            } else { this.resetData(); }
        }
    },
    computed: {
        ...mapGetters('items', ['getCompanies', 'getDepartments', 'getDivisions', 'getGroups', 'getOffices', 'getCurrentItem']),
        ...mapGetters('modalModule', ['getEditMode', 'getShowMutateWindow']),
    },
    methods: {
        ...mapActions('items', ['createEmployee', 'updateEmployee']),
        ...mapActions('general', ['validateInput']),
        ...mapMutations('modalModule', ['toggleMutateWindow']),

        resetData() {
            this.name = ''
            this.surname = ''
            this.position = ''
            this.email = ''
            this.phone_number = ''
            this.photo = ''
            this.structureData = {
                company_id: '',
                department_id: '',
                division_id: '',
                group_id: '',
                office_id: '',
            }
        },

        manageFiles(e) {
            const files = e.target.files
            this.photo = files[0]
        },

        async submit() {
            const validationIds = ['name', 'surname', 'position', 'email', 'Company', 'Division', 'Office']
            const validationPassed = await this.validateInput(validationIds)
            if(!validationPassed) return
            let data = {
                ...this.structureData,
                name: this.name,
                surname: this.surname,
                position: this.position,
                email: this.email,
                phone_number: this.phone_number,
                photo: this.photo,
            }
            if ( this.getEditMode ) {
                data.id = this.getCurrentItem.id
                this.updateEmployee(data)
            } else { this.createEmployee(data) }
            this.toggleMutateWindow()
        }
    },

    mounted() {
        if ( this.getEditMode ) {
            const item = this.getCurrentItem
            this.name = item.name
            this.surname = item.surname
            this.position = item.position
            this.email = item.email
            this.phone_number = item.phone_number
            this.photo = item.photo
            this.structureData = {
                company_id: item.company_id,
                department_id: item.department_id,
                division_id: item.division_id,
                group_id: item.group_id,
                office_id: item.office_id,
            }
        } else { this.resetData(); }
    }
}

</script>