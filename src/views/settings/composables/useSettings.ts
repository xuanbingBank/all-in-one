import { ref, onMounted } from 'vue'
import type { Settings } from '../../../../index'
import pkg from '../../../../package.json'

/**
 * @description 设置数据管理
 */
export function useSettingsData() {
  const version = pkg.version || '1.0.0'
  
  const settings = ref<Settings>({
    theme: 'light',
    language: 'zh_CN',
    notifications: true,
    hotkey: 'Ctrl + Space'
  })

  /**
   * @description 保存设置
   */
  const saveSettings = () => {
    window.utools?.dbStorage.setItem('settings', settings.value)
    window.utools?.showNotification('设置已保存')
  }

  /**
   * @description 导出设置
   */
  const exportSettings = () => {
    const allSettings = {
      settings: settings.value,
      customStyle: window.utools?.dbStorage.getItem('customStyle'),
      exportTime: new Date().toISOString(),
      version
    }

    const data = JSON.stringify(allSettings, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * @description 导入设置
   */
  const importSettings = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        if (data.settings) {
          settings.value = data.settings
          window.utools?.dbStorage.setItem('settings', data.settings)
        }
        
        if (data.customStyle) {
          window.utools?.dbStorage.setItem('customStyle', data.customStyle)
          window.dispatchEvent(new CustomEvent('styleChanged', { detail: data.customStyle }))
        }
        
        window.utools?.showNotification('设置导入成功')
      } catch (error) {
        console.error('导入设置失败:', error)
        window.utools?.showNotification('设置导入失败：无效的配置文件')
      }
    }
    reader.readAsText(file)
  }

  /**
   * @description 初始化设置
   */
  onMounted(() => {
    const savedSettings = window.utools?.dbStorage.getItem('settings')
    if (savedSettings) {
      settings.value = { ...settings.value, ...savedSettings }
    }
  })

  return {
    version,
    settings,
    saveSettings,
    exportSettings,
    importSettings
  }
}