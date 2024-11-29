<script setup lang="ts">
import { ref, shallowRef, watch, onMounted, onUnmounted, defineAsyncComponent } from 'vue'

// 使用懒加载导入组件
const HomeView = defineAsyncComponent(() => import('../views/home/index.vue'))
const SettingsView = defineAsyncComponent(() => import('../views/settings/index.vue'))
const NotesView = defineAsyncComponent(() => import('../views/notes/index.vue'))

type ViewType = 'home' | 'settings' | 'notes'

/**
 * @description 菜单项接口
 */
interface MenuItem {
  path: ViewType
  title: string
  icon: string
  component: typeof HomeView | typeof SettingsView | typeof NotesView
  children?: SubMenuItem[]
}

/**
 * @description 子菜单项接口
 */
interface SubMenuItem {
  title: string
  icon: string
  action: () => void
}

/**
 * @description 菜单折叠状态
 */
const isCollapsed = ref(true)

/**
 * @description 当前视图
 */
const currentView = shallowRef<ViewType>('home')

/**
 * @description 展开的菜单项
 */
const expandedMenu = ref<ViewType | null>(null)

/**
 * @description 处理子菜单点击事件
 */
const handleSubMenuClick = (action: () => void, event: MouseEvent) => {
  event.stopPropagation() // 阻止事件冒泡
  action()
}

/**
 * @description 菜单配置
 */
const menuItems: MenuItem[] = [
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

/**
 * @description 切换菜单
 */
const handleMenuClick = (path: ViewType) => {
  // 获取当前点击的菜单项
  const menuItem = menuItems.find(item => item.path === path)
  
  // 如果有子菜单，只处理展开
  if (menuItem?.children?.length) {
    // 如果点击的不是当前展开的菜单，则展开新菜单
    if (expandedMenu.value !== path) {
      expandedMenu.value = path
    }
    // 移除折叠逻辑，保持子菜单展开状态
    return
  }
  
  // 没有子菜单才切换视图
  currentView.value = path
  expandedMenu.value = null
}

/**
 * @description 切换折叠状态
 */
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  if (isCollapsed.value) {
    expandedMenu.value = null
  }
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
  if (view === 'home' || view === 'settings' || view === 'notes') {
    currentView.value = view
  }
}

// 监听 initialView 变化
watch(() => window.initialView, (newView) => {
  if (newView === 'home' || newView === 'settings' || newView === 'notes') {
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
            v-for="item in menuItems.filter((item: MenuItem) => item.path !== 'settings')" 
            :key="item.path"
          >
            <div
              :class="['menu-item', { 
                active: currentView === item.path,
                expanded: expandedMenu === item.path 
              }]"
              @click="handleMenuClick(item.path)"
            >
              <span class="menu-icon">{{ item.icon }}</span>
              <span class="menu-title" v-show="!isCollapsed">
                {{ item.title }}
                <span class="expand-icon" v-if="item.children?.length">
                  {{ expandedMenu === item.path ? '▼' : '▶' }}
                </span>
              </span>
            </div>
            <!-- 子菜单 -->
            <div 
              v-if="!isCollapsed && item.children?.length && expandedMenu === item.path"
              class="submenu"
            >
              <div
                v-for="(subItem, index) in item.children"
                :key="index"
                class="submenu-item"
                @click="(event: MouseEvent) => handleSubMenuClick(subItem.action, event)"
              >
                <span class="menu-icon">{{ subItem.icon }}</span>
                <span class="menu-title">{{ subItem.title }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 设置菜单项 -->
        <div class="menu-bottom">
          <div 
            v-for="item in menuItems.filter((item: MenuItem) => item.path === 'settings')" 
            :key="item.path"
          >
            <div
              :class="['menu-item', { 
                active: currentView === item.path,
                expanded: expandedMenu === item.path 
              }]"
              @click="handleMenuClick(item.path)"
            >
              <span class="menu-icon">{{ item.icon }}</span>
              <span class="menu-title" v-show="!isCollapsed">
                {{ item.title }}
                <span class="expand-icon" v-if="item.children?.length">
                  {{ expandedMenu === item.path ? '▼' : '▶' }}
                </span>
              </span>
            </div>
            <!-- 子菜单 -->
            <div 
              v-if="!isCollapsed && item.children?.length && expandedMenu === item.path"
              class="submenu"
            >
              <div
                v-for="(subItem, index) in item.children"
                :key="index"
                class="submenu-item"
                @click="(event: MouseEvent) => handleSubMenuClick(subItem.action, event)"
              >
                <span class="menu-icon">{{ subItem.icon }}</span>
                <span class="menu-title">{{ subItem.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
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

.main-content {
  flex: 1;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--content-bg-color, #f5f5f5);
  color: var(--content-text-color, #2c3e50);
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
  user-select: none; /* 防止文本被选中 */
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

/* 添加加载状态样式 */
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

/* 添加加载动画 */
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