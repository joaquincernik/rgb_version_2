<script setup>
import Header from './components/Header.vue';
import CardYt from './components/CardYt.vue';
/*import { ref, onMounted } from 'vue'

const todos = ref([])
const newText = ref('')
const loading = ref(false)
const error = ref('')

async function fetchTodos() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/todos')
    todos.value = await res.json()
  } catch (e) {
    error.value = 'No se pudo cargar la lista'
  } finally {
    loading.value = false
  }
}

async function addTodo() {
  if (!newText.value.trim()) return
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: newText.value })
  })
  if (!res.ok) {
    alert('Error creando TODO')
    return
  }
  const created = await res.json()
  todos.value.push(created)
  newText.value = ''
}

async function toggleDone(todo) {
  const res = await fetch(`/api/todos/${todo.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !todo.done })
  })
  if (res.ok) {
    const updated = await res.json()
    const i = todos.value.findIndex(t => t.id === updated.id)
    todos.value[i] = updated
  }
}

async function removeTodo(id) {
  const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
  if (res.status === 204) {
    todos.value = todos.value.filter(t => t.id !== id)
  }
}

onMounted(fetchTodos)*/
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
  <div class="container">
    <div class="py-5">
      <h1 class="text-center" style="font-family: IBM Plex Mono, monospace;">Visita nuestro canal de youtube</h1>
    </div>
    <div class="row g-0">
    <div class="col-6">
      <div>
        <img src="/bg-yt.jpg" style="width: 80%; border-radius: 1rem;" alt="">
      </div>
      <div class="py-2">
        <h3 class="pt-2" style="font-weight: bold; font-size: 1rem;">Complejo 1 Argentino MJ 0</h3>
        <h4 style="font-weight: 300; font-size: 0.9rem;">20 de agosto, 2025</h4>
        <a href="https://www.youtube.com/" target="_blank"
          class="btn btn-outline-danger d-flex align-items-center justify-content-center mt-3 gap-2"
          style="border-radius: 0.5rem; padding: 0.5rem 0.2rem; text-decoration: none; width: 27%;">
          <i class="fab fa-youtube" style="font-size: 1.5rem;"></i>
          <span style="font-weight: 500; font-size: 0.8rem;">Ver en YouTube</span>
        </a>
      </div>
    </div>
    <div class="col-6">
      <CardYt title="Complejo 27 - 7 Aleman" date="24 de agosto, 2003" linkImg="/bg-home.jpg" />
    </div>
    </div>
  </div>
</template>

<style>
:root {
  color-scheme: light dark;
}
</style>
