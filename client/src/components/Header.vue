<script setup>
import { RouterLink, RouterView } from 'vue-router'


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
            <div class="col-3">
                <RouterLink to="/login" :class="{
                    'text-decoration-none,text-white': true,  // siempre
                    'text-dark': !home             // solo si no es home
                }" style="font-size: rem;">Iniciar sesion</RouterLink>
            </div>
            <div class="col-3">
                <RouterLink to="/login" :class="{
                    'text-decoration-none,text-white': true,  // siempre
                    'text-dark': !home             // solo si no es home
                }">Registrarme</RouterLink>
            </div>
        </nav>
    </div>
    </div>
</template>

<style>
.bckg{
    background-color: rgb(217,217,217,0.15);
    padding-bottom: 3rem;
}

</style>
