import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * @description 路由配置
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/index.vue'),
    meta: {
      title: '首页',
      icon: '🏠'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/settings/index.vue'),
    meta: {
      title: '设置',
      icon: '⚙️'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 