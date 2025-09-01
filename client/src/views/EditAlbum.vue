<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')

// datos del álbum
const form = ref({
    name: '',
    date: '',     // YYYY-MM-DD
    link: '',
    cover: ''     // ruta actual (string) que vino del backend
})

// archivo nuevo (opcional)
const newCoverFile = ref(null)
const newCoverPreview = computed(() =>
    newCoverFile.value ? URL.createObjectURL(newCoverFile.value) : null
)

function onCoverChange(e) {
    const f = e.target.files?.[0]
    newCoverFile.value = f || null
}

async function loadAlbum() {
    loading.value = true
    error.value = ''
    try {
        const res = await fetch(`/api/albums/list/${id}`, { credentials: 'include' })
        const data = await res.json()
      
        if (!res.ok) throw new Error(data?.error || 'No se pudo cargar el álbum')
        const a = data
        form.value = {
            name: a.name ?? '',
            date: (a.date || '').slice(0, 10),
            link: a.link ?? '',
            cover: a.cover ?? '' // p.ej. "/uploads/covers/cover_123.jpg"
        }
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}

async function submit() {
    saving.value = true
    error.value = ''
    success.value = ''
    try {
        // Usamos FormData para permitir portada opcional
        const fd = new FormData()
        fd.append('name', form.value.name)
        fd.append('date', form.value.date)
        fd.append('link', form.value.link)
        // si el usuario cargó una nueva portada, la enviamos
        if (newCoverFile.value) fd.append('cover', newCoverFile.value)

        const res = await fetch(`/api/albums/edit/${id}`, {
            method: 'PUT',
            body: fd,
            credentials: 'include'
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'No se pudo actualizar')

        success.value = 'Álbum actualizado ✔'
        // refrescar datos y limpiar preview
        await loadAlbum()
        newCoverFile.value = null
    } catch (e) {
        error.value = e.message
    } finally {
        saving.value = false
    }
}

onMounted(loadAlbum)
</script>

<template>
    <div class="container py-4" style="max-width: 760px;">
        <h2 class="mb-3">Editar álbum</h2>

        <p v-if="loading">Cargando álbum…</p>
        <p v-else-if="error" class="text-danger">{{ error }}</p>

        <form v-else @submit.prevent="submit">
            <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input v-model.trim="form.name" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Fecha</label>
                <input v-model="form.date" type="date" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Link (opcional)</label>
                <input v-model.trim="form.link" type="url" class="form-control" placeholder="https://…" />
            </div>

            <div class="row g-3 align-items-start mb-3">
                <div class="col-12 col-md-6">
                    <label class="form-label">Portada actual</label>
                    <div
                        class="ratio ratio-16x9 border rounded d-flex align-items-center justify-content-center bg-light">
                        <img v-if="form.cover" :src="`/uploads/${form.cover}`" alt="Portada actual"
                            style="object-fit:cover; width:100%; height:100%;" />
                        <span v-else class="text-muted">Sin portada</span>
                    </div>
                </div>

                <div class="col-12 col-md-6">
                    <label class="form-label">Nueva portada (opcional)</label>
                    <input type="file" accept="image/*" class="form-control" @change="onCoverChange" />
                    <div v-if="newCoverPreview" class="ratio ratio-16x9 mt-2 border rounded">
                        <img :src="newCoverPreview" alt="Preview" style="object-fit:cover; width:100%; height:100%;" />
                    </div>
                </div>
            </div>

            <div class="d-flex gap-2">
                <button class="btn btn-primary" :disabled="saving">
                    {{ saving ? 'Guardando…' : 'Guardar cambios' }}
                </button>
                <button type="button" class="btn btn-outline-secondary" @click="$router.back()">Cancelar</button>
            </div>

            <p v-if="success" class="text-success mt-3">{{ success }}</p>
            <p v-if="error && !loading" class="text-danger mt-2">{{ error }}</p>
        </form>
    </div>
</template>