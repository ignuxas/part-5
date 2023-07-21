<template>
    <div id="StatusContainer" :class="{hidden: !getShowStatus, success: isSuccess(getStatus)}">
        <div v-if="isSuccess(getStatus)">
            <font-awesome-icon class="text-2xl" :icon="['fas', 'circle-check']" />
            <h1>Atlikta sėkmingai</h1>
        </div>
        <div v-else-if="getStatus === 400">
            <font-awesome-icon class="text-2xl" :icon="['fas', 'circle-xmark']" />
            <h1>Klaidingi duomenys</h1>
        </div>
        <div v-else-if="getStatus === 404">
            <font-awesome-icon class="text-2xl" :icon="['fas', 'circle-xmark']" />
            <h1>Obijektas nerastas</h1>
        </div>
        <div v-else-if="getStatus === 500">
            <font-awesome-icon class="text-2xl" :icon="['fas', 'circle-xmark']" />
            <h1>Serverio klaida</h1>
        </div>
        <div v-else>
            <font-awesome-icon class="text-2xl" :icon="['fas', 'circle-xmark']" />
            <h1>Nežinoma klaida</h1>
        </div> 
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Status',
    computed: {
        ...mapGetters('page', [
            'getStatus',
            'getShowStatus'
    ])},
    methods: {
        isSuccess(status) {
            return status >= 200 && status < 300;
        },
    }
};

</script>

<style scoped>
#StatusContainer{
    position: fixed;
    color: white;
    background-color: rgb(207, 0, 0);
    padding: 16px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    opacity: 1;
    right: 0;
    transform: translateX(0%);
    transition: all 0.2s ease;
    z-index: 9999;
}

#StatusContainer div{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.hidden{
    display: block !important;
    opacity: 0 !important;
    transform: translateX(100%) !important;
}

.success{
    background-color: #25881e !important;
}
</style>