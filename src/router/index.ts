import { createRouter, createWebHistory } from 'vue-router'
import TokenValidator from '@/utils/TokenValidator'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/MainView.vue')
    },
    {
      path: '/question/:id',
      name: 'question',
      component: () => import('@/views/QuestionView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isValidToken = await TokenValidator.checkTokenValidity();
    if (!isValidToken) {
      next({ name: 'main' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router