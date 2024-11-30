/**
 * @description 笔记标签
 */
export interface NoteTag {
  id: string
  name: string
  color: string
}

/**
 * @description 笔记
 */
export interface Note {
  _id: string
  _rev?: string
  title: string
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

/**
 * @description 笔记设置
 */
export interface NoteSettings {
  storageLocation: string
  autoSave: boolean
  autoSaveInterval: number
} 