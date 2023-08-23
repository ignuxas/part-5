<template>
    <div>
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
                <div class="flex flex-col py-2 items-center text-gray text-left text-xs">
                    Laikinas slaptažodis: {{ this.password }}
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
    email: '',
    password: '',
    adminOptions: {
        edit_employees: false,
        delete_employees: false,
        edit_companies: false,
        delete_companies: false,
        edit_offices: false,
        delete_offices: false,
        edit_structure: false,
        delete_structure: false,
        read_permissions: true,
        edit_permissions: false,
        delete_permissions: false,
    }
}

export default{
    name: 'Users',
    data() {
        return {
            ...defaultData
        }
    },
    watch: {
        getShowMutateWindow(val) {
            if (this.getEditMode) {
                const permissions = this.getCurrentItem.expand.permissions_id;

                if (val) {
                    this.name = this.getCurrentItem.name;
                    this.email = this.getCurrentItem.email;
                    Object.keys(this.adminOptions).forEach(key => {
                        this.adminOptions[key] = permissions[key]
                    });
                }
            } else {
                if(val) this.password = Math.random().toString(36).slice(-8);

                this.name = '';
                this.email = '';
                for (const key in this.adminOptions) {
                    this.adminOptions[key] = false
                }
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
        ...mapActions('general', ['validateInput']),
        ...mapActions('user', ['createUser', 'updateUser']),

        async submit() {
            const validationIds = ['name', 'email']
            const validationPassed = await this.validateInput(validationIds)
            if(!validationPassed) return

            const password = this.password
                
            let data = {
                username: this.name,
                email: this.email,
                name: this.name,
            }

            let permissions = this.adminOptions;
            permissions.read_permissions = true;

            console.log(data)

            if(this.getEditMode) { // edit
                data.id = this.getCurrentItem.id;
                permissions.id = this.getCurrentItem.permissions_id;
                
                this.updateUser({
                    user: data,
                    permissions
                });
            } else { // create
                this.createUser({
                    user: data,
                    permissions,
                    password
                });
            }
            this.toggleMutateWindow(false);
        }
    },

    mounted() { // on load
        if (this.getEditMode) {
            const permissions = this.getCurrentItem.expand.permissions_id;

            this.name = this.getCurrentItem.name;
            this.email = this.getCurrentItem.email;
            Object.keys(this.adminOptions).forEach(key => {
                this.adminOptions[key] = permissions[key]
            });
        } else {
            this.password = Math.random().toString(36).slice(-8);

            this.name = '';
            this.email = '';
            for (const key in this.adminOptions) {
                this.adminOptions[key] = false
            }
        }
    },
}

</script>