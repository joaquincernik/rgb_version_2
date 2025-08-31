<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { onMounted } from 'vue'

const auth = useAuthStore()

onMounted(() => {
    auth.fetchUser()
})
const props = defineProps({
    home: Boolean
})
</script>

<template>
    <div :class="home ? '' : 'bckg'">
        <div class="container">
            <nav class="d-flex justify-content-center pt-5 px-5" id="navbar">
                <div class="col-3">
                    <RouterLink to="/" :class="{
                        'text-decoration-none,text-white': true,  // siempre
                        'text-dark': !home             // solo si no es home
                    }">Inicio</RouterLink>
                </div>
                <div class="col-3">
                    <RouterLink to="/albums" class="text-decoration-none boton">Ver todas las fotos</RouterLink>
                </div>

                <div class="col-3" v-if="auth.user?.rol === 'admin'" >
                    <RouterLink to="/admin" class="
                        text-decoration-none text-white boton-admin">
                        Panel Admin
                    </RouterLink>
                </div>
                <!-- Si NO está logueado -->
                <template v-if="!auth.user">
                    <div class="col-3">
                        <RouterLink to="/login" :class="{
                            'text-decoration-none,text-white': true,  // siempre
                            'text-dark': !home             // solo si no es home
                        }">Iniciar sesion</RouterLink>
                    </div>
                    <div class="col-3">
                        <RouterLink to="/register" :class="{
                            'text-decoration-none,text-white': true,  // siempre
                            'text-dark': !home             // solo si no es home
                        }">Registrarme</RouterLink>
                    </div>
                </template>
                <template v-else>
                    <div v-if="auth.user?.rol !== 'admin'" class="col-3">
                        <span :class="{
                            'text-decoration-none': true,
                            'text-white': home,
                            'text-dark': !home
                        }" style="font-weight: 300; font-size: 0.8rem;">Hola, {{ auth.user.email }}</span>

                    </div>
                    <div class="col-3">
                        <button :class="{
                            'text-decoration-none, btn': true,
                            'text-white': home,
                            'text-dark': !home
                        }" @click="auth.logout">
                            Cerrar sesión
                        </button>
                    </div>
                </template>

            </nav>
        </div>
    </div>
</template>

<style>
.bckg {
    background-color: rgb(217, 217, 217, 0.15);
    padding-bottom: 3rem;
}
</style>
