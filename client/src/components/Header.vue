<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { onMounted, ref, watch } from 'vue'

const auth = useAuthStore()

onMounted(() => {
    auth.fetchUser()
})
const props = defineProps({
    home: Boolean
})

// Mobile hamburger state
const menuOpen = ref(false)

// Prevent background scroll when mobile menu is open
watch(menuOpen, (open) => {
  const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches
  if (!isMobile) return
  document.documentElement.style.overflow = open ? 'hidden' : ''
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
    <div :class="home ? '' : 'bckg'">
        <div class="container">
            <nav class="d-flex justify-content-center pt-5 px-5 navbar-wrap" id="navbar">
                <!-- Hamburger (mobile only) -->
                <button
                    class="hamburger"
                    :class="[home ? 'hb-on-hero' : 'hb-default', { 'is-open': menuOpen }]"
                    @click="menuOpen = !menuOpen"
                    :aria-expanded="menuOpen.toString()" aria-controls="navbar-items" aria-label="Abrir menú">
                    <span class="icon" aria-hidden="true">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </span>
                    <span class="hamburger-text">Menú</span>
                </button>

                <!-- Backdrop (mobile only) -->
                <transition name="fade">
                    <div v-if="menuOpen" class="backdrop" @click="menuOpen = false" aria-hidden="true"></div>
                </transition>

                <!-- Collapsible items -->
                <div :class="['navbar-items', { open: menuOpen }]" id="navbar-items" role="menu">
                    <div class="col-3">
                        <RouterLink
                            to="/"
                          :class="{
                                    'text-decoration-none btn': true,
                                    'text-white': home,
                                    'text-dark': !home
                                }"
                            @click="menuOpen = false"
                        >Inicio</RouterLink>
                    </div>
                    <div class="col-3">
                        <RouterLink to="/albums" class="text-decoration-none boton" @click="menuOpen = false">Ver todas
                            las fotos</RouterLink>
                    </div>

                    <div class="col-3" v-if="auth.user?.rol === 'admin'">
                        <RouterLink to="/admin" class="
                            text-decoration-none text-white boton-admin" @click="menuOpen = false">
                            Panel Admin
                        </RouterLink>
                    </div>
                    <!-- Si NO está logueado -->
                    <template v-if="!auth.user">
                        <div class="col-3">
                            <RouterLink
                                to="/login"
                               :class="{
                                    'text-decoration-none btn': true,
                                    'text-white': home,
                                    'text-dark': !home
                                }"
                                @click="menuOpen = false"
                            >Iniciar sesion</RouterLink>
                        </div>
                        <div class="col-3">
                            <RouterLink
                                to="/register"
                               :class="{
                                    'text-decoration-none btn': true,
                                    'text-white': home,
                                    'text-dark': !home
                                }"
                                @click="menuOpen = false"
                            >Registrarme</RouterLink>
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
                            <button
                                :class="{
                                    'text-decoration-none btn': true,
                                    'text-white': home,
                                    'text-dark': !home
                                }"
                                @click="() => { auth.logout(); menuOpen = false }"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </template>
                </div>
            </nav>
        </div>
    </div>
</template>

<style scoped>
.bckg {
    background-color: rgb(217, 217, 217, 0.15);
    padding-bottom: 3rem;
}

/* Hamburger icon */
.hamburger {
    display: none;
    border: 1px solid transparent;
    cursor: pointer;
    height: 44px;
    padding: 0 12px;
    border-radius: 999px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: absolute;
    top: 8px;
    right: 12px;
    z-index: 1101;
    transition: background .2s ease, box-shadow .2s ease, color .2s ease, border-color .2s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,.08);
}

.hamburger .icon {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.hamburger .bar {
    width: 20px;
    height: 2px;
    margin: 2.5px 0;
    background: currentColor;
    border-radius: 2px;
    transition: transform .25s ease, opacity .2s ease, width .2s ease;
}

.hamburger .hamburger-text {
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: .02em;
}

.hamburger:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
}

/* Variants for contrast */
.hb-on-hero {
    background: rgba(0, 0, 0, .45);
    color: #fff;
    border-color: rgba(255, 255, 255, .35);
    backdrop-filter: blur(4px);
}

.hb-default {
    background: rgba(255, 255, 255, .95);
    color: #1D3557;
    border-color: rgba(0, 0, 0, .1);
}

