<script setup>

const props = defineProps({
    srcImg: String,
    type: String,
    title: String,
    date: String
})


</script>
<template>
    <div>
        <img :src="`/images/${srcImg}`" :alt="title"
            style="width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 1rem;"></img>
    </div>
    <div class="py-2">
        <h3 class="pt-2" style="font-weight: bold; font-size: 1rem;">{{ title }}</h3>
        <h4 style="font-weight: 300; font-size: 0.8rem;">{{ date }}</h4>
        <span class="btn py-1 px-3 text-white" :style="{
            backgroundColor: type ? '#e63946' : '#1D3557',
            fontWeight: 'bold',
            fontSize: '0.7rem',
            borderRadius: '0.8rem'
        }">{{ type ? "Video" : "Foto" }}</span>
    </div>
</template>