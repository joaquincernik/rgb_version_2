<script setup>
import { ref } from 'vue'

const nombre = ref('')

const loading = ref(false)
const error = ref('')
const success = ref(false)
const files = ref([]);          // File[]
const previews = ref([]);       // blob urls

const result = ref(null);

function onFilesChange(e) {
    const list = Array.from(e.target.files || []);
    files.value = list;
    //es para mosrar una preview de las fotos
    previews.value = list.map(f => URL.createObjectURL(f));
}
async function submit() {
    if (!files.value.length) {
        alert('Selecciona al menos una imagen');
        return;
    }
    const form = new FormData();
    form.append('nombre', nombre.value);

  files.value.forEach(f => form.append('images', f));


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
        //window.location.href = '/admin'
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}
</script>


<template>
    <form @submit.prevent="submit" enctype="multipart/form-data" class="p-4 space-y-3">
        <label class="block">
            <span>Descripción</span>
            <textarea v-model="nombre" class="border p-2 w-full"></textarea>
        </label>

        <label class="block">
            <span>Imágenes </span>
            <input type="file" accept="image/*" multiple @change="onFilesChange" />
        </label>

        <div v-if="previews.length" class="grid"
            style="grid-template-columns: repeat(auto-fill, minmax(120px,1fr)); gap: 8px;">
            <img v-for="(src, i) in previews" :key="i" :src="src" style="width:100%; height:120px; object-fit:cover;" />
        </div>

        <button :disabled="loading" class="border px-4 py-2">
            {{ loading ? 'Subiendo...' : 'Enviar' }}
        </button>

        <div v-if="result" class="mt-4">
            <pre>{{ result }}</pre>
            <ul v-if="result?.files?.length">
                <li v-for="(f, i) in result.files" :key="i">
                    <a :href="`http://localhost:3000${f.url}`" target="_blank">
                        http://localhost:3000{{ f.url }}
                    </a>
                </li>
            </ul>
        </div>
    </form>
</template>