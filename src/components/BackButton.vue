<template>
    <div class="absolute top-12 left-12">
        <button @click="$router.go(-1)" class="w-12 h-12 shadow-slate-800 shadow-md bg-gray_light text-secondary border rounded-full">
            <font-awesome-icon :icon="['fas', 'angles-left']" />
        </button>
    </div>
</template>

<script>


export default {
    name: 'BackButton',
};