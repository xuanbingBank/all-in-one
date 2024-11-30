<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface NoteSettings {
  storageLocation: string
  autoSave: boolean
  autoSaveInterval: number
}

const settings = ref<NoteSettings>({
  storageLocation: 'notes',
  autoSave: true,
  autoSaveInterval: 30
})

/**
 * @description 保存设置
 */
const saveSettings = async () => {
  await window.utools.dbStorage.setItem('noteSettings', settings.value)
  window.utools.showNotification('笔记设置已保存')
}

/**
 * @description 选择存储位置
 */
const selectLocation = async () => {
  const folder = await window.utools.showOpenDialog({
    title: '选择笔记存储位置',
    properties: ['openDirectory']
  })
  
  if (folder && folder[0]) {
    settings.value.storageLocation = folder[0]
  }
}

onMounted(async () => {
  const savedSettings = await window.utools.dbStorage.getItem('noteSettings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...savedSettings }
  }
})
</script>

<template>
  <div class="note-settings">
    <h2>笔记设置</h2>
    
    <div class="settings-group">
      <h3>存储设置</h3>
      
      <div class="setting-item">
        <label>笔记存储位置</label>
        <div class="location-selector">
          <input 
            type="text" 
            v-model="settings.storageLocation"
            readonly
            placeholder="选择存储位置"
          >
          <button class="select-btn" @click="selectLocation">
            选择目录
          </button>
        </div>
      </div>

      <div class="setting-item">
        <label>
          <input type="checkbox" v-model="settings.autoSave">
          启用自动保存
        </label>
      </div>

      <div class="setting-item" v-if="settings.autoSave">
        <label>自动保存间隔（秒）</label>
        <input 
          type="number" 
          v-model="settings.autoSaveInterval"
          min="5"
          max="300"
        >
      </div>
    </div>

    <div class="actions">
      <button class="action-btn" @click="saveSettings">
        保存设置
      </button>
    </div>
  </div>
</template>

<style scoped>
.note-settings {
  padding: 20px;
}

.settings-group {
  margin-bottom: 24px;
}

.setting-item {
  margin: 16px 0;
  display: flex;
  align-items: center;
}

.setting-item label {
  width: 150px;
  margin-right: 16px;
}

.location-selector {
  flex: 1;
  display: flex;
  gap: 8px;
}

.location-selector input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  background-color: #f7fafc;
}

.select-btn {
  padding: 8px 16px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.select-btn:hover {
  background-color: #3182ce;
}

input[type="number"] {
  width: 100px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.action-btn {
  padding: 8px 16px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #3182ce;
}
</style> 