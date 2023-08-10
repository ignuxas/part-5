<template>
    <div class="flex h-20 justify-between">
        <div> 
            <p>Įmonė</p>
            <select name="company" v-model="selectedCompany" class="w-72 h-9 bg-white rounded-lg border border-neutral-200" >
                <option value="">Filtruoti įmones</option>
                <option v-for="company in getCompanies.items" :key="company.id" :value="company">{{ company.name }}</option>
            </select>
        </div>
        <div> 
            <p>Padalinys</p>
            <select name="department" v-model="selectedDepartment" class="w-72 h-9 bg-white rounded-lg border border-neutral-200" >
                <option value="">Filtruoti padalinius</option>
                <option v-for="department in getDepartments.items" :key="department.id" :value="department">{{ department.name }}</option>
            </select>
        </div>
        <div>
            <p>Skyrius</p>
            <select name="division" v-model="selectedDivision"  class="w-72 h-9 bg-white rounded-lg border border-neutral-200" >
                <option value="">Filtruoti skyrius</option>
                <option v-for="division in getDivisions.items" :key="division.id" :value="division">{{ division.name }}</option>
            </select>
        </div>
        <div>
            <p>Grupė</p>
            <select name="group" v-model="selectedGroup" class="w-72 h-9 bg-white rounded-lg border border-neutral-200" >
                <option value="">Filtruoti grupes</option>
                <option v-for="group in getGroups.items" :key="group.id" :value="group">{{ group.name }}</option>
            </select>
        </div>
        <div>
            <p>Ofisas</p>
            <select name="office" v-model="selectedOffice"  class="w-72 h-9 bg-white rounded-lg border border-neutral-200" >
                <option value="">Filtruoti ofisus</option>
                <option v-for="office in getOffices.items" :key="office.id" :value="office">{{ office.name }}</option>
            </select>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
    name: 'FilterBar',
    data() {
        return {
            selectedCompany: "",
            selectedDepartment: "",
            selectedDivision: "",
            selectedGroup: "",
            selectedOffice: "",
        }
    },
    mounted() {
        this.selectedCompany = this.getSelectedCompany;
        this.selectedDepartment = this.getSelectedDepartment;
        this.selectedDivision = this.getSelectedDivision;
        this.selectedGroup = this.getSelectedGroup;
        this.selectedOffice = this.getSelectedOffice;
    },
    watch:{
        selectedCompany: function (val) {
            this.setSelectedCompany(val);
            this.$api.updateFilters(val.id, 'companies');
            this.$api.getEmployees();
        },
        selectedDepartment: function (val) {
            this.setSelectedDepartment(val);
            this.$api.updateFilters(val.id, 'departments');
            this.$api.getEmployees();
        },
        selectedDivision: function (val) {
            this.setSelectedDivision(val);
            this.$api.updateFilters(val.id, 'divisions');
            this.$api.getEmployees();
        },
        selectedGroup: function (val) {
            this.setSelectedGroup(val);
            this.$api.updateFilters(val.id, 'groups');
            this.$api.getEmployees();
        },
        selectedOffice: function (val) {
            this.setSelectedOffice(val);
            this.$api.updateFilters(val.id, 'offices');
            this.$api.getEmployees();
        },
    },
    computed: {
        ...mapGetters('items', [
            'getCompanies',                  
            'getDepartments',                            
            'getDivisions',        
            'getGroups',                  
            'getOffices',    
            ]),
        ...mapGetters('page', [
            'getSelectedCompany',
            'getSelectedDepartment',
            'getSelectedDivision',
            'getSelectedGroup',
            'getSelectedOffice'  
        ]),
    },
    methods: {
        ...mapMutations('page', ['setSelectedCompany', 
                                  'setSelectedDepartment', 
                                  'setSelectedDivision', 
                                  'setSelectedGroup', 
                                  'setSelectedOffice']),
    }
};
</script>