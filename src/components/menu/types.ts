/**
 * @description 视图类型
 */
export type ViewType = 'home' | 'settings' | 'notes'

/**
 * @description 子菜单项接口
 */
export interface SubMenuItem {
  title: string
  icon: string
  action: () => void
}

/**
 * @description 菜单项接口
 */
export interface MenuItem {
  path: ViewType
  title: string
  icon: string
  component: any
  children?: SubMenuItem[]
} 