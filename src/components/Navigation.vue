<template>
    <div class="flex items-center  w-screen h-28 bg-primary">
        <img alt="Vue logo" src="../assets/logo.svg" class="max-h-12 m-12"/>
        <div v-if="full" class="flex w-full gap-10 text-white">
            <router-link to="/contacts" class=" hover:text-gray_light">Kontaktai</router-link>
            <router-link to="/companies" class="hover:text-gray_light">Įmonės</router-link>
            <router-link to="/structure" class="hover:text-gray_light">Struktūra</router-link>
            <router-link to="/users" class="hover:text-gray_light">Paskyros</router-link>
            <button v-if="Object.keys(getUser).length" class="absolute flex gap-6 right-20 top-9 justify-center items-center" @click="openOptions"> 
                <p>{{ getUser.name }}</p>
                <div class="flex justify-center items-center w-[40px] h-[40px] bg-white text-primary rounded-full">
                    <font-awesome-icon :icon="['fas', 'user']" />
                </div>
            </button>
            <div v-if="optionsOpen" class="absolute flex flex-col gap-4 right-20 top-24 justify-center items-center bg-white text-black rounded-lg shadow-lg">
                <button class="hover:text-gray p-6">Pakeisti slaptažodį</button>
                <button class="p-6 hover:text-gray" @click="$api.logout()">Atsijungti</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Navigation',
    data() {
        return {
            optionsOpen: false
        }
    },
    computed: {
        ...mapGetters('user', ['getUser']),
        full () { return this.$store.getters['user/getFullNavigation']}
    },
    methods: {
        openOptions() {
            this.optionsOpen = !this.optionsOpen;
        }
    }
};
</script>