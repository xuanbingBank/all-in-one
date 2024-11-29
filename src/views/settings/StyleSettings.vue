<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

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
 * @description 应用自定义样式
 */
const applyCustomStyle = () => {
  const style = customStyle.value
  const root = document.documentElement
  
  // 设置CSS变量
  root.style.setProperty('--menu-width', `${style.menuWidth}px`)
  root.style.setProperty('--menu-bg-color', style.menuBgColor)
  root.style.setProperty('--menu-text-color', style.menuTextColor)
  root.style.setProperty('--menu-active-color', style.menuActiveColor)
  root.style.setProperty('--menu-hover-color', adjustColor(style.menuBgColor, -10))
  root.style.setProperty('--content-bg-color', style.contentBgColor)
  root.style.setProperty('--content-text-color', style.contentTextColor)

  // 直接应用到主内容区
  const mainContent = document.querySelector('.main-content') as HTMLElement
  if (mainContent) {
    mainContent.style.backgroundColor = style.contentBgColor
    mainContent.style.color = style.contentTextColor
  }

  // 应用到设置组件
  const settingsGroups = document.querySelectorAll('.settings-group') as NodeListOf<HTMLElement>
  settingsGroups.forEach(group => {
    group.style.backgroundColor = adjustColor(style.contentBgColor, 10)
    group.style.color = style.contentTextColor
  })

  // 应用到标签文本
  const labels = document.querySelectorAll('.setting-item label') as NodeListOf<HTMLElement>
  labels.forEach(label => {
    label.style.color = style.contentTextColor
  })

  // 应用到整个应用
  document.body.style.backgroundColor = style.contentBgColor
  document.body.style.color = style.contentTextColor
}

/**
 * @description 调整颜色亮度
 */
const adjustColor = (color: string, amount: number): string => {
  const clamp = (num: number) => Math.min(255, Math.max(0, num))
  
  // 移除 # 号并转换为 RGB
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  // 调整亮度
  const newR = clamp(r + amount)
  const newG = clamp(g + amount)
  const newB = clamp(b + amount)
  
  // 转回 hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

/**
 * @description 保存样式设置
 */
const saveStyleSettings = () => {
  try {
    // 创建一个普通对象而不是响应式对象
    const styleToSave = {
      menuWidth: customStyle.value.menuWidth,
      menuBgColor: customStyle.value.menuBgColor,
      menuTextColor: customStyle.value.menuTextColor,
      menuActiveColor: customStyle.value.menuActiveColor,
      contentBgColor: customStyle.value.contentBgColor,
      contentTextColor: customStyle.value.contentTextColor
    }
    
    // 先应用样式
    applyCustomStyle()
    
    // 保存普通对象到数据库
    window.utools?.dbStorage.setItem('customStyle', styleToSave)
    
    // 触发全局样式更新事件
    window.dispatchEvent(new CustomEvent('styleChanged', { detail: styleToSave }))
    
    window.utools?.showNotification('样式设置已保存')
  } catch (error) {
    console.error('保存样式设置失败:', error)
    window.utools?.showNotification('保存失败，请重试')
  }
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

/**
 * @description 初始化样式
 */
const initStyle = () => {
  const savedStyle = window.utools?.dbStorage.getItem('customStyle')
  if (savedStyle) {
    customStyle.value = { ...customStyle.value, ...savedStyle }
  }
  applyCustomStyle()
}

// 监听样式变化实时预览
watch(() => customStyle.value, () => {
  applyCustomStyle()
}, { deep: true })

// 组件挂载时初始化样式
onMounted(() => {
  initStyle()
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
  padding: var(--spacing-xl);
}

.settings-group {
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

h3, h4 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
}

h4 {
  font-size: var(--font-md);
}

.setting-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.setting-item label {
  min-width: 120px;
  margin-right: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

.input-with-unit {
  display: flex;
  align-items: center;
}

.unit {
  margin-left: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

input[type="number"] {
  width: 80px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: var(--font-sm);
  transition: border-color var(--transition-fast);
}

input[type="number"]:hover {
  border-color: var(--border-hover);
}

input[type="number"]:focus {
  border-color: var(--border-active);
  outline: none;
}

input[type="color"] {
  width: 50px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

input[type="color"]:hover {
  transform: scale(1.05);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-2xl);
}

.save-btn, .reset-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  transition: background-color var(--transition-fast);
}

.save-btn {
  background-color: var(--primary-color);
  color: var(--text-inverse);
}

.save-btn:hover {
  background-color: var(--primary-hover);
}

.reset-btn {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
}

.reset-btn:hover {
  background-color: var(--bg-disabled);
}

/* 添加过渡效果 */
.style-settings,
.settings-group,
.setting-item,
input {
  transition: all var(--transition-normal);
}
</style> 