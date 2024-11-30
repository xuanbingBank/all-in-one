<script setup lang="ts">
import { onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useSettingsData } from './composables/useSettings'
import { useSettingsView } from './composables/useSettingsView'

// 懒加载样式设置组件
const StyleSettings = defineAsyncComponent(() => import('./StyleSettings.vue'))

const {
  version,
  settings,
  saveSettings,
  exportSettings,
  importSettings
} = useSettingsData()

const {
  currentSettingView,
  handleShowGeneralSettings,
  handleShowStyleSettings
} = useSettingsView()

// 添加事件监听
onMounted(() => {
  window.addEventListener('showGeneralSettings', handleShowGeneralSettings)
  window.addEventListener('showStyleSettings', handleShowStyleSettings)
})

// 移除事件监听
onUnmounted(() => {
  window.removeEventListener('showGeneralSettings', handleShowGeneralSettings)
  window.removeEventListener('showStyleSettings', handleShowStyleSettings)
})
</script>

<template>
  <div class="content-section">
    <template v-if="currentSettingView === 'general'">
      <h2>设置</h2>
      
      <div class="settings-group">
        <h3>基本设置</h3>
        
        <div class="setting-item">
          <label>主题</label>
          <select v-model="settings.theme">
            <option value="light">浅色主题</option>
            <option value="dark">深色主题</option>
            <option value="system">跟随系统</option>
          </select>
        </div>

        <div class="setting-item">
          <label>语言</label>
          <select v-model="settings.language">
            <option value="zh_CN">简体中文</option>
            <option value="en_US">English</option>
          </select>
        </div>

        <div class="setting-item">
          <label>
            <input type="checkbox" v-model="settings.notifications">
            启用通知提醒
          </label>
        </div>
      </div>

      <div class="settings-group">
        <h3>快捷键设置</h3>
        <div class="setting-item">
          <label>触发快捷键</label>
          <input type="text" v-model="settings.hotkey" placeholder="点击设置快捷键">
        </div>
      </div>

      <div class="settings-group">
        <h3>数据管理</h3>
        <div class="setting-item">
          <button class="action-btn" @click="exportSettings">导出设置</button>
          <button class="action-btn import-btn">
            导入设置
            <input 
              type="file" 
              accept=".json" 
              @change="importSettings" 
              class="import-input"
            >
          </button>
        </div>
      </div>

      <div class="settings-group">
        <h3>关于</h3>
        <div class="about-info">
          <p>版本：{{ version }}</p>
          <p>作者：xuanbing</p>
          <p>
            <a href="https://github.com/xuanbingBank/all-in-one" target="_blank">
              访问 GitHub
            </a>
          </p>
        </div>
      </div>

      <div class="actions">
        <button class="action-btn" @click="saveSettings">保存设置</button>
      </div>
    </template>
    
    <template v-else-if="currentSettingView === 'style'">
      <Suspense>
        <template #default>
          <StyleSettings />
        </template>
        <template #fallback>
          <div class="loading">
            <span class="loading-text">加载中...</span>
          </div>
        </template>
      </Suspense>
    </template>
  </div>
</template>

<style scoped>
select, input[type="text"] {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
}

input[type="checkbox"] {
  margin-right: 8px;
}

.about-info {
  color: var(--text-secondary);
  line-height: 1.6;
}

.about-info a {
  color: #3182ce;
  text-decoration: none;
}

.about-info a:hover {
  text-decoration: underline;
}

.action-btn {
  background-color: #4299e1;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 12px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #3182ce;
}

.import-btn {
  position: relative;
  overflow: hidden;
}

.import-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style> 