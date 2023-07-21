<template>
    <div id="MutationWindow" :class="(getShowMutateWindow ? '':'hidden ') + 'flex items-center justify-center fixed w-[100vw] h-[100vh] top-0 left-0 z-10'">
        <div class="relative p-6 bg-white z-20 ">
            <div v-if="getType === 'company'">
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
            <div v-else>
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
                            <select name="company" id="Company" v-model="selectedCompany" class="w-72 h-9 p-2 bg-white rounded border border-neutral-200 shadow text-xs" >
                                <option v-for="company in getCompanies.items" :key="company.id" :value="company" :Selected="company.id===getEmployee.company_id?'selected':false">{{ company.name }}</option>
                            </select>
                        </div>
                        <div class="py-2"> 
                            <p class="text-xs p-1 text-gray">Padalinys</p>
                            <select name="department" id="Department" v-model="selectedDepartment" class="w-72 h-9 p-2 bg-white rounded border border-neutral-200 shadow text-xs" >
                                <option v-for="department in getDepartments.items" :key="department.id" :value="department">{{ department.name }}</option>
                            </select>
                        </div>
                        <div class="py-2">
                            <p class="text-xs p-1 text-gray">Skyrius <span class="text-red">*</span></p>
                            <select name="division" id="Division" v-model="selectedDivision"  class="w-72 h-8 p-2 bg-white rounded border border-neutral-200 shadow text-xs" >
                                <option v-for="division in getDivisions.items" :key="division.id" :value="division">{{ division.name }}</option>
                            </select>
                        </div>
                        <div class="py-2">
                            <p class="text-xs p-1 text-gray">Grupė</p>
                            <select name="group" id="Group" v-model="selectedGroup" class="w-72 h-8 p-2 bg-white rounded border border-neutral-200 shadow text-xs" >
                                <option v-for="group in getGroups.items" :key="group.id" :value="group">{{ group.name }}</option>
                            </select>
                        </div>
                        <div class="py-2">
                            <p class="text-xs p-1 text-gray">Ofisas <span class="text-red">*</span></p>
                            <select name="office" id="Office" v-model="selectedOffice"  class="w-72 h-8 p-2 bg-white border rounded border-neutral-200 shadow text-xs" >
                                <option v-for="office in getOffices.items" :key="office.id" :value="office">{{ office.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center items-center w-100%">
                    <button v-if="getEditMode" class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Atnaujinti</button>
                    <button v-else class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Pridėti</button>
                </div>
            </div>
        </div>
        <div @click="toggleMutateWindow(false)" class="absolute top-0 bg-black bg-opacity-30 left-0 w-[100vw] h-[100vh]"></div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'MutationWindow',
    data() {
        return {
            name: '',
            surname: '',
            position: '',
            email: '',
            phone_number: '',

            selectedCompany: '',
            selectedDepartment: '',
            selectedDivision: '',
            selectedGroup: '',
            selectedOffice: '',
        }
    },
    watch: {
        getShowMutateWindow() {
            if(this.getEditMode) { // edit mode
                if(this.getType === 'company') {
                    const currentCompany = this.$store.getters['items/getCompany']
                    this.name = currentCompany.name
                }
                else{
                    const currentEmployee = this.$store.getters['items/getEmployee']
                    
                    this.name = currentEmployee.name
                    this.surname = currentEmployee.surname
                    this.position = currentEmployee.position
                    this.email = currentEmployee.email
                    this.phone_number = currentEmployee.phone_number
                }
            } else { // create mode
                this.name = ''
                this.surname = ''
                this.position = ''
                this.email = ''
                this.phone_number = ''
            }
        }
    },
    computed: {
        ...mapGetters('items', [
            'getCompanies', 
            'getCompany',
            'getDepartments', 
            'getDivisions', 
            'getGroups', 
            'getOffices', 
            'getEmployee']),
        ...mapGetters('mutate', ['getShowMutateWindow', 'getEditMode', 'getType',]),
    },
    methods: {
        ...mapMutations('mutate', ['toggleMutateWindow']),
        validate() {
            if(this.getType === 'company'){
                const nameEl = document.getElementById('name')
                if(nameEl.value === '') {
                    nameEl.classList.add('border-red');
                    nameEl.classList.add('border-2');
                    return false
                } else {
                    nameEl.classList.remove('border-red');
                    nameEl.classList.remove('border-2');
                    return true
                }
            }
            else{
                const elements = {
                    nameEl: document.getElementById('name'),
                    surnameEl: document.getElementById('surname'),
                    positionEl: document.getElementById('position'),
                    emailEl: document.getElementById('email'),

                    companyEl: document.getElementById('Company'),
                    divisionEl: document.getElementById('Division'),
                    officeEl: document.getElementById('Office'),
                }

                let failed = false

                for (const [key, value] of Object.entries(elements)) {
                    if (value.value === '') {
                        value.classList.add('border-red');
                        value.classList.add('border-2');
                        failed = true
                    } else {
                        value.classList.remove('border-red');
                        value.classList.remove('border-2');
                    }
                }
                if (failed) return false
                return true
            }
        },

        submit() {
            if(!this.validate()) return;
            if(this.getType === 'company') { // COMPANY
                let data = {
                    name: this.name,
                }
                if(this.getEditMode) {
                    data.id = this.getCompany.id
                    this.$api.updateCompany(data);
                } else {
                    this.$api.createCompany(data);
                }
            }
            else{
            const data = {
                company_id: this.selectedCompany.id,
                department_id: this.selectedDepartment.id, // optional
                division_id: this.selectedDivision.id,
                group_id: this.selectedGroup.id, // optional
                office_id: this.selectedOffice.id, 
                name: this.name,
                surname: this.surname,
                position: this.position,
                email: this.email,
                phone_number: this.phone_number, // optional
            }
            console.log(this.getEditMode)
            if(this.getEditMode) {
                // FIX EDIT MODE <<<<<<<<<<<<<<<<<<<<<<
                this.$api.updateEmployee(data);
            } else {
                this.$api.createEmployee(data);
            }
        }}
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