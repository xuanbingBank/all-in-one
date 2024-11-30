<script setup lang="ts">
import { computed } from 'vue'
import { useNotes } from './composables/useNotes'
import type { Note } from './types'

const {
  notes,
  currentNote,
  tags,
  selectedTags,
  createNote,
  updateNote,
  deleteNote,
  createTag,
  deleteTag
} = useNotes()

/**
 * @description 过滤后的笔记列表
 */
const filteredNotes = computed(() => {
  if (selectedTags.value.length === 0) return notes.value
  return notes.value.filter(note => 
    selectedTags.value.every(tagId => note.tags.includes(tagId))
  )
})

/**
 * @description 选择笔记
 */
const selectNote = (note: Note) => {
  currentNote.value = note
}
</script>

<template>
  <div class="content-section">
    <div class="notes-header">
      <h2>笔记</h2>
      <div class="header-actions">
        <button class="action-btn" @click="createTag('新标签', '#3182ce')">
          新建标签
        </button>
        <button class="action-btn" @click="createNote">
          新建笔记
        </button>
      </div>
    </div>

    <div class="notes-container">
      <!-- 笔记列表 -->
      <div class="notes-list">
        <!-- 标签过滤器 -->
        <div class="tags-filter">
          <div 
            v-for="tag in tags" 
            :key="tag.id"
            class="tag-wrapper"
          >
            <div
              :class="['tag', { active: selectedTags.includes(tag.id) }]"
              :style="{ backgroundColor: tag.color + '20' }"
              @click="selectedTags.includes(tag.id) 
                ? selectedTags = selectedTags.filter(id => id !== tag.id)
                : selectedTags.push(tag.id)"
            >
              {{ tag.name }}
            </div>
            <button class="delete-tag-btn" @click="deleteTag(tag.id)">×</button>
          </div>
        </div>

        <div class="empty-list" v-if="filteredNotes.length === 0">
          暂无笔记
        </div>
        <div v-else class="note-items">
          <div
            v-for="note in filteredNotes"
            :key="note._id"
            :class="['note-item', { active: currentNote?._id === note._id }]"
            @click="selectNote(note)"
          >
            <div class="note-title">{{ note.title }}</div>
            <div class="note-tags">
              <span 
                v-for="tagId in note.tags" 
                :key="tagId"
                class="tag-label"
                :style="{ 
                  backgroundColor: tags.find(t => t.id === tagId)?.color + '20' 
                }"
              >
                {{ tags.find(t => t.id === tagId)?.name }}
              </span>
            </div>
            <div class="note-time">
              {{ new Date(note.updatedAt).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- 笔记编辑区 -->
      <div class="note-editor">
        <div v-if="!currentNote" class="empty-editor">
          选择或创建一个笔记开始编辑
        </div>
        <div v-else class="editor-container">
          <div class="editor-header">
            <input 
              v-model="currentNote.title"
              class="title-input"
              placeholder="笔记标题"
              @change="updateNote(currentNote)"
            >
            <button 
              class="delete-btn"
              @click="deleteNote(currentNote)"
            >
              删除笔记
            </button>
          </div>
          <div class="editor-content">
            <!-- 这里后续会集成 Markdown 编辑器 -->
            <textarea
              v-model="currentNote.content"
              class="content-input"
              placeholder="开始编写..."
              @change="updateNote(currentNote)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
}

.action-btn {
  background-color: #4299e1;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #3182ce;
}

.notes-container {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 0 20px;
  height: calc(100% - 80px);
}

.notes-list {
  width: 250px;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}

.empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #718096;
  font-size: 14px;
}

.note-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.empty-editor {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #718096;
  font-size: 14px;
}

.editor-container {
  height: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.tags-filter {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}

.tag.active {
  outline: 2px solid currentColor;
}

.note-items {
  display: flex;
  flex-direction: column;
}

.note-item {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
}

.note-item:hover {
  background-color: #f7fafc;
}

.note-item.active {
  background-color: #ebf8ff;
}

.note-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.note-tags {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.tag-label {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.note-time {
  font-size: 12px;
  color: #718096;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.title-input {
  font-size: 18px;
  font-weight: 500;
  border: none;
  outline: none;
  width: 100%;
}

.delete-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: #fc8181;
  color: white;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #f56565;
}

.editor-content {
  flex: 1;
  padding: 12px;
}

.content-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.tag-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.delete-tag-btn {
  padding: 0 4px;
  border: none;
  background: none;
  color: #718096;
  cursor: pointer;
  font-size: 14px;
}

.delete-tag-btn:hover {
  color: #e53e3e;
}
</style> 