/* Morph to X when open */
.hamburger.is-open .bar:nth-child(1) {
    transform: translateY(4.5px) rotate(45deg);
}
.hamburger.is-open .bar:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
}
.hamburger.is-open .bar:nth-child(3) {
    transform: translateY(-4.5px) rotate(-45deg);
}

/* Desktop keeps original layout */
.navbar-items {
    width: 100%;
}

/* Mobile behavior */
@media (max-width: 576px) {

    .bckg {
        padding-bottom: 0.5rem;
    }

    #navbar {
        width: 100%;
        position: relative;
        min-height: 56px;
    }

    #navbar.navbar-wrap {
        justify-content: flex-start !important;
    }

    /* reduce excessive bootstrap paddings on mobile */
    #navbar.navbar-wrap {
        padding-top: 0 !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
    }

    #navbar .hamburger {
        display: inline-flex;
    }

    /* overlay dropdown menu */
    #navbar .navbar-items {
        display: block !important; /* override global #navbar div { display:flex } */
        position: absolute;
        left: 0;
        right: 0;
        top: 56px;
        z-index: 1100;
        padding: 10px;
        opacity: 0;
        transform: translateY(-8px) scale(.98);
        pointer-events: none;
        transition: opacity .2s ease, transform .22s ease;
    }

    #navbar .navbar-items.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
    }

    /* panel */
    #navbar .navbar-items {
        display: block !important; /* ensure vertical stack */
        background: rgba(255,255,255,.96);
        color: black;
        border: 1px solid rgba(0,0,0,.06);
        box-shadow: 0 10px 28px rgba(0,0,0,.18);
        border-radius: 16px;
        margin: 8px auto;
        width: calc(100% - 24px);
        backdrop-filter: saturate(140%) blur(6px);
    }

    #navbar .navbar-items .col-3 {
        flex: 1 1 100% !important;
        max-width: 100% !important;
        padding: 6px 0;
        display: block !important;
        justify-content: stretch !important;
        align-items: stretch !important;
    }

    /* make items uniform blocks */
    #navbar .navbar-items a,
    #navbar .navbar-items button {
        display: block;
        width: 100%;
        text-align: left;
        padding: 12px 14px;
        border-radius: 12px;
        color: black;
        transition: background .15s ease, color .15s ease;
    }

    #navbar .navbar-items a:hover,
    #navbar .navbar-items button:hover {
        background: rgba(29,53,87,.06);
    }

    /* red/blue pills should hug text on one line */
    #navbar .navbar-items .boton,
    #navbar .navbar-items .boton-admin {
        display: inline-block !important;
        width: auto !important;
        white-space: nowrap;
        min-height: 40px;
        line-height: 1.2;
    }

    /* soften big pills */
    #navbar .navbar-items .boton,
    #navbar .navbar-items .boton-admin {
        border-radius: 12px !important;
        padding: 10px 14px !important;
    }
}

/* Phablets/tablets chicas */
@media (max-width: 768px) {
    #navbar {
        position: relative;
        min-height: 56px;
    }

    #navbar .hamburger {
        display: inline-flex;
    }

    #navbar .navbar-items {
        display: block !important;
        position: absolute;
        left: 0;
        right: 0;
        top: 56px;
        z-index: 1100;
    }

    #navbar .navbar-items .col-3 {
        flex: 1 1 100%;
        max-width: 100%;
        padding: 6px 0;
        display: block !important;
        justify-content: stretch !important;
        align-items: stretch !important;
    }

    #navbar .navbar-items a,
    #navbar .navbar-items button {
        display: block;
        width: 100%;
        text-align: left;
        padding: 12px 14px;
        border-radius: 12px;
        white-space: nowrap;
    }

    #navbar .navbar-items .boton,
    #navbar .navbar-items .boton-admin {
        border-radius: 12px !important;
        padding: 10px 14px !important;
        display: inline-block !important;
        width: auto !important;
        white-space: nowrap;
        min-height: 40px;
        line-height: 1.2;
    }
}

/* Backdrop for mobile menu */
.backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.35);
    backdrop-filter: blur(2px);
    z-index: 1099;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .hamburger, .hamburger .bar, #navbar .navbar-items, .fade-enter-active, .fade-leave-active {
    transition: none !important;
  }
}
</style>
