import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "../views/auth/LoginView.vue"
import RegisterView from "../views/auth/RegisterView.vue"
import ChatsView from "../views/chats/ChatsView.vue"
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: "/auth/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/auth/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/chats",
      name: "chats",
      component: ChatsView,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Kalau route butuh auth
  if (to.meta.requiresAuth) {
    if (auth.isAuthenticated) {
      // Cek apakah ada access token
      if (!auth.accessToken) {
        // Coba refresh token dulu
        try {
          await auth.refreshToken();
          // Kalau berhasil, lanjutkan
          next();
        } catch (err) {
          // Gagal refresh → redirect ke halaman login
          next("/auth/login");
        }
      } else {
        // Ada token → cek apakah masih valid (opsional: cek /me)
        try {
          // Opsional: cek user info, jika perlu validasi lebih lanjut
          // if (!auth._id) {
          //   const res = await api.get('/auth/me');
          //   auth.user = res.data;
          // }
          next();
        } catch (err) {
          // Token invalid → coba refresh
          try {
            await auth.refreshToken();
            next();
          } catch (err) {
            next("/auth/login");
          }
        }
      }
    } else {
      // Jika tidak ada token dan belum autentikasi, redirect ke login
      next("/auth/login");
    }
  } else {
    // Jika page login/register dan user sudah login, redirect ke dashboard
    if ((to.name === 'login' || to.name === "register") && auth.accessToken) {
      next("/chats");
    } else {
      next();
    }
  }
});

export default router
