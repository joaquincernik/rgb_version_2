<script setup>

const props = defineProps({
    linkImg: String,
    linkYt: String,
    title: String,
    date: String
})

</script>

<template>
    <section>
        <div>
            <img :src="linkImg" style="width: 80%;aspect-ratio: 16/9; object-fit: cover; border-radius: 1rem;" alt="">
        </div>
       
        <div class="py-2">
            <h3 class="pt-2" style="font-weight: bold; font-size: 1rem;">{{ title }}</h3>
            <h4 style="font-weight: 300; font-size: 0.9rem;">{{ date }}</h4>
            <a :href="linkYt" target="_blank" rel="noopener"
                class="btn btn-outline-danger d-flex align-items-center justify-content-center mt-3 gap-2"
                style="border-radius: 0.5rem; padding: 0.5rem 0.2rem; text-decoration: none; width: 27%;">
                <i class="fab fa-youtube" style="font-size: 1.5rem;"></i>
                <span style="font-weight: 500; font-size: 0.8rem;">Ver en YouTube</span>
            </a>
        </div>
    </section>
</template>

<style scoped>
@media (max-width: 576px) {
  img { width: 100% !important; }
  a.btn { width: 100% !important; }
}
@media (max-width: 768px) {
  img { width: 100% !important; }
  a.btn { width: 100% !important; }
}
</style>
