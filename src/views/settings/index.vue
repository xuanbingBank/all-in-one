<script setup lang="ts">
import { ref } from 'vue'
import pkg from '../../../package.json'

/**
 * @description 版本号
 */
const version = pkg.version

/**
 * @description 主题设置
 */
const theme = ref('light')

/**
 * @description 通知设置
 */
const notifications = ref(true)


/**
 * @description 快捷键设置
 */
const hotkey = ref('Ctrl + Space')

/**
 * @description 语言设置
 */
const language = ref('zh_CN')

/**
 * @description 保存设置
 */
const saveSettings = () => {
  // 这里实现保存设置的逻辑
  window.utools?.showNotification('设置已保存')
}
</script>

<template>
  <div class="content-section">
    <h2>设置</h2>
    
    <div class="settings-group">
      <h3>基本设置</h3>
      
      <div class="setting-item">
        <label>主题</label>
        <select v-model="theme">
          <option value="light">浅色主题</option>
          <option value="dark">深色主题</option>
          <option value="system">跟随系统</option>
        </select>
      </div>

      <div class="setting-item">
        <label>语言</label>
        <select v-model="language">
          <option value="zh_CN">简体中文</option>
          <option value="en_US">English</option>
        </select>
      </div>

      <div class="setting-item">
        <label>
          <input type="checkbox" v-model="notifications">
          启用通知提醒
        </label>
      </div>

    </div>

    <div class="settings-group">
      <h3>快捷键设置</h3>
      <div class="setting-item">
        <label>触发快捷键</label>
        <input type="text" v-model="hotkey" placeholder="点击设置快捷键">
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
      <button class="save-btn" @click="saveSettings">保存设置</button>
    </div>
  </div>
</template>

<style scoped>
.content-section {
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

h2 {
  color: #2c3e50;
  margin-bottom: 24px;
  font-size: 24px;
}

h3 {
  color: #2c3e50;
  margin: 16px 0;
  font-size: 18px;
}

.settings-group {
  margin-bottom: 32px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.setting-item {
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-item label {
  min-width: 120px;
  color: #4a5568;
}

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
  color: #4a5568;
  line-height: 1.6;
}

.about-info a {
  color: #3182ce;
  text-decoration: none;
}

.about-info a:hover {
  text-decoration: underline;
}

.actions {
  margin-top: 24px;
  text-align: right;
}

.save-btn {
  background-color: #4299e1;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: #3182ce;
}
</style> 