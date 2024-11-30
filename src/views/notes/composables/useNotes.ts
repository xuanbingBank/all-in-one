import { ref } from 'vue'
import type { Note, NoteTag } from '../types'

/**
 * @description 笔记管理
 */
export function useNotes() {
  const notes = ref<Note[]>([])
  const currentNote = ref<Note | null>(null)
  const tags = ref<NoteTag[]>([])
  const selectedTags = ref<string[]>([])

  /**
   * @description 加载笔记列表
   */
  const loadNotes = async () => {
    const result = await window.utools.db.promises.allDocs('note/')
    notes.value = result.map(doc => doc as unknown as Note)
  }

  /**
   * @description 加载标签列表
   */
  const loadTags = async () => {
    const result = await window.utools.db.promises.allDocs('tag/')
    tags.value = result.map(doc => doc as unknown as NoteTag)
  }

  /**
   * @description 创建笔记
   */
  const createNote = async () => {
    const note: Note = {
      _id: `note/${Date.now()}`,
      title: '新建笔记',
      content: '',
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    await window.utools.db.promises.put(note)
    await loadNotes()
    currentNote.value = note
  }

  /**
   * @description 更新笔记
   */
  const updateNote = async (note: Note) => {
    note.updatedAt = Date.now()
    await window.utools.db.promises.put(note)
    await loadNotes()
  }

  /**
   * @description 删除笔记
   */
  const deleteNote = async (note: Note) => {
    await window.utools.db.promises.remove(note)
    await loadNotes()
    if (currentNote.value?._id === note._id) {
      currentNote.value = null
    }
  }

  /**
   * @description 创建标签
   */
  const createTag = async (name: string, color: string) => {
    const tag = {
      _id: `tag/${Date.now()}`,
      id: `tag/${Date.now()}`,
      name,
      color
    }
    await window.utools.db.promises.put(tag)
    await loadTags()
  }

  /**
   * @description 删除标签
   */
  const deleteTag = async (tagId: string) => {
    await window.utools.db.promises.remove(tagId)
    await loadTags()
    // 从所有笔记中移除此标签
    const notesWithTag = notes.value.filter(note => note.tags.includes(tagId))
    for (const note of notesWithTag) {
      note.tags = note.tags.filter(id => id !== tagId)
      await updateNote(note)
    }
  }

  // 初始化加载
  loadNotes()
  loadTags()

  return {
    notes,
    currentNote,
    tags,
    selectedTags,
    createNote,
    updateNote,
    deleteNote,
    createTag,
    deleteTag
  }
} 