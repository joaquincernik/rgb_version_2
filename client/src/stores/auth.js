// src/stores/auth.js (si usas Pinia)
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  async function fetchUser() {
    try {
      const res = await fetch('/api/users/me')
      const data = await res.json()
      user.value = data.user
    } catch (e) {
      user.value = null
    }
  }

  function logout() {
    fetch('/api/users/logout', { method: 'POST'})
    user.value = null
  }

  return { user, fetchUser, logout }
})
