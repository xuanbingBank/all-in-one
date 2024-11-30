import { ref, shallowRef } from 'vue'
import type { ViewType } from './types'

/**
 * @description 菜单状态管理
 */
export function useMenu() {
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
   * @description 切换折叠状态
   */
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
    if (isCollapsed.value) {
      expandedMenu.value = null
    }
  }

  /**
   * @description 切换菜单
   */
  const handleMenuClick = (path: ViewType, hasChildren: boolean) => {
    if (hasChildren) {
      expandedMenu.value = expandedMenu.value === path ? null : path
    } else {
      currentView.value = path
      expandedMenu.value = null
    }
  }

  return {
    isCollapsed,
    currentView,
    expandedMenu,
    toggleCollapse,
    handleMenuClick
  }
} 