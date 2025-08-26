<script setup>
import { ref, onMounted } from 'vue'

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

onMounted(fetchTodos)
</script>

<template>
  <main style="max-width:720px;margin:2rem auto;font-family:system-ui,Arial,sans-serif;">
    <h1>TODOs (Vue + Express)</h1>

    <form @submit.prevent="addTodo" style="display:flex;gap:.5rem;margin:.75rem 0 1.5rem;">
      <input v-model="newText" placeholder="Nueva tarea..." style="flex:1;padding:.6rem;border:1px solid #ccc;border-radius:.5rem;" />
      <button style="padding:.6rem 1rem;border:0;border-radius:.5rem;cursor:pointer;">Agregar</button>
    </form>

    <p v-if="loading">Cargando…</p>
    <p v-if="error" style="color:#b00;">{{ error }}</p>

    <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:.5rem;">
      <li v-for="t in todos" :key="t.id" style="display:flex;align-items:center;gap:.5rem;">
        <input type="checkbox" :checked="t.done" @change="toggleDone(t)" />
        <span :style="{ textDecoration: t.done ? 'line-through' : 'none' }">{{ t.text }}</span>
        <button @click="removeTodo(t.id)" style="margin-left:auto;border:0;background:#eee;padding:.3rem .6rem;border-radius:.4rem;cursor:pointer;">
          Borrar
        </button>
      </li>
    </ul>
  </main>
</template>

<style>
:root { color-scheme: light dark; }
</style>
