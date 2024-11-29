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

  // 只应用到除设置页面外的主内容区
  const mainContents = document.querySelectorAll('.main-content:not(.style-settings)') as NodeListOf<HTMLElement>
  mainContents.forEach(content => {
    content.style.backgroundColor = style.contentBgColor
    content.style.color = style.contentTextColor
  })
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

/**
 * @description 处理宽度输入
 */
const handleWidthInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = parseInt(input.value)
  
  // 限制输入范围
  if (value < 120) {
    value = 120
    customStyle.value.menuWidth = 120
  } else if (value > 500) {
    value = 500
    customStyle.value.menuWidth = 500
  }
  
  input.value = value.toString()
}

/**
 * @description 调整宽度
 */
const adjustWidth = (type: 'increase' | 'decrease') => {
  const step = 10
  let newWidth = customStyle.value.menuWidth
  
  if (type === 'increase') {
    newWidth = Math.min(500, newWidth + step)
  } else {
    newWidth = Math.max(120, newWidth - step)
  }
  
  customStyle.value.menuWidth = newWidth
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
  <div class="content-section">
    <h3>自定义样式设置</h3>
    
    <div class="settings-group">
      <h4>菜单样式</h4>
      <div class="setting-item">
        <label>菜单宽度</label>
        <div class="input-with-unit">
          <input 
            type="number" 
            v-model.number="customStyle.menuWidth"
            min="120"
            max="500"
            step="10"
            @input="handleWidthInput"
            readonly
          >
          <div class="number-controls">
            <button class="control-btn" @click="adjustWidth('decrease')">-</button>
            <button class="control-btn" @click="adjustWidth('increase')">+</button>
          </div>
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
        <label>内容区背景颜色</label>
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
      <button class="action-btn" @click="resetStyleSettings">重置</button>
      <button class="action-btn" @click="saveStyleSettings">保存</button>
    </div>
  </div>
</template>

<style scoped>
.input-with-unit {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

input[type="number"] {
  width: 80px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: var(--font-sm);
  background-color: var(--bg-disabled);
  cursor: not-allowed;
}

.number-controls {
  display: flex;
  gap: 4px;
}

.control-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--bg-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.control-btn:hover {
  background-color: var(--bg-hover);
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

/* 添加过渡效��� */
.content-section,
.settings-group,
.setting-item,
input {
  transition: all var(--transition-normal);
}

</style> 