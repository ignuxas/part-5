<template>
    <div class="flex items-center  w-screen h-28 bg-primary">
        <img alt="Vue logo" src="../assets/logo.svg" class="max-h-12 m-12"/>
        <div v-if="full" class="flex w-full gap-10 text-white">
            <router-link to="/contacts" class=" hover:text-gray_light">Kontaktai</router-link>
            <router-link to="/companies" class="hover:text-gray_light">Įmonės</router-link>
            <router-link to="/structure" class="hover:text-gray_light">Struktūra</router-link>
            <router-link to="/users" v-if="permissions.read_permissions" class="hover:text-gray_light">Paskyros</router-link>
            <button v-if="Object.keys(getUser).length" class="absolute flex gap-6 right-20 top-9 justify-center items-center" @click="toggleOptions"> 
                <p>{{ getUser.name }}</p>
                <div class="flex justify-center items-center w-[40px] h-[40px] bg-white text-primary rounded-full">
                    <font-awesome-icon :icon="['fas', 'user']" />
                </div>
            </button>
            <div v-if="optionsOpen" class="absolute flex flex-col gap-4 right-20 top-24 justify-center items-center bg-white text-black rounded-lg shadow-lg">
                <router-link :to='{
                    path: "login",
                    query: { change: true },
                }' @click.native = "optionsOpen = false"
                >
                    <button class="hover:text-gray p-6">Pakeisti slaptažodį</button>
                </router-link>
                <button class="p-6 hover:text-gray" @click="() => {logout(); optionsOpen = false}">Atsijungti</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'Navigation',
    data() {
        return {
            optionsOpen: false
        }
    },
    computed: {
        ...mapGetters('user', [
            'getUser', 
            'permissions'
        ]),
        full () { return this.$store.getters['user/getFullNavigation']}
    },
    methods: {
        ...mapMutations('page', ['setType']),
        ...mapActions('user', ['logout']),
        toggleOptions() { this.optionsOpen = !this.optionsOpen; }
    }
};
</script>