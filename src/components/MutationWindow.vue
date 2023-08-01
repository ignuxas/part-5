<template>
    <div id="MutationWindow" :class="(getShowMutateWindow ? '':'hidden ') + 'flex items-center justify-center fixed w-[100vw] h-[100vh] top-0 left-0 z-10'">
        <div class="relative p-6 bg-white z-20 ">
            <div v-if="getType === 'companies'">
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
            <div v-else-if="getType === 'user'">
                <h1 v-if="getEditMode" class="text-2xl">Readaguoti paskyrą</h1>
                <h1 v-else class="text-2xl">Sukurti naują paskyrą</h1>
                <div class="flex gap-10 p-2">
                    <div>
                        <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                            <label for="name" class="self-start p-1">Vardas <span class="text-red">*</span></label>
                            <input type="text" v-model="name" id="name" class="w-full h-8 p-2 bg-gray_light rounded" />
                        </div>
                        <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                            <label for="email" class="self-start p-1">El. paštas <span class="text-red">*</span></label>
                            <input type="email" v-model="email" id="email" class="w-full h-8 p-2 bg-gray_light rounded" />
                        </div>
                    </div>
                    <div>
                        <h2 class="pl-9 pb-1 text-lg">Administracinės teisės:</h2>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.edit_employees" class="mr-4"> <span> Readaguoti ir kurti kontaktus</span> </div>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.delete_employees" class="mr-4"> <span> Trinti kontaktus</span> </div>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.edit_companies" class="mr-4"> <span> Readaguoti ir kurti įmones</span> </div>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.delete_companies" class="mr-4"> <span> Trinti įmones</span> </div>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.edit_offices" class="mr-4"> <span> Readaguoti ir kurti ofisus</span> </div>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.delete_offices" class="mr-4"> <span> Trinti ofisus</span> </div>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.edit_structure" class="mr-4"> <span> Readaguoti ir kurti struktūras</span> </div>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.delete_structure" class="mr-4"> <span> Trinti struktūras</span> </div>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.read_permissions" class="mr-4"> <span> Skaityti admin paskyras</span> </div>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.edit_permissions" class="mr-4"> <span> Readaguoti ir kurti administracines teises</span> </div>
                        <div class="flex p-2"><input type="checkbox" v-model="adminOptions.delete_permissions" class="mr-4"> <span> Trinti admin paskyras</span> </div>
                    </div>
                </div>
                <div class="flex justify-center items-center w-100%">
                    <button v-if="getEditMode" class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Atnaujinti</button>
                    <button v-else class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Pridėti</button>
                </div>
            </div>
            <div v-else-if="getType === 'offices'">
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
                                <input type="checkbox" v-model="company.checked" class="mr-4"> <span>{{ company.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center items-center w-100%">
                    <button v-if="getEditMode" class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Atnaujinti</button>
                    <button v-else class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Pridėti</button>
                </div>
            </div>
            <div v-else-if="getType === 'divisions'">
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
                                <input type="checkbox" v-model="office.checked" class="mr-4"> <span>{{ office.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center items-center w-100%">
                    <button v-if="getEditMode" class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Atnaujinti</button>
                    <button v-else class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Pridėti</button>
                </div>
            </div>
            <div v-else-if="getType === 'departments'">
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
                                <input type="checkbox" v-model="division.checked" class="mr-4"> <span>{{ division.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center items-center w-100%">
                    <button v-if="getEditMode" class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Atnaujinti</button>
                    <button v-else class="w-32 h-8 mt-8 bg-secondary text-white hover:bg-primary rounded" @click="submit">Pridėti</button>
            </div>
            </div>
            <div v-else-if="getType === 'groups'">
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
                                <input type="checkbox" v-model="department.checked" class="mr-4"> <span>{{ department.name }}</span>
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
        </div>
        <div @click="toggleMutateWindow(false)" class="absolute top-0 bg-black bg-opacity-30 left-0 w-[100vw] h-[100vh]"></div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

const defaultStructure = {
    name: '',
    surname: '',
    position: '',
    email: '',
    phone_number: '',

    structureData: {
        name: '',
        company_id: '',
        department_id: '',
        division_id: '',
        group_id: '',
        office_id: '',
    },

    officeData: {
        street: '',
        street_number: '',
        city: '',
        country: '',
    },

    divisionData: {
        name: '',
    },
    groupData: {
        name: '',
    },
    departmentData: {
        name: '',
    },

    adminOptions: {
        edit_employees: false,
        delete_employees: false,
        edit_companies: false,
        delete_companies: false,
        edit_offices: false,
        delete_offices: false,
        edit_structure: false,
        delete_structure: false,
        read_permissions: false,
        edit_permissions: false,
        delete_permissions: false,
    },
}

export default {
    name: 'MutationWindow',
    data() {
        return {
            ...defaultStructure
        }
    },
    watch: {
        getShowMutateWindow() {
            const item = this.$store.getters['items/getCurrentItem']

            if(this.getEditMode) { // edit mode
                if (this.getType === 'user') {
                    const permissions = this.$store.getters['items/getUser'].expand.permissions_id
                    
                    this.name = this.$store.getters['items/getUser'].username
                    this.email = this.$store.getters['items/getUser'].email
                    
                    Object.keys(this.adminOptions).forEach(key => {
                        this.adminOptions[key] = permissions[key]
                    });
                } else if (this.getType === 'offices') {
                    this.officeData = {
                        name: item.name,
                        street: item.street,
                        street_number: item.street_number,
                        city: item.city,
                        country: item.country,
                    }
                }else if(this.getType === 'companies') {
                    this.name = item.name
                } else if (this.getType === 'divisions') {
                    this.divisionData = { name: item.name, }
                } else if (this.getType === 'departments') {
                    this.departmentData = { name: item.name, }
                } else if (this.getType === 'groups') {
                    this.groupData = { name: item.name, }
                } else {
                    this.name = item.name
                    this.surname = item.surname
                    this.position = item.position
                    this.email = item.email
                    this.phone_number = item.phone_number

                    this.structureData = {
                        name: item.name,
                        company_id: item.expand.company_id.id,
                        department_id: item.expand.department_id ? item.expand.department_id.id : '',
                        division_id: item.expand.division_id.id,
                        group_id: item.expand.group_id ? item.expand.group_id.id : '',
                        office_id: item.expand.office_id.id,
                    }
                }
            } else { // create mode
                // reset data
                Object.keys(this.$data).forEach(key => {
                   this[key] = defaultStructure[key]
                });

                // fix to automatic REEEEEEEEEEEEEEE
                if (this.getType === 'user') {
                    this.adminOptions = {
                        edit_employees: false,
                        delete_employees: false,
                        edit_companies: false,
                        delete_companies: false,
                        edit_offices: false,
                        delete_offices: false,
                        edit_structure: false,
                        delete_structure: false,
                        read_permissions: false,
                        edit_permissions: false,
                        delete_permissions: false,
                    }
                }
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

        checkEmpty(list) {
            let failed = false

            list.forEach(element => {
                if(element.value === '') { // if empty
                    element.classList.add('border-red');
                    element.classList.add('border-2');
                    failed = true
                } else { // if not empty remove red border
                    element.classList.remove('border-red');
                    element.classList.remove('border-2');
                }
            });

            return !failed
        },

        validate() {
            if(this.getType === 'companies'){
                const elements = [
                    document.getElementById('name')
            ]; return this.checkEmpty(elements)
            } else if (this.getType === 'user') {
                const elements = [
                    document.getElementById('name'),
                    document.getElementById('email'),
                ]; return this.checkEmpty(elements)
            } else if (this.getType === 'offices') {
                const elements = [
                    document.getElementById('name'),
                    document.getElementById('street'),
                    document.getElementById('street_number'),
                    document.getElementById('city'),
                    document.getElementById('country'),
                ]; return this.checkEmpty(elements)
            } else if (this.getType === 'divisions' 
                    || this.getType === 'groups'
                    || this.getType === 'departments') {
                const elements = [
                    document.getElementById('name'),
                ]; return this.checkEmpty(elements)       
            } else {
                const elements = [
                    document.getElementById('name'),
                    document.getElementById('surname'),
                    document.getElementById('position'),
                    document.getElementById('email'),
                    document.getElementById('Company'),
                    document.getElementById('Division'),
                    document.getElementById('Office'),
                ]; return this.checkEmpty(elements)
            }
        },

        submit() {
            if(!this.validate()) return;
            if(this.getType === 'companies') { // COMPANY
                let data = { name: this.name, }
                if(this.getEditMode) {
                    data.id = this.getCompany.id
                    this.$api.updateCompany(data);
                } else {
                    this.$api.createCompany(data);
                }
            } else if (this.getType === 'user') { // USER
                let dataUser = {
                    username: this.name,
                    name: this.name,
                    email: this.email,
                }
                const dataPermissions = this.adminOptions

                if(this.getEditMode) {
                    dataUser.id = this.$store.getters['items/getUser'].id
                    dataPermissions.id = this.$store.getters['items/getUser'].expand.permissions_id.id
                    this.$api.updateUser(dataUser, dataPermissions);
                } else {
                    this.$api.createUser(dataUser, dataPermissions);
                }
            } else if (this.getType === 'offices') { // OFFICE
                let data = { ...this.officeData, }
                let companies = this.getCompanies.items.filter(company => company.checked).map(company => company.id)
                if(this.getEditMode) {
                    data.id = this.$store.getters['items/getCurrentItem'].id
                    this.$api.updateOffice(data, companies);
                } else {
                    this.$api.createOffice(data, companies);
                }
            } else if (this.getType === 'divisions') { // DIVISION
                let data = this.divisionData
                let offices = this.getOffices.items.filter(office => office.checked).map(office => office.id)
                if(this.getEditMode) { // todo: fix
                    data.id = this.$store.getters['items/getCurrentItem'].id
                    console.log(data.id)
                    this.$api.updateDivision(data, offices);
                } else {
                    this.$api.createDivision(data, offices);
                }
            } else if (this.getType === 'departments') { // DEPARTMENT
                let data = this.departmentData
                let divisions = this.getDivisions.items.filter(division => division.checked).map(division => division.id)
                console.log(data, divisions)
                if(this.getEditMode) { // todo: fix
                    data.id = this.$store.getters['items/getCurrentItem'].id
                    this.$api.updateDepartment(data, divisions);
                } else {
                    this.$api.createDepartment(data, divisions);
                }
            } else if (this.getType === 'groups') { // GROUP
                let data = this.groupData
                let divisions = this.getDivisions.items.filter(division => division.checked).map(division => division.id)
                if(this.getEditMode) { // todo: fix
                    data.id = this.$store.getters['items/getCurrentItem'].id
                    this.$api.updateGroup(data, divisions);
                } else {
                    this.$api.createGroup(data, divisions);
                }
            } else { // EMPLOYEE
                let data = {
                    ...this.structureData,
                    name: this.name,
                    surname: this.surname,
                    position: this.position,
                    email: this.email,
                    phone_number: this.phone_number, // optional
                }
                console.log(this.getEditMode)
                if(this.getEditMode) {
                    data.id = this.$store.getters['items/getCurrentItem'].id
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