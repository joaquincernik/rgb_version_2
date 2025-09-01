<script setup>
import Header from '../components/Header.vue';
import CardYt from '../components/CardYt.vue';
import CardAlbum from '../components/CardAlbum.vue';
import Footer from '../components/Footer.vue';

import { ref, onMounted } from 'vue'

const videos = ref([])
const loading = ref(true)
const error = ref('')

onMounted(fetchLatest)
async function fetchLatest() {
    try {
        const res = await fetch(`/api/youtube/latest`)
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const data = await res.json()
        videos.value = data.videos ?? []
    } catch (e) {
        error.value = 'No se pudo cargar YouTube'
        console.error(e)
    } finally {
        loading.value = false
    }
}

//albums
const latestAlbums = ref([])
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

onMounted(fetchLatestAlbums)
async function fetchLatestAlbums() {
    try {
        const res = await fetch("/api/albums?limit=12")
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const dataAlbum = await res.json()
        // Formatea la fecha de cada álbum
        latestAlbums.value = (dataAlbum.albums ?? []).map(a => ({
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
    <div
        style=" background-image: url('/bg-home.jpg'); background-size: cover; background-position: center; width: 100vw; height: 100vh;">
        <div class="container">
            <Header :home="true" />
        </div>
        <div class="d-flex justify-content-center align-items-center" style="padding-top: 10%;">
            <div class="d-flex flex-column text-center">
                <h1
                    style="padding-bottom: 0; margin-bottom: 0;font-family: Crimson Text,serif;color: #FFFFFF; font-size: 6rem;">
                    RGB</h1>
                <h3
                    style="font-family: Playwrite DE Grund, cursive; font-optical-sizing: auto;  color: rgba(255, 255, 255, 0.3);">
                    Artes graficas</h3>
            </div>
        </div>
    </div>
    <div class="container my-5">
        <div class="py-5">
            <h1 class="text-center" style="font-family: IBM Plex Mono, monospace;">Visita mi canal de youtube</h1>
        </div>

        <p v-if="loading">Cargando...</p>
        <p v-else-if="error">{{ error }}</p>
        <div v-else class="row g-0 pb-5">
            <div v-for="v in videos" :key="v.videoId" class="col-6">
                <CardYt :title="v.title" :date="v.publishedAt" :linkImg="v.thumbnail" :linkYt="v.url" />
            </div>
        </div>

        <div class="row my-4">
            <div class="col-md-4">
                <a href="https://api.whatsapp.com/send?phone=543537513657" target="_blank" rel="noopener"
                    class="btn  d-flex align-items-center justify-content-center mt-3 gap-1"
                    style="border-radius: 0.5rem; padding: 2.2rem 1.2rem;background-color: rgba(237, 242, 244, 0.3) ;text-decoration: none;">
                    <i class="fab fa-whatsapp" style="font-size: 2rem;color: #80ed99;"></i>
                    <span style="font-weight: 500; font-size: 1rem; ">Pedi fotos al <b>3537 51-3657</b></span>
                </a>
            </div>
            <div class="col-md-4 ">
                <a href="https://www.facebook.com/rossogustavo.com.ar/?fref=ts" target="_blank" rel="noopener"
                    class="btn  d-flex align-items-center justify-content-center mt-3 gap-1"
                    style="border-radius: 0.5rem; padding: 2.2rem 1.2rem;background-color: rgba(237, 242, 244, 0.3) ;text-decoration: none;">
                    <i class="fab fa-facebook" style="font-size: 2rem;color: #3f37c9;"></i>
                    <span style="font-weight: 500; font-size: 1rem;">Seguime en @rossogustavo</span>
                </a>
            </div>
            <div class="col-md-4">
                <a href="https://www.youtube.com/@gustavorosso7650" target="_blank" rel="noopener"
                    class="btn  d-flex align-items-center justify-content-center mt-3 gap-1"
                    style="border-radius: 0.8rem; padding: 2.2rem 1.2rem;background-color: rgba(237, 242, 244, 0.3) ;text-decoration: none;">
                    <i class="fab fa-youtube text-danger" style="font-size: 2rem;"></i>
                    <span style="font-weight: 500; font-size: 1rem;">Suscribite a @gustavorosso7650</span>
                </a>
            </div>
        </div>
        <h2 class="pt-5 pb-2" style="font-weight: bold; font-size: 1.7rem;">Ultimos albumes</h2>

        <p v-if="loadingAlbums">Cargando...</p>
        <p v-else-if="errorAlbums">{{ errorAlbums }}</p>
        <div v-else class="row">
            <div v-for="a in latestAlbums" :key="a.album_id" class="col-md-4 py-2">
                <CardAlbum :title="a.name" :date="a.date" :srcImg="a.cover" :id="a.album_id" :type="a.link" />
            </div>
        </div>

        <div class="d-flex justify-content-center mt-4 mb-5">
             <RouterLink to="/albums" class="
                    'text-decoration-none px-3 py-2 btn btn-danger rounded fw-bold" style="font-size: 1rem;">Ver todos los albumes</RouterLink>
            
        </div>
    </div>
</template>

<style>
:root {
    color-scheme: light dark;
}
</style>
