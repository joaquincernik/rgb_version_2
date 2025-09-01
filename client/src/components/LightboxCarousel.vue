<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },   // [{photo_id, link, ...}]
  startIndex: { type: Number, default: 0 },
  show: { type: Boolean, default: false }
})
const emit = defineEmits(['update:show'])

const i = ref(props.startIndex)
watch(() => props.startIndex, v => i.value = v)

const n = computed(() => props.images.length)
const curr = computed(() => props.images[i.value] || {})

function imgSrc(p) {
  const s = p?.link || ''
  return s.startsWith('http') || s.startsWith('/uploads/') ? s : `/uploads/${s}`
}
function close() { emit('update:show', false) }
function prev() { if (!n.value) return; i.value = (i.value - 1 + n.value) % n.value }
function next() { if (!n.value) return; i.value = (i.value + 1) % n.value }

function onKey(e) {
  if (!props.show) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

// Swipe en mobile
let startX = 0
function tStart(e){ startX = e.touches?.[0]?.clientX ?? 0 }
function tEnd(e){
  const endX = e.changedTouches?.[0]?.clientX ?? 0
  const dx = endX - startX
  if (Math.abs(dx) > 40) { dx > 0 ? prev() : next() }
}
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="show" class="lb-overlay" @click.self="close">
        <button class="lb-close" @click="close" aria-label="Cerrar">×</button>

        <div class="lb-stage" @touchstart="tStart" @touchend="tEnd">
          <button class="lb-nav lb-prev" @click="prev" aria-label="Anterior">‹</button>

          <img v-if="n" :src="imgSrc(curr)" class="lb-img" :alt="curr.link">

          <button class="lb-nav lb-next" @click="next" aria-label="Siguiente">›</button>

          <div class="lb-caption">
            <span>{{ (i+1) }} / {{ n }}</span>
            <span class="truncate">{{ curr.link }}</span>
          </div>
        </div>

        <div class="lb-thumbs" v-if="n > 1">
          <button v-for="(p, idx) in images" :key="p.photo_id"
                  :class="['lb-thumb', { active: idx === i }]"
                  @click="i = idx">
            <img :src="imgSrc(p)" :alt="p.link">
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }

.lb-overlay{
  position:fixed; inset:0; z-index:1050;
  background:rgba(0,0,0,.88);
  display:flex; flex-direction:column; justify-content:center; align-items:center;
  padding:24px;
}
.lb-stage{
  position:relative; width:min(1200px, 92vw); height:min(78vh, 900px);
  display:flex; align-items:center; justify-content:center;
}
.lb-img{
  max-width:100%; max-height:100%;
  object-fit:contain; border-radius:16px; box-shadow:0 10px 40px rgba(0,0,0,.5);
}
.lb-close{
  position:absolute; top:16px; right:20px;
  background:transparent; border:none; color:#fff; font-size:40px; line-height:1; cursor:pointer;
  opacity:.85;
}
.lb-close:hover{ opacity:1 }

.lb-nav{
  position:absolute; top:50%; transform:translateY(-50%);
  width:48px; height:48px; border:none; border-radius:50%;
  background:rgba(255,255,255,.15); color:#fff; font-size:34px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  backdrop-filter: blur(4px);
}
.lb-prev{ left:8px } .lb-next{ right:8px }
.lb-nav:hover{ background:rgba(255,255,255,.28) }

.lb-caption{
  position:absolute; left:0; right:0; bottom:0;
  display:flex; gap:8px; align-items:center; justify-content:space-between;
  padding:10px 14px;
  color:#fff; font-size:.9rem;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 100%);
  border-radius:0 0 16px 16px;
}
.truncate{ max-width:75%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis }

.lb-thumbs{
  margin-top:14px; display:flex; gap:8px; overflow:auto; padding-bottom:4px; max-width:96vw;
}
.lb-thumb{
  border:2px solid transparent; padding:0; border-radius:10px; background:none; cursor:pointer; flex:0 0 auto;
}
.lb-thumb.active{ border-color:#e63946 }
.lb-thumb img{
  width:84px; height:56px; object-fit:cover; border-radius:8px;
}
@media (max-width: 576px){
  .lb-thumb img{ width:64px; height:44px }
}
@media (max-width: 768px){
  .lb-thumb img{ width:72px; height:50px }
}
</style>
