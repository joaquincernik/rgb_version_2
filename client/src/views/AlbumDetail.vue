<script setup>
import CardPhoto from '../components/CardPhoto.vue'
import LightboxCarousel from '../components/LightboxCarousel.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

const album = ref({ album_id: null, name: '', date: '', cover: '', link: null, Photos: [] })
const loadingAlbums = ref(true)
const errorAlbums = ref('')

// === SELECCIÓN ===
const selectedPhotos = ref([])           // [{photo_id, title, link}]
const copiedAll = ref(false)
const idsSet = new Set()                 // para evitar duplicados (no va al template)

// === Lightbox ===
const showLightbox = ref(false)
const startIndex = ref(0)

function openLightbox({ photo_id }) {
    const idx = album.value.Photos.findIndex(p => p.photo_id === photo_id)
    startIndex.value = Math.max(0, idx)
    showLightbox.value = true
}


function handleAddToOrder(photo) {
    if (!photo || !photo.photo_id) return
    if (idsSet.has(photo.photo_id)) return
    idsSet.add(photo.photo_id)
    selectedPhotos.value.push(photo)
}
function removeFromOrder(id) {
    selectedPhotos.value = selectedPhotos.value.filter(p => p.photo_id !== id)
    idsSet.delete(id)
}
function clearOrder() {
    selectedPhotos.value = []
    idsSet.clear()
}
// Teléfono opcional (E.164). Ej AR: 5493511234567
const phone = 543537513657

// Texto del pedido (uno por línea)
const pedidoTexto = computed(() =>
    `Hola! Quiero realizar mi pedido del álbum ${album.value.name}:\n` +
    (selectedPhotos.value.length
        ? selectedPhotos.value.map(p => p.title || p.link).join('\n')
        : '(sin fotos aún)')
)

// Link de WhatsApp (con o sin phone)
const waLink = computed(() => {
    const text = encodeURIComponent(pedidoTexto.value)
    return phone
        ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}`
        : `https://wa.me/?text=${text}`
})

function enviarWpp() {
    if (!selectedPhotos.value.length) return
    window.open(waLink.value, '_blank', 'noopener')
}



// Fecha + fetch como ya lo tenías
function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d)) return ''
    return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(fetchAlbums)
async function fetchAlbums() {
    try {
        const res = await fetch(`/api/albums/list/${id}`)
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const data = await res.json()
        album.value = { ...data, date: formatDate(data.date) }
    } catch (e) {
        console.error(e)
        errorAlbums.value = 'No se pudo cargar imgs'
    } finally {
        loadingAlbums.value = false
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

async function copyPedido() {
  const text = pedidoTexto.value

  try {
    // Contexto seguro: https o localhost
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback para http o navegadores viejos
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }

    // Feedback visual
    copiedAll.value = true
    setTimeout(() => (copiedAll.value = false), 1200)
  } catch (e) {
    console.error('Error copiando:', e)
    // Si querés, mostrás un toast/alert acá
  }
}
</script>

<template>
    <div class="container">
        <p v-if="loadingAlbums">Cargando...</p>
        <p v-else-if="errorAlbums">{{ errorAlbums }}</p>

        <template v-else>
            <h3 class="mt-4">{{ album.name }}</h3>
            <p class="text-muted">{{ album.date }}</p>

            <div class="row my-3">
                <div v-for="a in album.Photos" :key="a.photo_id" class="col-md-3 py-2">
                    <CardPhoto :id="a.photo_id" :title="a.link" :srcImg="a.link" @open="openLightbox"
                        @add="handleAddToOrder" />
                </div>
            </div>

            <!-- Carrusel / Lightbox -->
            <LightboxCarousel v-model:show="showLightbox" :images="album.Photos" :start-index="startIndex" />

            <!-- Pedido -->
            <div class="p-5 my-5 rounded shadow" style="background-color: rgba(237,242,244,.3);">
                <p class="mb-2">
                    Hola! Quiero realizar mi pedido del álbum <b>{{ album.name }}</b>:
                </p>

                <ul v-if="selectedPhotos.length" class="list-unstyled mb-3">
                    <li v-for="p in selectedPhotos" :key="p.photo_id"
                        class="d-flex align-items-center gap-2 py-1 flex-wrap">
                        <span class="badge bg-light text-dark border">{{ p.title || p.link }}</span>
                        <button class="btn btn-sm btn-outline-secondary"
                            @click="removeFromOrder(p.photo_id)">Quitar</button>
                    </li>
                </ul>
                <p v-else class="text-muted mb-3">(todavía no agregaste fotos)</p>

                <div class="d-flex align-items-center pt-4 gap-2">
                    <button class="btn bg-pedido px-3 text-white fw-bold" :disabled="selectedPhotos.length === 0"
                        @click="copyPedido">
                        {{ copiedAll ? '¡Pedido copiado!' : 'Copiar pedido' }}
                    </button>
                    <button class="btn btn-outline-success px-3 fw-bold" :disabled="selectedPhotos.length === 0"
                        @click="enviarWpp">
                        Enviar por WhatsApp
                    </button>
                    <button class="btn btn-outline-secondary" v-if="selectedPhotos.length" @click="clearOrder">
                        Limpiar
                    </button>
                    <small v-if="copiedAll" class="text-success" role="status" aria-live="polite">Copiado ✓</small>
                </div>
            </div>
        </template>
    </div>
</template>

<style>
.bg-pedido {
    background-color: #1D3557;
    transition: all 0.3s ease;
    /* suaviza el hover */
}

.bg-pedido:disabled{
   background-color: gray;
}
.bg-pedido:hover {
    background-color: #27476e;
    /* un azul más claro */
    transform: scale(1.05);
    /* agrandar un poquito */
}
</style>