<template>
    <div class=" h-14 flex-col justify-start items-start inline-flex">
        <form class="flex text-black">
            <button class="w-10 h-[100%] text-sm text-neutral-600 bg-neutral-800 bg-opacity-10 rounded-tl" type="submit" @click.prevent="search"><font-awesome-icon :icon="['fas', 'magnifying-glass']"/></button>
            <input type="text" id="SearchInput" placeholder="Ieškoti kontakto..." v-model="searchInput" v-debounce="search" 
            class="w-full h-14 px-2 bg-neutral-800 bg-opacity-10 rounded-tr"/>
        </form>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { mapActions } from 'vuex';

export default {
    name: 'Search',
    data() {return {
        searchInput: "",
    }},
    methods: {
        ...mapMutations('page', ['setSearch']),
        ...mapActions('items', ['getEmployeesServ']),
        search() { 
            this.setSearch(this.searchInput)
            this.getEmployeesServ();
        }
    }
};
</script>