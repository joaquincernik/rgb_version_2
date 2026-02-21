<script setup>
import { ref } from 'vue'

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function submit() {
    error.value = ''
    success.value = false
    loading.value = true
    try {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value),
            //credentials: 'include' // importante si tu API está en otro dominio
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Error de login')

        success.value = true
        window.location.href = '/'
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}
</script>
<template>
    <div style="background-color:rgb(217,217,217,0.15);">
        <div class="container d-flex justify-content-center">
            <div class="bg-white p-5  shadow-lg" style="border-radius: 1rem;width: 70%;">
                <h2 class="text-center">Iniciar sesion</h2>
                <div class="d-flex justify-content-center py-3">
                    <form @submit.prevent="submit" id="loginForm" style="width: 60%;">
                        <div class="mb-4">
                            <label for="username" class="form-label">Email</label>
                            <input class="form-control" v-model.trim="form.email" type="email"
                                placeholder="Ingresa tu mail" required />
                        </div>
                        <div class="mb-5">
                            <label for="password" class="form-label">Contrasena</label>
                            <input class="form-control" v-model="form.password" type="password"
                                placeholder="Ingresa tu contrasena" required minlength="6" />
                        </div>

                        <div class="text-center">
                            <button type="submit" class="btn btn-login text-white py-2 btn-md" :disabled="loading"
                                style="font-weight: bold; border-radius: 1rem; width: 100%;"> {{ loading ? 'Ingresando…'
                                    : 'Ingresar' }}
                            </button>
                            <p v-if="error" class="text-danger mt-3">{{ error }}</p>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
#loginForm label {
    font-weight: 500;
}

#loginForm input {
    font-size: 0.8rem;
    border-radius: 1rem;
    padding-top: 0.7rem;
    padding-bottom: 0.7rem;

}

.btn-login {
    background-color: #e63946;
    transition: all 0.3s ease;
}

.btn-login:hover {
    background-color: #ff4b5c;
    /* un rojo más claro */
    transform: scale(1.05);
}
/* Mobile-only: full-width auth form */
@media (max-width: 576px) {
  .container .bg-white.p-5.shadow-lg { width: 100% !important; padding: 2rem !important; }
  #loginForm { width: 100% !important; }
}
/* Phablets/tablets chicas */
@media (max-width: 768px) {
  .container .bg-white.p-5.shadow-lg { width: 90% !important; padding: 2.25rem !important; }
  #loginForm { width: 100% !important; }
}
</style>
