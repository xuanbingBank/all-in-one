<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import MenuItem from './MenuItem.vue'
import { useMenu } from './useMenu'
import type { MenuItem as MenuItemType } from './types'

// 使用懒加载导入组件
const HomeView = defineAsyncComponent(() => import('../../views/home/index.vue'))
const SettingsView = defineAsyncComponent(() => import('../../views/settings/index.vue'))
const NotesView = defineAsyncComponent(() => import('../../views/notes/index.vue'))

/**
 * @description 菜单配置
 */
const menuItems: MenuItemType[] = [
  {
    path: 'home',
    title: '首页',
    icon: '🏠',
    component: HomeView
  },
  {
    path: 'notes',
    title: '笔记',
    icon: '📝',
    component: NotesView
  },
  {
    path: 'settings',
    title: '设置',
    icon: '⚙️',
    component: SettingsView,
    children: [
      {
        title: '基础设置',
        icon: '🔧',
        action: () => {
          currentView.value = 'settings'
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('showGeneralSettings'))
          }, 0)
        }
      },
      {
        title: '自定义样式',
        icon: '🎨',
        action: () => {
          currentView.value = 'settings'
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('showStyleSettings'))
          }, 0)
        }
      }
    ]
  }
]

const { 
  isCollapsed,
  currentView,
  expandedMenu,
  toggleCollapse,
  handleMenuClick
} = useMenu()

/**
 * @description 处理子菜单点击事件
 */
const handleSubMenuClick = (action: () => void, event: MouseEvent) => {
  event.stopPropagation()
  action()
}

/**
 * @description 获取当前组件
 */
const getCurrentComponent = () => {
  const item = menuItems.find(item => item.path === currentView.value)
  return item ? item.component : HomeView
}

defineExpose({
  currentView,
  getCurrentComponent
})
</script>

<template>
  <aside :class="['side-menu', { collapsed: isCollapsed }]">
    <div class="collapse-btn" @click="toggleCollapse">
      {{ isCollapsed ? '》' : '《' }}
    </div>
    
    <div class="menu-content">
      <!-- 常规菜单项 -->
      <div class="menu-top">
        <MenuItem
          v-for="item in menuItems.filter(item => item.path !== 'settings')"
          :key="item.path"
          :item="item"
          :is-collapsed="isCollapsed"
          :is-active="currentView === item.path"
          :is-expanded="expandedMenu === item.path"
          :on-menu-click="(path) => handleMenuClick(path, !!item.children?.length)"
          :on-sub-menu-click="handleSubMenuClick"
        />
      </div>

      <!-- 设置菜单项 -->
      <div class="menu-bottom">
        <MenuItem
          v-for="item in menuItems.filter(item => item.path === 'settings')"
          :key="item.path"
          :item="item"
          :is-collapsed="isCollapsed"
          :is-active="currentView === item.path"
          :is-expanded="expandedMenu === item.path"
          :on-menu-click="(path) => handleMenuClick(path, !!item.children?.length)"
          :on-sub-menu-click="handleSubMenuClick"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.side-menu {
  width: var(--menu-width, 200px);
  background-color: var(--menu-bg-color, #2c3e50);
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
  color: var(--menu-text-color, #fff);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  white-space: nowrap;
  position: relative;
}

.menu-item:hover {
  background-color: var(--menu-hover-color, #34495e);
}

.menu-item.active {
  background-color: var(--menu-active-color, #3498db);
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

.menu-item.expanded {
  background-color: #34495e;
}

.expand-icon {
  margin-left: 8px;
  font-size: 12px;
  transition: transform 0.3s;
}

.submenu {
  background-color: #34495e;
  overflow: hidden;
}

.submenu-item {
  padding: 8px 24px 8px 48px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  white-space: nowrap;
  user-select: none;
}

.submenu-item:hover {
  background-color: var(--menu-active-color, #3498db);
}

.submenu-item:active {
  background-color: var(--menu-active-color, #2980b9);
}

.submenu-item .menu-icon {
  font-size: 14px;
  margin-right: 8px;
}

/* 动画效果 */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 