/**
 * @description 系统版本信息
 */
window.versions = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
};

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
  window.initialView = code as 'home' | 'settings'
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
  }
}
