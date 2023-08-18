<template>
    <div class="absolute flex items-center justify-center text-center left-0 top-0 h-[100vh] w-[100vw] bg-primary">
        <BackButton />
        <div v-if="changePassword" class="p-12 w-auto h-auto absolute bg-white shadow">
            <h1 class="text-3xl pb-8">Pakeisti slaptažodį:</h1>
            <div class="flex flex-col items-center text-gray text-left text-xs">
                <label for="emailChange"  class="self-start p-1">Elektroninis paštas:</label>
                <input type="text" v-model="changePasswordEmail" id="emailChange" class="w-full h-8 p-2 bg-gray_light rounded" />
            </div>
            <p class="text-xs mt-2 pt-4">Norite prisijungti? <a @click.prevent="changePassword=false" class="text-primary hover:text-secondary" href="">Prisijungti</a></p>
            <button @click="submit" class="w-32 h-8 mt-8 bg-secondary text-white rounded hover:bg-primary">Pateikti</button>
        </div>
        <div class="py-8 w-auto h-96 absolute bg-white shadow" v-else>
            <form>
                <h1 class="text-3xl pb-8">Admin prisijungimas:</h1>
                <div class="px-20" >
                    <div class="flex flex-col items-center text-gray text-left text-xs">
                        <label for="emailLogin" class="self-start p-1">Elektroninis paštas:</label>
                        <input type="text" v-model="email" id="emailLogin" class="w-full h-8 p-2 bg-gray_light rounded" />
                    </div>
                    <div class="flex py-4 flex-col items-center text-gray text-left text-xs">
                        <label for="password" class="self-start p-1">Slaptažodis:</label>
                        <input type="password" v-model="password" id="password" class="w-full h-8 p-2 bg-gray_light rounded" />
                    </div>
                    <p class="text-xs mt-2">Pamiršote slaptažodį? <a @click.prevent="changePassword=true" class="text-primary hover:text-secondary" href="">Pakeisti slaptažodį</a></p>
                    <button class="w-full h-8 mt-10 bg-secondary text-white hover:bg-primary rounded" @click="submit" type="submit">Prisijungti</button>
                </div>
                </form>
        </div>
    </div>
</template>

<script>
import BackButton from '../components/BackButton.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'Login',
    data() {
        return {
            changePassword: false,

            email: '',
            password: '',
            changePasswordEmail: '',
        }
    },
    mounted() {
        if(this.$route.query.change) {
            this.changePassword = true;
        }
    },
    watch: {
        getUser() {
            if(this.getUser.id) {
                this.$router.push('/contacts');
            }
        }
    },
    computed: {
        ...mapGetters('user', ['getUser']),
    },
    methods: {
        ...mapActions('user', ['login']),
        validate(){
            if(this.changePassword) {
                if(!this.changePasswordEmail) {
                    document.getElementById('emailChange').classList.add('border-2', 'border-red');
                    return false;
                } else {
                    document.getElementById('emailChange').classList.remove('border-2', 'border-red');
                }
                return true;
            }
            else{
                const checkElements = [
                    document.getElementById('emailLogin'),
                    document.getElementById('password')
                ]
                
                let failed = false; 

                for (const element of checkElements) {
                    if(!element.value) {
                        element.classList.add('border-2', 'border-red');
                        failed = true;
                    } else {
                        element.classList.remove('border-2', 'border-red');
                    }
                }
                return !failed;
            }
        },  

        async submit() {
            if (!this.validate()) return;
            if (this.changePassword) {
                // function won't work anyway as there is no email backend setup
                // this.$store.dispatch('changePassword', this.changePasswordEmail);
            } else {
                await this.login({identity: this.email, password: this.password})
            }
        }
    },
    components: {
        BackButton

    }
};

</script>