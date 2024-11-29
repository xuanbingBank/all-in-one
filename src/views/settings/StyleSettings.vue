<script setup lang="ts">
import { ref, onMounted } from 'vue'

/**
 * @description 自定义样式数据
 */
interface CustomStyle {
  menuWidth: number
  menuBgColor: string
  menuTextColor: string
  menuActiveColor: string
  contentBgColor: string
  contentTextColor: string
}

const customStyle = ref<CustomStyle>({
  menuWidth: 200,
  menuBgColor: '#2c3e50',
  menuTextColor: '#ffffff',
  menuActiveColor: '#3498db',
  contentBgColor: '#f5f5f5',
  contentTextColor: '#2c3e50'
})

/**
 * @description 保存样式设置
 */
const saveStyleSettings = () => {
  window.utools?.dbStorage.setItem('customStyle', customStyle.value)
  applyCustomStyle()
  window.utools?.showNotification('样式设置已保存')
}

/**
 * @description 应用自定义样式
 */
const applyCustomStyle = () => {
  const style = customStyle.value
  const root = document.documentElement
  
  // 设置菜单宽度
  root.style.setProperty('--menu-width', `${style.menuWidth}px`)
  
  // 设置菜单颜色
  root.style.setProperty('--menu-bg-color', style.menuBgColor)
  root.style.setProperty('--menu-text-color', style.menuTextColor)
  root.style.setProperty('--menu-active-color', style.menuActiveColor)
  root.style.setProperty('--menu-hover-color', style.menuBgColor + 'dd') // 添加悬浮颜色
  
  // 设置内容区颜色
  root.style.setProperty('--content-bg-color', style.contentBgColor)
  root.style.setProperty('--content-text-color', style.contentTextColor)
}

/**
 * @description 重置样式设置
 */
const resetStyleSettings = () => {
  customStyle.value = {
    menuWidth: 200,
    menuBgColor: '#2c3e50',
    menuTextColor: '#ffffff',
    menuActiveColor: '#3498db',
    contentBgColor: '#f5f5f5',
    contentTextColor: '#2c3e50'
  }
  saveStyleSettings()
}

onMounted(() => {
  const savedStyle = window.utools?.dbStorage.getItem('customStyle')
  if (savedStyle) {
    customStyle.value = { ...customStyle.value, ...savedStyle }
  }
  applyCustomStyle()
})
</script>

<template>
  <div class="style-settings">
    <h3>自定义样式设置</h3>
    
    <div class="settings-group">
      <h4>菜单样式</h4>
      <div class="setting-item">
        <label>菜单宽度</label>
        <div class="input-with-unit">
          <input 
            type="number" 
            v-model="customStyle.menuWidth"
            min="150"
            max="300"
          >
          <span class="unit">px</span>
        </div>
      </div>
      
      <div class="setting-item">
        <label>菜单背景色</label>
        <input 
          type="color" 
          v-model="customStyle.menuBgColor"
        >
      </div>
      
      <div class="setting-item">
        <label>菜单文字颜色</label>
        <input 
          type="color" 
          v-model="customStyle.menuTextColor"
        >
      </div>
      
      <div class="setting-item">
        <label>菜单激活色</label>
        <input 
          type="color" 
          v-model="customStyle.menuActiveColor"
        >
      </div>
    </div>

    <div class="settings-group">
      <h4>内容区样式</h4>
      <div class="setting-item">
        <label>背景颜色</label>
        <input 
          type="color" 
          v-model="customStyle.contentBgColor"
        >
      </div>
      
      <div class="setting-item">
        <label>文字颜色</label>
        <input 
          type="color" 
          v-model="customStyle.contentTextColor"
        >
      </div>
    </div>

    <div class="actions">
      <button class="reset-btn" @click="resetStyleSettings">重置</button>
      <button class="save-btn" @click="saveStyleSettings">保存</button>
    </div>
  </div>
</template>

<style scoped>
.style-settings {
  padding: 20px;
}

.settings-group {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

h4 {
  margin-bottom: 16px;
  color: #2d3748;
}

.setting-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.setting-item label {
  min-width: 120px;
  margin-right: 16px;
  color: #4a5568;
}

.input-with-unit {
  display: flex;
  align-items: center;
}

.unit {
  margin-left: 8px;
  color: #718096;
}

input[type="number"] {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

input[type="color"] {
  width: 50px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.save-btn, .reset-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.save-btn {
  background-color: #4299e1;
  color: white;
}

.save-btn:hover {
  background-color: #3182ce;
}

.reset-btn {
  background-color: #e2e8f0;
  color: #4a5568;
}

.reset-btn:hover {
  background-color: #cbd5e0;
}
</style> 