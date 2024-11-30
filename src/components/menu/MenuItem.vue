<script setup lang="ts">
import type { MenuItem, ViewType } from './types'

defineProps<{
  item: MenuItem
  isCollapsed: boolean
  isActive: boolean
  isExpanded: boolean
  onMenuClick: (path: ViewType) => void
  onSubMenuClick: (action: () => void, event: MouseEvent) => void
}>()
</script>

<template>
  <div>
    <div
      :class="['menu-item', { 
        active: isActive,
        expanded: isExpanded 
      }]"
      @click="onMenuClick(item.path)"
    >
      <span class="menu-icon">{{ item.icon }}</span>
      <span class="menu-title" :class="{ hidden: isCollapsed }">
        {{ item.title }}
        <span class="expand-icon" v-if="item.children?.length">
          {{ isExpanded ? '▼' : '▶' }}
        </span>
      </span>
    </div>

    <div 
      v-if="!isCollapsed && item.children?.length && isExpanded"
      class="submenu"
    >
      <div
        v-for="(subItem, index) in item.children"
        :key="index"
        class="submenu-item"
        @click="(event) => onSubMenuClick(subItem.action, event)"
      >
        <span class="menu-icon">{{ subItem.icon }}</span>
        <span class="submenu-title">{{ subItem.title }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 通用菜单项样式 */
.menu-item, .submenu-item {
  padding: 12px 24px;
  color: var(--menu-text-color, #fff);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  white-space: nowrap;
  user-select: none;
}

/* 统一的悬浮和激活样式 */
.menu-item:hover, .submenu-item:hover {
  background-color: var(--menu-hover-color, #34495e);
}

.menu-item.active, .menu-item.expanded {
  background-color: var(--menu-active-color, #3498db);
}

/* 图标样式 */
.menu-icon, .submenu-item .menu-icon {
  margin-right: 12px;
  font-size: 18px;
  flex-shrink: 0;
}

/* 标题样式 */
.menu-title, .submenu-title {
  transition: opacity 0.3s;
  opacity: 1;
  flex: 1;
}

.menu-title.hidden {
  opacity: 0;
  width: 0;
  margin: 0;
}

/* 子菜单特殊样式 */
.submenu-item {
  padding-left: 48px;
}

.submenu-item .menu-icon {
  font-size: 14px;
}
</style> 