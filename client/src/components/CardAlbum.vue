<script setup>
import { ref } from 'vue'
const props = defineProps({
    srcImg: String,
    type: String,
    title: String,
    date: String,
    edit: Boolean,
    id: Number,
    linkYt: String
})
 
const result = ref()
const success = ref(false)
const error = ref()

const link = ref()
link.value = props.linkYt ? props.linkYt : `/albums/detail/${props.id}`  
async function deleteAlbum() {
    try {
        const res = await fetch(`/api/albums/remove/${props.id}`, {
            method: 'POST',
        })
        console.log('====================================');
        console.log(res);
        console.log('====================================');
        result.value = await res.json()
        success.value = true
        window.location.href = '/admin'
    } catch (e) {
        error.value = e.message
    } 
}
 

</script>
<template>
    <a class="text-decoration-none text-dark" :href="link" >
        <div>
            <img :src="`/uploads/${srcImg}`" :alt="title"
                style="width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: 1rem;"></img>
        </div>
    </a>
    <a class="text-decoration-none text-dark" :href="link">
        <div class="pt-2 pb-4 ">
            <h3 class="pt-2 ps-1" style="font-weight: bold; font-size: 1rem;">{{ title }}</h3>
            <h4 class="ps-1" style="font-weight: 300; font-size: 0.8rem;">{{ date }}</h4>
            <span class="btn py-1 my-1 px-3 text-white" :style="{
                backgroundColor: type ? '#e63946' : '#1D3557',
                fontWeight: 'bold',
                fontSize: '0.7rem',
                borderRadius: '0.8rem'
            }">{{ type ? "Video" : "Foto" }}</span>

            <a v-if="edit" :href="`/admin/albums/${id}/edit`" class="btn py-1 px-3 mx-1 text-white bg-primary  fw-bold"
                style="font-size: 0.7rem; border-radius: 0.8rem;">Editar</a>
             <a v-if="edit"  @click.prevent.stop="deleteAlbum" class="btn py-1 px-3 mx-1 text-white bg-danger  fw-bold"
                style="font-size: 0.7rem; border-radius: 0.8rem;">Borrar</a>
        </div>
    </a>
</template>