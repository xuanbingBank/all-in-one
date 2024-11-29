/**
 * @description 初始视图
 */
window.initialView = 'home'

/**
 * @description 创建自定义事件
 */
const createViewChangeEvent = (view: string) => {
  return new CustomEvent('switchView', { detail: view })
}

/**
 * @description 处理插件准备就绪事件
 */
window.utools.onPluginReady(() => {})

/**
 * @description 处理插件进入事件
 */
window.utools.onPluginEnter(({ code }) => {
  window.initialView = code as 'home' | 'settings' | 'notes'
  window.dispatchEvent(createViewChangeEvent(code))
})

/**
 * @description uTools 插件功能
 */
window.exports = {
  "home": {
    mode: "none",
    args: {
      enter: (_action: { code: string }) => {
        window.utools?.showMainWindow()
      }
    }
  },
  "settings": {
    mode: "none",
    args: {
      enter: (_action: { code: string }) => {
        window.utools?.showMainWindow()
      }
    }
  },
  "notes": {
    mode: "none",
    args: {
      enter: (_action: { code: string }) => {
        window.utools?.showMainWindow()
      }
    }
  }
}
