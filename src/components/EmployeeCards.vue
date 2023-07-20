<template>
    <div v-if="isTableView" class="grid grid-cols-4 gap-4">
        <div v-for="employee in getEmployees.items" class="flex flex-col w-96 bg-white rounded shadow p-7 gap-[20px]">
            <div class="flex items-center gap-5"> <!-- header -->
                <img class="w-16 h-12" :src="employee.photo ? employee.photo : 'https://via.placeholder.com/64x51'"/>
                <div>
                    <router-link :to="'/contacts/details/'+employee.id" class="w-52 text-black text-opacity-90 text-xl font-medium leading-normal tracking-tight">{{ employee.name }} {{ employee.surname }}</router-link>
                    <div class="w-52 text-black text-opacity-90 text-base font-normal leading-normal tracking-tight">Pozicija: {{ employee.position }}</div>
                </div>
            </div>
            <div class="flex flex-col justify-center gap-[10px]"> <!-- content -->
                <div className="w-72 text-black text-opacity-90 text-base font-normal leading-normal tracking-wide">Telefono nr: {{ employee.phone_number }}</div>
                <div className="w-72 text-black text-opacity-90 text-base font-normal leading-normal tracking-wide">El. paštas: {{ employee.email }}</div>
                <div className="w-72 text-black text-opacity-90 text-base font-normal leading-normal tracking-wide">Adresas: {{ employee.expand.office_id.name }}</div>
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
            </tr>
            <tr v-for="employee in getEmployees.items" class="border-gray_light border-b-2">
                <td class="p-4">{{ employee.name }} {{ employee.surname }}</td>
                <td>{{ employee.position }}</td>
                <td>{{ employee.phone_number }}</td>
                <td>{{ employee.email }}</td>
                <td>{{ employee.expand.office_id.name }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'PersonCards',
    computed: {
        ...mapGetters('page', ['isTableView']),
        ...mapGetters('items', ['getEmployees', 'getCompanyById'])
    }
    // print out the employee data
};

</script>