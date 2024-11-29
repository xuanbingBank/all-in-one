<script setup lang="ts">
import { onMounted } from 'vue'
import MainLayout from './components/MainLayout.vue'

// 初始化样式
onMounted(() => {
  const savedStyle = window.utools?.dbStorage.getItem('customStyle')
  if (savedStyle) {
    const style = savedStyle as any
    document.documentElement.style.setProperty('--content-bg-color', style.contentBgColor)
    document.documentElement.style.setProperty('--content-text-color', style.contentTextColor)
  }
})
</script>

<template>
  <MainLayout />
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  background-color: var(--content-bg-color, #f5f5f5);
  color: var(--content-text-color, #2c3e50);
}
</style>
