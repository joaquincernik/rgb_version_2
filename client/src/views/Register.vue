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
        const res = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Error de registro')

        success.value = true
        // data.user contiene { id, name, email } en sesión
        // Redirigir si querés: window.location.href = '/dashboard'
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
                <h2 class="text-center">Registrarme</h2>
                <div class="d-flex justify-content-center py-3">
                    <form id="loginForm" @submit.prevent="submit" style="width: 60%;">
                        <div class="mb-4">
                            <label for="username" class="form-label">Email</label>
                            <input type="email" v-model.trim="form.email" class="form-control"
                                placeholder="Ingresa tu mail" required />
                        </div>
                        <div class="mb-5">
                            <label for="password" class="form-label">Contrasena</label>
                            <input v-model.trim="form.password" type="password" class="form-control"
                                placeholder="Ingresa tu contrasena" required minlength="6" />
                        </div>

                        <div class="text-center">
                            <button type="submit" class="btn btn-login text-white py-2 btn-md" :disabled="loading"
                                style="font-weight: bold; border-radius: 1rem; width: 100%;"> {{ loading ?
                                    'Registrando…' : 'Registrarme' }}
                            </button>
                            <p v-if="error" class="text-danger mt-3">{{ error }}</p>

                            <div id="formFeedback" class="mt-3"></div>
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
</style>