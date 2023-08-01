<template>
    <div v-if="isTableView" class="grid grid-cols-4 gap-4">
        <div v-for="employee in getEmployees.items" class="relative flex flex-col w-96 bg-white rounded shadow p-7 gap-[20px]">
            <div class="flex items-center gap-5"> <!-- header -->
                <img class="w-16 h-12" :src="employee.photo ? employee.photo : 'https://via.placeholder.com/64x51'"/>
                <div>
                    <router-link :to="'/contacts/details/'+employee.id" class="w-52 text-black text-opacity-90 text-xl font-medium leading-normal tracking-tight">{{ employee.name }} {{ employee.surname }}</router-link>
                    <div class="w-52 text-black text-opacity-90 text-base font-normal leading-normal tracking-tight">Pozicija: {{ employee.position }}</div>
                </div>
            </div>
            <div class="flex flex-col justify-center gap-[10px]"> <!-- content -->
                <div class="w-72 text-black text-opacity-90 text-base font-normal leading-normal tracking-wide">Telefono nr: {{ employee.phone_number }}</div>
                <div class="w-72 text-black text-opacity-90 text-base font-normal leading-normal tracking-wide">El. paštas: {{ employee.email }}</div>
                <div :class="(permissions.edit_employees || permissions.delete_employees ? 'w-56 ':'') + 'text-black text-opacity-90 text-base font-normal leading-normal tracking-wide'">Adresas: {{ employee.expand.office_id.name }}</div>
            </div>
            <div class="flex absolute bottom-6 right-6 gap-5" v-if="permissions.edit_employees || permissions.delete_employees">
                <button v-if="permissions.edit_employees" @click="toggleMutateWindowFunc(employee)" class="w-8 h-8 relative bg-secondary text-white rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'pen']" /></button>
                <button v-if="permissions.delete_employees" @click="toggleDeleteWindowFunc(employee)" class="w-8 h-8 relative bg-secondary text-white rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'trash']" /></button>
            </div>
        </div>
    </div>
    <div v-else class="relative bg-white shadow">
        <!-- Table -->
        <table class="w-[100%] text-center relative">
            <tr class="border-gray_light border-b-2">
                <th class="p-4">Vardas ir pavardė</th>
                <th>Pozicija</th>
                <th>Telefono numeris</th>
                <th>Elektroninis paštas</th>
                <th>Adresas</th>
                <th v-if="permissions.edit_employees || permissions.delete_employees">
                    Modifikacija
                </th>
            </tr>
            <tr v-for="employee in getEmployees.items" class="border-gray_light border-b-2">
                <td class="p-4">{{ employee.name }} {{ employee.surname }}</td>
                <td>{{ employee.position }}</td>
                <td>{{ employee.phone_number }}</td>
                <td>{{ employee.email }}</td>
                <td>{{ employee.expand.office_id.name }}</td>
                <td v-if="permissions.edit_employees || permissions.delete_employees">
                    <button v-if="permissions.edit_employees" @click="toggleMutateWindowFunc(employee)" class="w-8 h-8 m-2 relative bg-secondary text-white rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'pen']" /></button>
                    <button v-if="permissions.delete_employees" @click="toggleDeleteWindowFunc(employee)" class="w-8 h-8 m-2 relative bg-secondary text-white rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'trash']" /></button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'PersonCards',
    computed: {
        ...mapGetters('page', ['isTableView']),
        ...mapGetters('items', ['getEmployees', 'getCompanyById']),
        ...mapGetters('user', [
            'permissions'
        ]),
    },
    methods: {
        ...mapMutations ('mutate', ['toggleMutateWindow', 
        'toggleDeleteWindow', 'setEditMode', 'setType']),
        ...mapMutations ('items', ['setItem']),

        toggleMutateWindowFunc(employee) {
            this.setType('employees');
            this.setItem(employee);
            this.toggleMutateWindow();
            this.setEditMode(true);
        },
        toggleDeleteWindowFunc(employee) {
            this.setType('employees');
            this.setItem(employee);
            this.toggleDeleteWindow();
        }
    }
};

</script>