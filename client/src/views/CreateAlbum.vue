<script setup>
import { ref } from 'vue'

const name = ref('')
const date = ref('')

const loading = ref(false)
const error = ref('')
const success = ref(false)

const files = ref([]);          // File[]
const previews = ref([]);       // blob urls

const coverFile = ref(null);
const previewCover = ref(null);

const result = ref(null);

function onFileChange(e) {
    const file = e.target.files?.[0];
    coverFile.value = file || null;
    previewCover.value = file ? URL.createObjectURL(file) : null;
}



function onFilesChange(e) {
    const list = Array.from(e.target.files || []);
    files.value = list;
    //es para mosrar una preview de las fotos
    previews.value = list.map(f => URL.createObjectURL(f));
}
async function submit() {
    if (!coverFile.value) {
        alert('Selecciona una imagen de portada');
        return;
    }
    /*  if (!files.value.length) {
         alert('Selecciona al menos una imagen');
         return;
     } */
    const form = new FormData();
    form.append('name', name.value);
    form.append('date', date.value);

    form.append('cover', coverFile.value);

    if (files.length > 0) {

        files.value.forEach(f => form.append('images', f));
    }


    error.value = ''
    success.value = false
    loading.value = true
    console.log('====================================');
    console.log(form);
    console.log('====================================');
    try {
        const res = await fetch('/api/albums/create', {
            method: 'POST',
            body: form
        })
        result.value = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Error de registro')

        success.value = true
        window.location.href = '/admin'
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}
</script>


<template>
    <div class="container">
        <h3 class="mt-3 mb-2">Crear album</h3>
        <form @submit.prevent="submit" id="form-album" enctype="multipart/form-data" class="p-4 ">
            <div class="d-flex flex-column align-content-center">
                <label>
                    <span>Nombre de album</span>
                    <input v-model="name" class="form-control"></input>
                </label>

                <label>
                    <span>Fecha</span>
                    <input v-model="date" type="date" class="form-control"></input>
                </label>

                <label>
                    <span>Foto de portada</span>
                    <input type="file" class="form-control" accept="image/*" multiple @change="onFileChange" />
                </label>
                <img v-if="previewCover" :src="previewCover" class="mb-4"
                    style="width:10%; height:120px; object-fit:cover;"></img>
                <label>
                    <span>Imágenes </span>
                    <input type="file" class="form-control" accept="image/*" multiple @change="onFilesChange" />
                </label>

                <div v-if="previews.length" class="grid pb-4">
                    <img v-for="(src, i) in previews" :key="i" :src="src"
                        style="width:10%; height:120px; object-fit:cover;" />
                </div>

                <button :disabled="loading" class="rounded btn btn-danger px-4 py-2 my-3 fw-bold">
                    {{ loading ? 'Subiendo...' : 'Crear album' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style>
#form-album label {
    padding-top: 0.2rem;
    padding-bottom: 0.8rem;
}
</style>