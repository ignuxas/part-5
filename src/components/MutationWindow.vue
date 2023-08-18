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
            <div v-else-if="getType === 'users'">
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
            <div v-else-if="getType === 'structures'">
                <h1 class="text-2xl pb-6 text-center">Sukurti struktūrą</h1>
                <div class="flex gap-2 text-white">
                    <button class="p-6 bg-secondary" @click="setType('departments')">Skyrius</button>
                    <button class="p-6 bg-secondary" @click="setType('divisions')">Padalinys</button>
                    <button class="p-6 bg-secondary" @click="setType('groups')">Grupė</button>
                    <button class="p-6 bg-secondary" @click="setType('offices')">Ofisas</button>
                </div>
            </div>
            <div v-else> <!-- Employees -->
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
        </div>
        <div @click="toggleMutateWindow(false)" class="absolute top-0 bg-black bg-opacity-30 left-0 w-[100vw] h-[100vh]"></div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

const defaultStructure = {
    name: '',
    surname: '',
    position: '',
    email: '',
    phone_number: '',
    photo: null,

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
        companies: [],
    },

    divisionData: {
        name: '',
        offices: [],
    },
    groupData: {
        name: '',
        departments: [],
    },
    departmentData: {
        name: '',
        divisions: [],
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
            const item = this.getCurrentItem

            if(this.getEditMode && this.getShowMutateWindow) { // edit mode
                if (this.getType === 'users') { // -------- USER ------------
                    const permissions = item.expand.permissions_id
                    
                    this.name = item.username
                    this.email = item.email
                    
                    Object.keys(this.adminOptions).forEach(key => {
                        this.adminOptions[key] = permissions[key]
                    });
                } else if (this.getType === 'offices') { // -------- OFFICE ------------
                    this.officeData = {
                        name: item.name,
                        street: item.street,
                        street_number: item.street_number,
                        city: item.city,
                        country: item.country,
                        companies: item.relations.companies.map(company => company.company_id)
                    }
                } else if(this.getType === 'companies') { // -------- COMPANY ------------
                    this.name = item.name
                } else if (this.getType === 'divisions') { // -------- DIVISION ------------
                    this.divisionData = { 
                        name: item.name,
                        offices: item.relations.offices.map(office => office.office_id)
                    }
                } else if (this.getType === 'departments') { // -------- DEPARTMENT ------------
                    this.departmentData = { 
                        name: item.name, 
                        divisions: item.relations.divisions.map(division => division.division_id)
                    }
                } else if (this.getType === 'groups') { // -------- GROUP ------------
                    this.groupData = { 
                        name: item.name,
                        departments: item.relations.departments.map(department => department.department_id)
                    }
                } else { // -------- EMPLOYEE ------------
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
            } 
            else if (this.getEditMode && !this.getShowMutateWindow) {}
            else { // create mode
                // reset data
                Object.keys(this.$data).forEach(key => {
                   this[key] = defaultStructure[key]
                });

                if (this.getType === 'users') { 
                    for (const key in this.adminOptions) {
                        this.adminOptions[key] = false
                    }
                }
            }
        }
    },
    computed: {
        ...mapGetters('items', [
            'getCompanies', 
            'getDepartments', 
            'getDivisions', 
            'getGroups', 
            'getOffices', 
            'getEmployee',
            'getCurrentItem']),
        ...mapGetters('mutate', [
            'getShowMutateWindow', 
            'getEditMode', 
            'getType',]),
    },
    methods: {
        ...mapMutations('mutate', [
            'toggleMutateWindow', 
            'setType']),

        ...mapActions('general', [
            'updateStructure' 
        ]),
        ...mapActions('items', [
            'createCompany', 
            'updateCompany',
            'createOffice',
            'createDivision',
            'createDepartment',
            'createGroup',
            'createEmployee',
            'updateEmployee',
        ]),
        ...mapActions('user', [
            'createUser',
            'updateUser',
        ]),

        manageFiles(e) {
            const files = e.target.files
            this.photo = files[0]
        },

        checkEmpty(list) {
            let failed = false

            list.forEach(name => {
                let element = document.getElementById(name)

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

        validate() { //
            let elements = []
            if (this.getType === 'divisions' 
                || this.getType === 'groups'
                || this.getType === 'departments'
                || this.getType === 'companies') {
                elements = [ 'name' ];   
            } else if (this.getType === 'users') {
                elements = [ 'name', 'email' ]; 
            } else if (this.getType === 'offices') {
                elements = ['name', 'street', 'street_number', 'city', 'country'];  
            } else {
                elements = ['name', 'surname', 'position', 'email', 'Company', 'Division', 'Office']
            }
            return this.checkEmpty(elements)
        },

        submit() {
            if (!this.validate()) return; // if validation failed, return
            
            if (this.getType === 'companies') { // -------- COMPANY ------------
                let data = { name: this.name, }
                if(this.getEditMode) {
                    data.id = this.getCurrentItem.id 
                    this.updateCompany(data);
                } else { this.createCompany(data); }

            } else if (this.getType === 'users') { // -------- USER ------------
                let dataUser = {
                    username: this.name,
                    name: this.name,
                    email: this.email,
                }
                const dataPermissions = this.adminOptions

                if (this.getEditMode) {
                    dataUser.id = this.getCurrentItem.id
                    dataPermissions.id = this.getCurrentItem.expand.permissions_id.id
                    this.updateUser( {user: dataUser, permissions: dataPermissions} );
                } else this.createUser({user: dataUser, permissions: dataPermissions});

            } else if (this.getType === 'offices') { // -------- OFFICE ------------
                let data = this.officeData
                if (this.getEditMode) { 
                    data.id = this.getCurrentItem.id 
                    this.updateStructure({
                        data: data, 
                        relations: data.companies, 
                        type: 'offices',
                        item: this.getCurrentItem
                    });
                } else { this.createOffice({office: data, companies: data.companies}); }

            } else if (this.getType === 'divisions') { // -------- DIVISION ------------
                let data = this.divisionData
                if (this.getEditMode) { data.id = this.getCurrentItem.id
                    this.updateStructure({
                        data: data, 
                        relations: data.offices, 
                        type: 'divisions',
                        item: this.getCurrentItem
                    });
                } else { this.createDivision({division: data, offices: data.offices}); }

            } else if (this.getType === 'departments') { // -------- DEPARTMENT ------------
                let data = this.departmentData
                if (this.getEditMode) { 
                    data.id = this.getCurrentItem.id 
                    this.updateStructure({
                        data, 
                        relations: data.divisions, 
                        type: 'departments',
                        item: this.getCurrentItem
                    });
                } else { this.createDepartment({department: data, divisions: data.divisions}); }

            } else if (this.getType === 'groups') { // -------- GROUP ------------
                let data = this.groupData
                if (this.getEditMode) { 
                    data.id = this.getCurrentItem.id 
                    this.updateStructure({
                        data, 
                        relations: data.departments, 
                        type: 'groups',
                        item: this.getCurrentItem
                    });
                } else { this.createGroup({group: data, departments: data.departments}); }

            } else { // -------- EMPLOYEE ------------
                let data = {
                    ...this.structureData,
                    name: this.name,
                    surname: this.surname,
                    position: this.position,
                    email: this.email,
                    phone_number: this.phone_number, // optional
                    photo: this.photo, // optional
                }
                if(this.getEditMode) { 
                    data.id = this.getCurrentItem.id
                    this.updateEmployee(data);
                } else { this.createEmployee(data); }
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