<template>
    <div>
        <div  class="w-[100%] h-20 text-black text-opacity-90 text-5xl font-light leading-10">Detalesnė kontakto informacija</div> <!-- Header -->
        <div v-if="Object.keys(getEmployee).length">
            <div class="flex w-[100%] p-6 items-center gap-5"> <!-- header -->
                <img class="w-16 h-12" :src="getEmployee.photo ? getEmployee.photo : 'https://via.placeholder.com/64x51'"/>
                <div>
                    <router-link :to="'/contacts/details/'+getEmployee.id" class="w-52 text-black text-opacity-90 text-4xl leading-normal tracking-tight">{{ getEmployee.name }} {{ getEmployee.surname }}</router-link>
                    <div class="text-black text-opacity-90 text-2xl leading-normal tracking-tight">Pozicija: {{ getEmployee.position }}</div>
                </div>
            </div>
            <div class="flex px-20 py-6 w-[100%] text-lg bg-white rounded shadow">
                <div class="w-[50%]">
                    <h1 class="text-2xl p-6">Kontaktinės detalės:</h1>
                    <p class="p-6">Elektroninis paštas: <a class="text-primary" :href="'mailto:'+getEmployee.email" @click="">{{ getEmployee.email }}</a></p>
                    <p class="p-6">Telefono numeris: <a class="text-primary" href="" @click.prevent="">{{ getEmployee.phone_number }}</a></p>
                </div>
                <div>
                    <h1 class="text-2xl p-6">Kompanijos detalės:</h1>
                    <p class="p-6">Kompanija: {{ getEmployee.expand.company_id.name }} </p>
                    <p class="p-6">Būstinė: {{ getEmployee.expand.office_id.name }}</p>
                    <p class="p-6">Departamentas: 
                        {{ getEmployee.expand.department_id.name }}
                    </p>
                    <p class="p-6">Divizija: {{ getEmployee.expand.division_id.name }}</p>
                    <p v-if="getEmployee.expand.group_id" class="p-6">Grupė: {{ getEmployee.expand.group_id.name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

    name: 'ContactDetails',
    data() {
        return {
            id: this.$route.params.id,
        }
    },
    mounted: function() {
        this.$api.getEmployee(this.id);
    },
    computed: {
        ...mapGetters('items', ['getEmployee']),
    },
};
</script>