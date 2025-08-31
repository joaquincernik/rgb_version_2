<script setup>
import CardAlbum from '../components/CardAlbum.vue';
import { ref, onMounted, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'


//albums
const albums = ref([])
const search = ref('')
const totalPages = ref(1)
const page = ref(1)
const pageSize = ref(30)
const type = ref("todos")
const total = ref()

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
        const res = await fetch(`/api/albums/list?page=${page.value}&pageSize=${pageSize.value}`)
        if (!res.ok) throw new Error('HTTP ' + res.status)


        const dataAlbum = await res.json()
        totalPages.value = dataAlbum.albums.totalPages
        page.value = dataAlbum.albums.page
        total.value = dataAlbum.albums.total

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
        window.scrollTo({ top: 0, behavior: 'smooth' })

    }
}

// ----- Lógica de UI para numeritos -----
// mostrará una “ventana” de hasta 5 páginas centrada en la actual
const pageNumbers = computed(() => {
    const max = Math.max(1, totalPages.value)
    const current = Math.min(Math.max(1, page.value), max)
    const windowSize = 5
    let start = Math.max(1, current - Math.floor(windowSize / 2))
    let end = Math.min(max, start + windowSize - 1)
    start = Math.max(1, end - windowSize + 1)

    const arr = []
    for (let p = start; p <= end; p++) arr.push(p)
    return arr
})

function goTo(p) {
    if (p < 1 || p > totalPages.value || p === page.value || loadingAlbums.value) return
    page.value = p
    fetchAlbums()
}
function prev() { goTo(page.value - 1) }
function next() { goTo(page.value + 1) }

</script>

<template>
    <div class="container">
        <h3 class="py-4">Vista de administrador</h3>
        <RouterLink to="/admin/createAlbum" class="text-decoration-none text-white boton-admin fw-bold">
            Crear album
        </RouterLink>
        <p v-if="loadingAlbums">Cargando...</p>
        <p v-else-if="errorAlbums">{{ errorAlbums }}</p>
        <div v-else class="row mt-5">
            <div v-for="a in albums" :key="a.album_id" class="col-md-4 py-2">
                <CardAlbum :title="a.name" :date="a.date" :srcImg="a.cover" :type="a.link" :edit="true" />
            </div>
        </div>

        <!-- Paginación Bootstrap -->
        <div class="d-flex justify-content-center my-4">
            <nav v-if="!loadingAlbums && totalPages > 1" aria-label="Paginación de álbumes">
                <ul class="pagination pagination-md gap-1">

                    <!-- Previous -->
                    <li class="page-item" :class="{ disabled: page === 1 || loadingAlbums }">
                        <button class="page-link rounded-pill" type="button" @click="prev"
                            :disabled="page === 1 || loadingAlbums">
                            «
                        </button>
                    </li>

                    <!-- Primera página -->
                    <li v-if="pageNumbers[0] > 1" class="page-item">
                        <button class="page-link rounded-pill" type="button" @click="goTo(1)">1</button>
                    </li>
                    <li v-if="pageNumbers[0] > 2" class="page-item disabled">
                        <span class="page-link border-0 bg-transparent px-2">…</span>
                    </li>

                    <!-- Ventana de páginas -->
                    <li v-for="p in pageNumbers" :key="p" class="page-item" :class="{ active: p === page }">
                        <button class="page-link rounded-pill"
                            :class="{ 'btn-primary text-white border-0': p === page }" type="button" @click="goTo(p)">
                            {{ p }}
                        </button>
                    </li>

                    <!-- Última página -->
                    <li v-if="pageNumbers[pageNumbers.length - 1] < totalPages" class="page-item disabled">
                        <span class="page-link border-0 bg-transparent px-2">…</span>
                    </li>
                    <li v-if="pageNumbers[pageNumbers.length - 1] < totalPages" class="page-item">
                        <button class="page-link rounded-pill" type="button" @click="goTo(totalPages)">
                            {{ totalPages }}
                        </button>
                    </li>

                    <!-- Next -->
                    <li class="page-item" :class="{ disabled: page === totalPages || loadingAlbums }">
                        <button class="page-link rounded-pill" type="button" @click="next"
                            :disabled="page === totalPages || loadingAlbums">
                            »
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>