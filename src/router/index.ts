import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "../views/auth/LoginView.vue"
import RegisterView from "../views/auth/RegisterView.vue"
import ChatsView from "../views/chats/ChatsView.vue"
import PageView from "../views/chats/PageView.vue"
import { useAuthStore } from '@/stores/auth'

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
      path: "/chats/:id",
      component: PageView,
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

  const isTokenValid = (value: boolean) => {
    return value;
  }

  if(!auth.init && !auth.isAuthenticated && !auth.accessToken && !isTokenValid(false)){
    await auth.refreshToken();
  } 

  if(to.meta.requiresAuth){
    if(auth.accessToken && auth.isAuthenticated && isTokenValid(true)){
      next();
    }

    return next({
      name: "login"
    });
  }

  if(to.name == "login" || to.name == "register") {
    if(auth.accessToken && auth.isAuthenticated && isTokenValid(true)){
      return next("/chats");
    }
  }

  if(to.meta.requiresAuth){
    if(auth.accessToken && auth.isAuthenticated && isTokenValid(true)){
      return next();
    }

    return next("/auth/login");
  }


  return next();
});

export default router
