<script setup>
import Header from './components/Header.vue';
import CardYt from './components/CardYt.vue';

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

</script>

<template>
  <div
    style=" background-image: url('/bg-home.jpg'); background-size: cover; background-position: center; width: 100vw; height: 100vh;">
    <div class="container">
      <Header />
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
      <h1 class="text-center" style="font-family: IBM Plex Mono, monospace;">Visita nuestro canal de youtube</h1>
    </div>

    <p v-if="loading">Cargando...</p>
      <p v-else-if="error">{{ error }}</p>
      <div v-else  class="row g-0 pb-5">
        <div v-for="v in videos" :key="v.videoId" class="col-6">
          <CardYt :title="v.title" :date="v.publishedAt" :linkImg="v.thumbnail" :linkYt="v.url" />
        </div>
        </div>
      </div>
</template>

<style>
:root {
  color-scheme: light dark;
}
</style>
