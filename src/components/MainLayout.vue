<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import SideMenu from './menu/SideMenu.vue'
import type { ViewType } from './menu/types'

const sideMenuRef = ref<InstanceType<typeof SideMenu> | null>(null)

/**
 * @description 处理视图切换事件
 */
const handleViewChange = (event: Event) => {
  const customEvent = event as CustomEvent
  const view = customEvent.detail as ViewType
  if (sideMenuRef.value && (view === 'home' || view === 'settings' || view === 'notes')) {
    sideMenuRef.value.currentView = view
  }
}

onMounted(() => {
  // 在组件挂载后设置初始视图
  if (window.initialView) {
    sideMenuRef.value!.currentView = window.initialView
  }
  
  // 添加事件监听
  window.addEventListener('switchView', handleViewChange)
  
  // 监听 initialView 变化
  watch(() => window.initialView, (newView) => {
    if (sideMenuRef.value && (newView === 'home' || newView === 'settings' || newView === 'notes')) {
      sideMenuRef.value.currentView = newView
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('switchView', handleViewChange)
})

// 添加 getCurrentComponent 方法
const getCurrentComponent = () => {
  return sideMenuRef.value?.getCurrentComponent()
}
</script>

<template>
  <div class="layout-container">
    <SideMenu ref="sideMenuRef" />
    
    <main class="main-content">
      <Suspense>
        <template #default>
          <component :is="getCurrentComponent()" />
        </template>
        <template #fallback>
          <div class="loading">
            <span class="loading-text">加载中...</span>
          </div>
        </template>
      </Suspense>
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

.main-content {
  flex: 1;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--content-bg-color, #f5f5f5);
  color: var(--content-text-color, #2c3e50);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loading-text {
  color: #666;
  font-size: 16px;
}

@keyframes loading-dots {
  0%, 20% {
    content: '.';
  }
  40% {
    content: '..';
  }
  60%, 100% {
    content: '...';
  }
}

.loading-text::after {
  content: '';
  animation: loading-dots 1.5s infinite;
}
</style> 