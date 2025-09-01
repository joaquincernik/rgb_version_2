import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Albums from "../views/Albums.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Admin from "../views/Admin.vue";
import { useAuthStore } from "../stores/auth";
import Forbidden from "../views/Forbidden.vue";
import CreateAlbum from "../views/CreateAlbum.vue";
import EditAlbum from "../views/EditAlbum.vue";
import AlbumDetail from "../views/AlbumDetail.vue";
const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/albums", name: "Albums", component: Albums },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/albums/detail/:id", name: "AlbumDetail", component: AlbumDetail },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requiresAdmin: true },
  },
  { path: "/forbidden", name: "Forbidden", component: Forbidden },
  {
    path: "/admin/createAlbum",
    name: "CreateAlbum",
    component: CreateAlbum,
    meta: { requiresAdmin: true },
  },
  {
    path: "/admin/albums/:id/edit",
    component: EditAlbum,
    meta: { requiresAdmin: true },
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

let fetched = false; // evita refetch innecesario al navegar
router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // 1) si aún no sabemos el usuario, preguntamos al backend una vez
  if (!fetched && auth.user === null) {
    fetched = true;
    try {
      await auth.fetchUser(); // hace GET /api/auth/me
    } catch {
      /* ignore */
    }
  }

  // 2) si la ruta requiere admin, validamos
  if (to.meta.requiresAdmin) {
    if (!auth.user) {
      // no logueado → a login y volver luego
      return { path: "/login", query: { redirect: to.fullPath } };
    }
    if (auth.user.rol !== "admin") {
      // logueado pero no admin → 403
      return { path: "/forbidden" };
    }
  }
  // continuar
  return true;
});

export default router;
