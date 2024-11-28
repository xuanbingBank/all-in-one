<script setup lang="ts">
/**
 * @description 系统版本信息
 */
const chromeVersion = window.versions.chrome()
const electronVersion = window.versions.electron()
const nodeVersion = window.versions.node()
</script>

<template>
  <div class="content-section">
    <div class="logo-container">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="../../assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <h1>Hello World</h1>
    <h1>Utools Vue3 插件模板</h1>
    <p>当前插件系统基于Electron(V{{ electronVersion }})，Chrome(V{{ chromeVersion }})，Node.js(V{{ nodeVersion }})</p>
  </div>
</template>

<style scoped>
.content-section {
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.logo-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

h1 {
  margin-bottom: 16px;
  color: #2c3e50;
}

p {
  color: #666;
  line-height: 1.6;
}
</style> 