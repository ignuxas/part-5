<template>
    <div>
        <div class="flex flex-col" v-if="permissions.read_permissions">
            <div class="w-[100%] h-20 text-black text-opacity-90 text-6xl font-light leading-10">Admin paskyros</div> <!-- Header -->
            <div id="UtilityBar" v-if="permissions.edit_permissions" class="flex gap-8 text-white items-center">
                <button @click="toggleMutateWindowFunc()" class="w-20 h-14 relative bg-sky-700 rounded-3xl shadow"><font-awesome-icon :icon="['fas', 'plus']" /></button>
                <span class="text-black text-xl">Sukurti naują admin paskyrą</span>
            </div>
            <table class="shadow mt-8">
                <tr class="border-gray_light border-b-2">
                    <th class="float-left p-4">Vardas</th>
                    <th class="p-4 text-left">El. paštas</th>
                    <th v-if="permissions.delete_permissions || permissions.edit_permissions">Veiksmai</th>
                </tr>
                <tr v-for="user in getUsers" :class="(user.id===getUser.id?'bg-green-50':'') + ' bgdarkgrayhover border-gray_light border-b-2'">
                    <td class="p-4">{{ user.username }}</td>
                    <td class="p-4">{{ user.email }}</td>
                    <td class="text-center" v-if="permissions.delete_permissions || permissions.edit_permissions">
                    <button v-if="permissions.edit_permissions" class="w-8 h-8 m-2 relative bg-secondary text-white rounded-3xl shadow" @click="toggleMutateWindowFunc(true, user)"><font-awesome-icon :icon="['fas', 'pen']" /></button>
                    <button v-if="permissions.delete_permissions" class="w-8 h-8 m-2 relative bg-secondary text-white rounded-3xl shadow" @click="toggleDeleteWindowFunc(user)"><font-awesome-icon :icon="['fas', 'trash']" /></button>
                </td>
                </tr>
            </table>
        </div>
        <div v-else class="flex text-3xl w-full h-[400px] items-center justify-center">
            Jūs neturite teisių peržiūrėti šio puslapio
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'Users',
    async mounted() {
        await this.$api.login()
        try {
            if(this.$store.getters['user/getUser'].expand.permissions_id.read_permissions)
                this.$api.getUsers();
            else this.$router.push('/')
        } catch(e) {
            this.$router.push('/')
        }
;
    },
    computed: {
        ...mapGetters('user', ['permissions', 'getUser']),
        ...mapGetters('items', ['getUsers']),
    },
    methods: {
        ...mapMutations('mutate', ['toggleMutateWindow', 'toggleDeleteWindow', 'setType', 'setEditMode', 'setUser']),
        ...mapMutations('items', ['setUser']),

        toggleMutateWindowFunc(editMode=false, user) {
            if(user) this.setUser(user);
            this.setEditMode(editMode);
            this.setType('user');
            this.toggleMutateWindow(true);
        },
        toggleDeleteWindowFunc(user) {
            this.setUser(user);
            this.setType('user');
            this.toggleDeleteWindow(true);
        }
    }
}
</script>