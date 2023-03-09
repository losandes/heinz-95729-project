import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../home/home.vue'

let routerSingleton

const router = () => {
  if (routerSingleton) {
    return routerSingleton
  } else {
    routerSingleton = createRouter({
      history: createWebHistory(import.meta.env.BASE_URL),
      routes: [
        {
          path: '/',
          name: 'home',
          component: HomeView
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../about/about.vue')
        }
      ]
    })

    return routerSingleton
  }
}

export default router
