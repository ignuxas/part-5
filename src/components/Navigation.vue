<template>
    <div class="flex items-center  w-screen h-28 bg-primary">
        <img alt="Vue logo" src="../assets/logo.svg" class="max-h-12 m-12"/>
        <div v-if="full" class="flex gap-10">
            <router-link to="/contacts" class="text-white hover:text-gray_light">Kontaktai</router-link>
            <router-link to="/login" class="text-white hover:text-gray_light">Kompanijos</router-link>
            <router-link to="/login" class="text-white hover:text-gray_light">Struktūra</router-link>
            <router-link to="/login" class="text-white hover:text-gray_light">Būstinės</router-link>
            <router-link to="/login" class="text-white hover:text-gray_light">Paskyros</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Navigation',
    computed: {
        full () { return this.$store.getters['page/getFullNavigation']}
    }
};
</script>