import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import AvatarSelectView from '../views/AvatarSelectView.vue'
import HostLobbyView from '../views/HostLobbyView.vue'
import JoinLobbyView from '../views/JoinLobbyView.vue'
import Waitingroom from '@/views/Waitingroom.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game',
      name: 'game',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: GameView,
    },
    {
      path: '/avatar',
      name: 'avatar',
      component: AvatarSelectView,
    },
    {
      path: '/hostLobby',
      name: 'host',
      component: HostLobbyView,
    },
    {
      path: '/joinLobby',
      name: 'join',
      component: JoinLobbyView,
    },
    {
      path: '/waiting-room',
      name: 'waiting-room',
      component: Waitingroom,
    },
  ],
})

export default router
