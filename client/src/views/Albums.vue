<script setup>
import CardAlbum from '../components/CardAlbum.vue';
import { ref, onMounted } from 'vue'


//albums
const albums = ref([])
const loadingAlbums = ref(true)
const errorAlbums = ref('')

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

onMounted(fetchAlbums)
async function fetchAlbums() {
    try {
        const res = await fetch("/api/albums/list?page=1&pageSize=30")
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const dataAlbum = await res.json()
       
        // Formatea la fecha de cada álbum
        albums.value = (dataAlbum.albums.data ?? []).map(a => ({
            ...a,
            date: formatDate(a.date)
        }))
    } catch (e) {
        errorAlbums.value = 'No se pudo cargar imgs'
        console.error(e)
    } finally {
        loadingAlbums.value = false
    }
}

</script>


<template>
    <div class="container">
        <h2 class="pt-5 pb-2" style="font-weight: bold; font-size: 1.7rem;">Todos los albumes</h2>

        <p v-if="loadingAlbums">Cargando...</p>
        <p v-else-if="errorAlbums">{{ errorAlbums }}</p>
        <div v-else class="row">
            <div v-for="a in albums" :key="a.album_id" class="col-md-4 py-2">
                <CardAlbum :title="a.name" :date="a.date" :srcImg="a.cover" :type="a.link" />
            </div>
        </div>

        
    </div>
</template>