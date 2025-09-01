<script setup>
import { ref } from 'vue'

const props = defineProps({
    srcImg: String,
    title: String,
    id: Number
})
const emit = defineEmits(['open', 'add'])

const copied = ref(false)


// -------

function abrir() { emit('open', { photo_id: props.id }) }

function agregar() {
    emit('add', { photo_id: props.id, title: props.title, link: props.srcImg })
}

async function copiarNombre() {
    try {
        await navigator.clipboard.writeText(props.title || props.srcImg)
        copied.value = true
        setTimeout(() => (copied.value = false), 1200)
    } catch (e) {
        console.error(e)
    }
}
</script>

<template>
    <div class="pb-1 pt-2">
        <h3 class="ps-1 text-muted text-center" style="font-size: .7rem;">{{ title }}</h3>
    </div>
    <div @click="abrir" style="cursor: zoom-in">
        <img :src="`/uploads/${srcImg}`" :alt="title"
            style="width:100%; aspect-ratio:3/2; object-fit:cover; object-position:center; border-radius:1rem;">
    </div>
    <div class="pt-2 d-flex justify-content-center">
        <button class="btn btn-primary py-1 my-1 me-1 px-3 text-white"
            style=" font-size:.6rem; border-radius:.8rem" @click="agregar">
            Agregar al pedido
        </button>

        <button class="btn py-1 my-1 px-3" :class="copied ? 'btn-success' : 'btn-outline-secondary'"
            style="font-size:.6rem; border-radius:.8rem" @click="copiarNombre">
            {{ copied ? '¡Copiado!' : 'Copiar nombre' }}
        </button>
    </div>
</template>

<style scoped>
@media (max-width: 576px) {
  .pt-2.d-flex { flex-wrap: wrap; gap: 8px; }
  .pt-2.d-flex > .btn { width: 100%; font-size: .8rem !important; }
}
@media (max-width: 768px) {
  .pt-2.d-flex { flex-wrap: wrap; gap: 10px; }
  .pt-2.d-flex > .btn { width: 100%; }
}
</style>
