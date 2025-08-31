<script setup>

const props = defineProps({
    srcImg: String,
    type: String,
    title: String,
    date: String,
    edit: Boolean
})


</script>
<template>
    <div>
        <img :src="`/images/${srcImg}`" :alt="title"
            style="width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 1rem;"></img>
    </div>
    <div class="pt-2 pb-4 ">
        <h3 class="pt-2 ps-1" style="font-weight: bold; font-size: 1rem;">{{ title }}</h3>
        <h4 class="ps-1" style="font-weight: 300; font-size: 0.8rem;">{{ date }}</h4>
        <span class="btn py-1 my-1 px-3 text-white" :style="{
            backgroundColor: type ? '#e63946' : '#1D3557',
            fontWeight: 'bold',
            fontSize: '0.7rem',
            borderRadius: '0.8rem'
        }">{{ type ? "Video" : "Foto" }}</span>

        <a v-if="edit" class="btn py-1 px-3 mx-1 text-white bg-primary  fw-bold" style="font-size: 0.7rem; border-radius: 0.8rem;">Editar</a>
    </div>
</template>