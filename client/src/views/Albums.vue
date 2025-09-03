<script setup>
import CardAlbum from '../components/CardAlbum.vue';
import { ref, onMounted, computed } from 'vue'


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
        const res = await fetch(`/api/albums/list?page=${page.value}&pageSize=${pageSize.value}&type=${type.value}&search=${search.value}`)
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

function changeType(x) {
    type.value = x;
    fetchAlbums()
}
function applySearch() {
    page.value = 1   // siempre volver a la página 1 cuando cambias búsqueda
    fetchAlbums()
}
</script>


<template>
    <div class="container">
        <!-- Search -->
        <div class="row justify-content-center mt-5 mb-3">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="search-container position-relative">
                    <div class="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="search-icon feather feather-search">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input v-model="search" class="form-control search-input ps-5" type="search"
                            placeholder="Buscar por nombre" aria-label="Search">
                        <button class="btn btn-search ms-2" @click="applySearch">Buscar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Type -->
        <div class="d-flex justify-content-center mt-4">
            <span class="btn py-2 p-3 mx-2" :class="type === 'todos' ? 'bg-all text-white' : 'btn-outline-secondary'"
                style="font-weight: bold; font-size: 1rem; border-radius: 1.5rem;"
                @click="changeType('todos')">Todos</span>
            <span class="btn py-2 px-3 mx-2" :class="type === 'fotos' ? 'bg-foto text-white' : 'btn-outline-secondary '"
                style="font-weight: bold; font-size: 1rem; border-radius: 1.5rem;"
                @click="changeType('fotos')">Fotos</span>
            <span class="btn py-2 px-3 mx-2"
                :class="type === 'videos' ? 'bg-video text-white' : 'btn-outline-secondary'"
                style="font-weight: bold; font-size: 1rem; border-radius: 1.5rem;"
                @click="changeType('videos')">Videos</span>
        </div>

        <h2 class="pt-5 pb-2" style="font-weight: bold; font-size: 1.7rem;">Todos los albumes</h2>
        <p class="text-muted">
            {{ total }} resultado{{ total !== 1 ? 's' : '' }}
        </p>
        <p v-if="loadingAlbums">Cargando...</p>
        <p v-else-if="errorAlbums">{{ errorAlbums }}</p>
        <div v-else class="row">
            <div v-for="a in albums" :key="a.album_id" class="col-md-4 py-2">
                <CardAlbum :title="a.name" :id="a.album_id" :date="a.date" :srcImg="a.cover" :type="a.link" :linkYt="a.link" />
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

<style>
.search-container {
    background-color: white;
    border-radius: 50px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 10px;
    max-width: 500px;
    width: 100%;
    transition: all 0.3s ease;
}

.search-container:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.form-control.search-input {
    border: none;
    background: transparent;
    padding-left: 20px;
    font-size: 1rem;
    height: 50px;
}

.form-control.search-input:focus {
    box-shadow: none;
    outline: none;
}

.btn-search {
    background-color: #1D3557;
    color: white;
    font-weight: bold;
    border-radius: 50px;
    padding: 10px 20px;
    border: none;
    transition: all 0.3s ease;
}

.btn-search:hover {
    background-color: #0056b3;
    transform: scale(1.05);
    color: #f1f3f5;

}

.search-icon {
    color: #6c757d;
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
}

.bg-all {
    background-color: #6c757d;
    /* gris Bootstrap */
}

.bg-all:hover {
    background-color: #5a6268;
}

.bg-foto {
    background-color: #1D3557;
    transition: all 0.3s ease;
    /* suaviza el hover */
}

.bg-foto:hover {
    background-color: #27476e;
    /* un azul más claro */
    transform: scale(1.05);
    /* agrandar un poquito */
}

.bg-video {
    background-color: #e63946;
    transition: all 0.3s ease;
}

.bg-video:hover {
    background-color: #ff4b5c;
    /* un rojo más claro */
    transform: scale(1.05);
}

.page-link {
    transition: all 0.2s ease-in-out;
}

.page-link:hover {
    background-color: #f1f3f5;
    transform: translateY(-2px);
}

.page-item.active .page-link {
    background-color: #1D3557 !important;
    /* tu azul corporativo */
    color: #fff !important;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* Mobile-only: stack search input and button */
@media (max-width: 576px) {
    .search-container .d-flex {
        flex-direction: column;
        align-items: stretch;
    }

    .search-container .btn-search {
        width: 100%;
        margin-top: 8px;
    }

    .form-control.search-input {
        height: 44px;
        padding-left: 44px;
    }

    .search-icon {
        left: 30px;
        top: 28%;
    }

}

/* Phablets/tablets chicas */
@media (max-width: 768px) {
    .search-container .d-flex {
        flex-direction: column;
        align-items: stretch;
    }

    .search-container .btn-search {
        width: 100%;
        margin-top: 8px;
    }
}
</style>
