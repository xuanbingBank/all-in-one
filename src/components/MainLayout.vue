<script setup lang="ts">
import { ref, shallowRef, watch, onMounted, onUnmounted } from 'vue'
import HomeView from '../views/home/index.vue'
import SettingsView from '../views/settings/index.vue'

type ViewType = 'home' | 'settings'

/**
 * @description 菜单折叠状态
 */
const isCollapsed = ref(false)

/**
 * @description 当前视图
 */
const currentView = shallowRef<ViewType>('home')

/**
 * @description 菜单配置
 */
const menuItems = [
  {
    path: 'home' as ViewType,
    title: '首页',
    icon: '🏠',
    component: HomeView
  },
  {
    path: 'settings' as ViewType,
    title: '设置',
    icon: '⚙️',
    component: SettingsView
  }
] as const

/**
 * @description 切换菜单
 */
const handleMenuClick = (path: ViewType) => {
  currentView.value = path
}

/**
 * @description 切换折叠状态
 */
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

/**
 * @description 获取当前组件
 */
const getCurrentComponent = () => {
  const item = menuItems.find(item => item.path === currentView.value)
  return item ? item.component : HomeView
}

/**
 * @description 处理视图切换事件
 */
const handleViewChange = (event: Event) => {
  const customEvent = event as CustomEvent
  const view = customEvent.detail as ViewType
  if (view === 'home' || view === 'settings') {
    currentView.value = view
  }
}

// 监听 initialView 变化
watch(() => window.initialView, (newView) => {
  if (newView === 'home' || newView === 'settings') {
    currentView.value = newView
  }
}, { immediate: true })

// 添加事件监听
onMounted(() => {
  window.addEventListener('switchView', handleViewChange)
})

// 移除事件监听
onUnmounted(() => {
  window.removeEventListener('switchView', handleViewChange)
})
</script>

<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <aside :class="['side-menu', { collapsed: isCollapsed }]">
      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="toggleCollapse">
        {{ isCollapsed ? '》' : '《' }}
      </div>
      
      <div class="menu-content">
        <!-- 常规菜单项 -->
        <div class="menu-top">
          <div 
            v-for="item in menuItems.filter(item => item.path === 'home')" 
            :key="item.path"
            :class="['menu-item', { active: currentView === item.path }]"
            @click="handleMenuClick(item.path)"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            <span class="menu-title" v-show="!isCollapsed">{{ item.title }}</span>
          </div>
        </div>

        <!-- 设置菜单项 -->
        <div class="menu-bottom">
          <div 
            v-for="item in menuItems.filter(item => item.path === 'settings')" 
            :key="item.path"
            :class="['menu-item', { active: currentView === item.path }]"
            @click="handleMenuClick(item.path)"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            <span class="menu-title" v-show="!isCollapsed">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <component :is="getCurrentComponent()" />
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
  flex-shrink: 0;
  position: relative;
  transition: width 0.3s;
}

.side-menu.collapsed {
  width: 64px;
}

.collapse-btn {
  position: absolute;
  top: 50%;
  right: -20px;
  width: 20px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #2c3e50;
  color: #fff;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  transform: translateY(-50%);
  z-index: 100;
  transition: background-color 0.3s;
}

.collapse-btn:hover {
  background-color: #34495e;
}

.menu-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.menu-top {
  flex: 1;
}

.menu-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-item {
  padding: 12px 24px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.menu-item:hover {
  background-color: #34495e;
}

.menu-item.active {
  background-color: #3498db;
}

.menu-icon {
  margin-right: 12px;
  font-size: 18px;
}

.collapsed .menu-icon {
  margin-right: 0;
}

.menu-title {
  transition: opacity 0.3s;
}

.main-content {
  flex: 1;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}
</style> 