<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { routes } from '../router'

const router = useRouter()
const route = useRoute()

/**
 * @description 菜单配置
 */
const menuItems = routes.filter(route => route.meta?.title)

/**
 * @description 切换菜单
 */
const handleMenuClick = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <aside class="side-menu">
      <div 
        v-for="item in menuItems" 
        :key="item.path"
        :class="['menu-item', { active: route.path === item.path }]"
        @click="handleMenuClick(item.path)"
      >
        <span class="menu-icon">{{ item.meta?.icon }}</span>
        <span class="menu-title">{{ item.meta?.title }}</span>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.side-menu {
  width: 200px;
  background-color: #2c3e50;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
}

.menu-item {
  padding: 12px 24px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #34495e;
}

.menu-item.active {
  background-color: #3498db;
}

.menu-icon {
  margin-right: 12px;
}

.main-content {
  flex: 1;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}
</style> 