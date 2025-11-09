import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "../views/auth/LoginView.vue"
import RegisterView from "../views/auth/RegisterView.vue"
import ChatsView from "../views/chats/ChatsView.vue"
import PageView from "../views/chats/PageView.vue"
import ProfileView from "@/views/profile/ProfileView.vue"
import { useAuthStore } from '@/stores/auth'
import { useSocketStore } from '@/stores/socket'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
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
      path: "/chats/:userId",
      component: PageView,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: "/users/profile",
      component: ProfileView,
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

let isInitialized = false;
async function initialize(authStore, socketStore) {
  if (isInitialized) return;

  try {
    if(!authStore.accessToken) await authStore.refreshToken();

    if (authStore.accessToken) {
      await authStore.getMe();

      // 3. Jika user berhasil dimuat, koneksikan socket
      if (authStore.me?._id) {
        socketStore.connect(authStore.me._id, authStore.accessToken);
      }
    }
  } catch (err) {
    // throw err;
  } finally {
    isInitialized = true;
  }
}

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const socketStore = useSocketStore();

  const isTokenValid = (value: boolean) => {
    return value;
  }

  await initialize(authStore, socketStore);

  if(to.name == "login" || to.name == "register") {
    if(authStore.accessToken && isTokenValid(true)){
      return next("/chats");
    }
  }

  if(to.meta.requiresAuth){
    if(authStore.accessToken && isTokenValid(true)){
      return next();
    }

    return next("/auth/login");
  }


  return next();
});

export default router
