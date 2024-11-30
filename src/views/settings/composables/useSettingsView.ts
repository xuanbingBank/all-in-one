import { ref } from 'vue'

/**
 * @description 设置视图管理
 */
export function useSettingsView() {
  /**
   * @description 当前设置视图
   */
  const currentSettingView = ref<'general' | 'style' | 'note'>('general')

  /**
   * @description 处理显示基础设置
   */
  const handleShowGeneralSettings = () => {
    currentSettingView.value = 'general'
  }

  /**
   * @description 处理显示样式设置
   */
  const handleShowStyleSettings = () => {
    currentSettingView.value = 'style'
  }

  return {
    currentSettingView,
    handleShowGeneralSettings,
    handleShowStyleSettings
  }
} 