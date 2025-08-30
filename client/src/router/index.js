import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Albums from '../views/Albums.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  {path: '/albums', name: 'Albums', component: Albums}
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
